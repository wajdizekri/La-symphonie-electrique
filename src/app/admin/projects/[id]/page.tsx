import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Calendar, Download, AlertTriangle } from 'lucide-react';
import ProjectEditForm from './ProjectEditForm';
import DeleteProjectButton from './DeleteProjectButton';

type ProjectRow = {
  id: number;
  client_id: number;
  title: string;
  description: string | null;
  status: 'planning' | 'in_progress' | 'completed';
  start_date: string | null;
  end_date: string | null;
  internal_notes: string | null;
  tracking_token: string | null;
  created_at: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
};

type PaymentRow = {
  id: number;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  stripe_session_id: string | null;
  created_at: string;
};

type InterventionRow = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  status: string;
};

const statusBadge = (s: string) => {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    planning: { bg: 'rgba(250, 204, 21, 0.1)', fg: 'var(--accent-gold)', label: 'En préparation' },
    in_progress: { bg: 'rgba(56, 189, 248, 0.1)', fg: 'var(--accent-blue)', label: 'En cours' },
    completed: { bg: 'rgba(34, 197, 94, 0.1)', fg: 'var(--success)', label: 'Terminé' },
    pending: { bg: 'rgba(250, 204, 21, 0.1)', fg: 'var(--accent-gold)', label: 'En attente' },
    paid: { bg: 'rgba(34, 197, 94, 0.1)', fg: 'var(--success)', label: 'Payé' },
    failed: { bg: 'rgba(239, 68, 68, 0.1)', fg: 'var(--error)', label: 'Échec' },
  };
  return map[s] ?? { bg: 'rgba(255,255,255,0.05)', fg: 'var(--text-muted)', label: s };
};

export default async function AdminProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isFinite(projectId)) notFound();

  const project = db.prepare(`
    SELECT projects.*, clients.name AS client_name, clients.email AS client_email,
           clients.phone AS client_phone, clients.address AS client_address
    FROM projects
    JOIN clients ON projects.client_id = clients.id
    WHERE projects.id = ?
  `).get(projectId) as ProjectRow | undefined;

  if (!project) notFound();

  const payments = db.prepare(
    'SELECT id, amount, status, stripe_session_id, created_at FROM payments WHERE project_id = ? ORDER BY created_at DESC'
  ).all(projectId) as PaymentRow[];

  const interventions = db.prepare(
    'SELECT id, title, description, date, start_time, status FROM interventions WHERE client_id = ? ORDER BY date DESC LIMIT 10'
  ).all(project.client_id) as InterventionRow[];

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <Link href="/admin/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Retour aux projets
      </Link>

      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{project.title}</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <span>Projet #{project.id}</span>
            <span>•</span>
            <span>Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        <span style={{
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          backgroundColor: statusBadge(project.status).bg,
          color: statusBadge(project.status).fg,
        }}>
          {statusBadge(project.status).label}
        </span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 15px 0' }}>Détails du projet</h2>
          <ProjectEditForm project={project} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Client</h3>
            <Link href={`/admin/clients/${project.client_id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white', marginBottom: '15px' }}>
              <User size={18} className="text-gold" />
              <strong>{project.client_name}</strong>
            </Link>
            {project.client_email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Mail size={14} className="text-gold" /> {project.client_email}
              </div>
            )}
            {project.client_phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Phone size={14} className="text-gold" /> {project.client_phone}
              </div>
            )}
            {project.client_address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} className="text-gold" /> {project.client_address}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Facturation</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Encaissé</span>
              <strong style={{ color: 'var(--success)' }}>{totalPaid.toFixed(2)} €</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>En attente</span>
              <strong style={{ color: 'var(--accent-gold)' }}>{totalPending.toFixed(2)} €</strong>
            </div>
          </div>

          {project.tracking_token && (
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Code de suivi</h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-gold)', wordBreak: 'break-all' }}>
                {project.tracking_token}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CreditCard size={18} className="text-gold" /> Factures ({payments.length})
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {payments.length === 0 ? (
            <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>
              Aucune facture pour ce projet. Crée-en une depuis la liste des projets.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Montant</th>
                  <th style={{ padding: '12px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Statut</th>
                  <th style={{ padding: '12px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Stripe Session</th>
                  <th style={{ padding: '12px 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Facture</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const b = statusBadge(p.status);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 20px', fontSize: '0.875rem' }}>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '12px 20px', fontWeight: 700 }}>{p.amount.toFixed(2)} €</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: b.bg, color: b.fg }}>
                          {b.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {p.stripe_session_id ? `${p.stripe_session_id.slice(0, 24)}…` : '—'}
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <Link
                          href={`/admin/payments/${p.id}/invoice`}
                          target="_blank"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        >
                          <Download size={12} /> PDF
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {interventions.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} className="text-gold" /> Interventions liées au client ({interventions.length})
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {interventions.map((iv) => (
              <div key={iv.id} className="card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{iv.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(iv.date).toLocaleDateString('fr-FR')} {iv.start_time ?? ''}
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{iv.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section style={{ marginTop: '40px', padding: '20px 24px', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: 'var(--error)' }}>
          <AlertTriangle size={18} /> Zone dangereuse
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          La suppression d&apos;un projet supprime aussi toutes ses factures (y compris celles déjà encaissées). Action irréversible.
        </p>
        <DeleteProjectButton
          id={project.id}
          title={project.title}
          paymentsCount={payments.length}
          paidCount={payments.filter(p => p.status === 'paid').length}
        />
      </section>
    </div>
  );
}
