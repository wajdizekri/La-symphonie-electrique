import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FileText, CheckCircle2, Clock, ChevronLeft, CreditCard, Briefcase, AlertTriangle } from 'lucide-react';
import ClientEditForm from './ClientEditForm';
import DeleteClientButton from './DeleteClientButton';

type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
};

type Request = { id: number; service_type: string; description: string; status: string; created_at: string };
type Project = { id: number; title: string; status: string; created_at: string };
type Payment = { id: number; amount: number; status: string; stripe_session_id: string | null; created_at: string };

export default async function ClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clientId = Number(id);
  if (!Number.isFinite(clientId)) notFound();

  const client = db.prepare('SELECT id, name, email, phone, address, created_at FROM clients WHERE id = ?').get(clientId) as Client | undefined;
  if (!client) notFound();

  const requests = db.prepare(
    'SELECT id, service_type, description, status, created_at FROM requests WHERE client_id = ? ORDER BY created_at DESC'
  ).all(clientId) as Request[];

  const projects = db.prepare(
    'SELECT id, title, status, created_at FROM projects WHERE client_id = ? ORDER BY created_at DESC'
  ).all(clientId) as Project[];

  const payments = db.prepare(`
    SELECT payments.id, payments.amount, payments.status, payments.stripe_session_id, payments.created_at
    FROM payments
    JOIN projects ON payments.project_id = projects.id
    WHERE projects.client_id = ?
    ORDER BY payments.created_at DESC
  `).all(clientId) as Payment[];

  return (
    <div>
      <Link href="/admin/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
        <ChevronLeft size={16} /> Retour à la liste
      </Link>

      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>{client.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Client #{client.id} · Créé le {new Date(client.created_at).toLocaleDateString('fr-FR')}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 15px 0' }}>Informations client</h2>
          <ClientEditForm client={client} />
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Activité</h3>
            <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Demandes</span><strong>{requests.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Projets</span><strong>{projects.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Paiements</span><strong>{payments.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CA encaissé</span>
                <strong style={{ color: 'var(--success)' }}>
                  {payments.filter(p => p.status === 'paid').reduce((a, p) => a + p.amount, 0).toFixed(2)} €
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <section className="card" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <FileText size={18} className="text-gold" /> Demandes ({requests.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {requests.length > 0 ? requests.map(req => (
              <div key={req.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{req.service_type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(req.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{req.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: req.status === 'approved' ? 'var(--success)' : req.status === 'rejected' ? 'var(--error)' : 'var(--accent-gold)' }}>
                  {req.status === 'approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {req.status.toUpperCase()}
                </div>
              </div>
            )) : <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Aucune demande.</p>}
          </div>
        </section>

        <section className="card" style={{ padding: '24px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Briefcase size={18} className="text-gold" /> Projets ({projects.length})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {projects.length > 0 ? projects.map(proj => (
              <Link
                key={proj.id}
                href={`/admin/projects/${proj.id}`}
                style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{proj.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Statut&nbsp;: {proj.status}</div>
              </Link>
            )) : <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Aucun projet.</p>}
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: '24px', padding: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <CreditCard size={18} className="text-gold" /> Historique des paiements ({payments.length})
        </h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {payments.length > 0 ? payments.map(pay => (
            <div key={pay.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{pay.amount.toFixed(2)} €</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {pay.stripe_session_id ? `${pay.stripe_session_id.slice(0, 20)}…` : 'Pas encore réglé'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem' }}>{new Date(pay.created_at).toLocaleDateString('fr-FR')}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: pay.status === 'paid' ? 'var(--success)' : 'var(--accent-gold)' }}>
                  {pay.status === 'paid' ? 'PAYÉ' : 'EN ATTENTE'}
                </div>
              </div>
            </div>
          )) : <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Aucun paiement enregistré.</p>}
        </div>
      </section>

      <section style={{ marginTop: '40px', padding: '20px 24px', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: 'var(--error)' }}>
          <AlertTriangle size={18} /> Zone dangereuse
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          La suppression d&apos;un client supprime aussi ses demandes, projets et factures associés. Action irréversible.
        </p>
        <DeleteClientButton
          id={client.id}
          clientName={client.name}
          requestsCount={requests.length}
          projectsCount={projects.length}
          paymentsCount={payments.length}
        />
      </section>
    </div>
  );
}
