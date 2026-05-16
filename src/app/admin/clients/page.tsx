import db from '@/lib/db';
import Link from 'next/link';
import { History, Phone, Mail, MapPin } from 'lucide-react';
import ClientActions from '@/app/admin/clients/ClientActions';
import RowDeleteClient from '@/app/admin/clients/RowDeleteClient';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';

const PER_PAGE = 20;

function escapeLike(s: string) {
  return s.replace(/[\\%_]/g, c => '\\' + c);
}

export default async function AdminClients({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PER_PAGE;

  const where: string[] = [];
  const params: any[] = [];
  if (q) {
    where.push("(name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR address LIKE ? ESCAPE '\\')");
    const like = `%${escapeLike(q)}%`;
    params.push(like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = (db.prepare(`SELECT COUNT(*) as c FROM clients ${whereSql}`).get(...params) as { c: number }).c;
  const clients = db.prepare(`SELECT * FROM clients ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, PER_PAGE, offset) as any[];

  return (
    <div>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Base Clients</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos contacts et consultez leur historique complet.</p>
        </div>
        <ClientActions mode="add" />
      </header>

      <ListToolbar placeholder="Rechercher un client (nom, email, téléphone, ville)" />

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Client</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Localisation</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? clients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row">
                  <td style={{ padding: '15px 25px' }}>
                    <div style={{ fontWeight: 700, color: 'white' }}>{client.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID&nbsp;: #{client.id}</div>
                  </td>
                  <td style={{ padding: '15px 25px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <Mail size={14} className="text-gold" /> {client.email || '—'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <Phone size={14} className="text-gold" /> {client.phone || 'Non renseigné'}
                    </div>
                  </td>
                  <td style={{ padding: '15px 25px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} /> {client.address || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '15px 25px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <ClientActions mode="edit" client={client} />
                      <Link
                        href={`/admin/clients/${client.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <History size={14} /> Historique
                      </Link>
                      <RowDeleteClient id={client.id} name={client.name} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {q ? `Aucun résultat pour "${q}"` : 'Aucun client dans la base.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        total={total}
        perPage={PER_PAGE}
        basePath="/admin/clients"
        searchParams={sp}
      />
    </div>
  );
}
