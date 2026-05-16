import db from '@/lib/db';
import { FileText, Mail, Calendar, User, ImageIcon } from 'lucide-react';
import StatusButton from '@/app/admin/requests/StatusButton';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';

function parseImages(raw: unknown): string[] {
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter(s => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

const PER_PAGE = 20;

function escapeLike(s: string) {
  return s.replace(/[\\%_]/g, c => '\\' + c);
}

const STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Acceptée' },
  { value: 'rejected', label: 'Refusée' },
  { value: 'completed', label: 'Terminée' },
];

export default async function AdminRequests({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const status = sp.status ?? '';
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PER_PAGE;

  const where: string[] = [];
  const params: any[] = [];
  if (q) {
    where.push("(clients.name LIKE ? ESCAPE '\\' OR clients.email LIKE ? ESCAPE '\\' OR requests.description LIKE ? ESCAPE '\\')");
    const like = `%${escapeLike(q)}%`;
    params.push(like, like, like);
  }
  if (status) {
    where.push('requests.status = ?');
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = (db.prepare(
    `SELECT COUNT(*) as c FROM requests JOIN clients ON requests.client_id = clients.id ${whereSql}`
  ).get(...params) as { c: number }).c;

  const requests = db.prepare(`
    SELECT requests.*, clients.name, clients.email, clients.phone
    FROM requests
    JOIN clients ON requests.client_id = clients.id
    ${whereSql}
    ORDER BY requests.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, PER_PAGE, offset) as any[];

  return (
    <div>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Gestion des Demandes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Validez ou refusez les demandes de devis entrantes.</p>
      </header>

      <ListToolbar placeholder="Rechercher (nom client, email, description)" statusOptions={STATUSES} />

      <div className="grid" style={{ gap: '20px' }}>
        {requests.length > 0 ? requests.map((req) => (
          <div key={req.id} className="card" style={{
            padding: '25px',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '20px',
            borderLeft: req.status === 'approved' ? '4px solid var(--success)' :
                       req.status === 'rejected' ? '4px solid var(--error)' :
                       '4px solid var(--accent-gold)'
          }}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                  <User size={16} className="text-gold" />
                  {req.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                  {req.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Calendar size={16} />
                  {new Date(req.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent-gold)',
                  marginBottom: '10px'
                }}>
                  {req.service_type}
                </span>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {req.description}
                </p>
              </div>

              {(() => {
                const imgs = parseImages(req.images);
                if (imgs.length === 0) return null;
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                      <ImageIcon size={14} className="text-gold" />
                      {imgs.length} photo{imgs.length > 1 ? 's' : ''} jointe{imgs.length > 1 ? 's' : ''}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {imgs.map((src, i) => (
                        <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                          <img
                            src={src}
                            alt={`Photo ${i + 1}`}
                            style={{
                              width: '72px',
                              height: '72px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid var(--border)',
                              cursor: 'zoom-in',
                              display: 'block',
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {req.status === 'pending' ? (
                <>
                  <StatusButton requestId={req.id} status="approved" />
                  <StatusButton requestId={req.id} status="rejected" />
                </>
              ) : (
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: req.status === 'approved' ? 'var(--success)' : 'var(--error)',
                  textTransform: 'uppercase'
                }}>
                  {req.status === 'approved' ? '✅ Accepté' : '❌ Refusé'}
                </span>
              )}
            </div>
          </div>
        )) : (
          <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
            <FileText size={48} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
            <p>{q || status ? 'Aucun résultat pour ces filtres.' : 'Aucune demande de devis pour le moment.'}</p>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        perPage={PER_PAGE}
        basePath="/admin/requests"
        searchParams={sp}
      />
    </div>
  );
}
