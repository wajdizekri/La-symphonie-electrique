import db from '@/lib/db';
import { ShieldCheck, User, Mail, Calendar } from 'lucide-react';
import UserActions from './UserActions';

export default function AdminUsersPage() {
  const users = db.prepare(
    'SELECT id, name, email, role, status, created_at FROM users ORDER BY status DESC, created_at DESC'
  ).all() as any[];

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Gestion des Accès</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Approuvez ou refusez les nouveaux comptes administrateurs.</p>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--warning)' }}>
          En attente ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun compte en attente.
          </div>
        ) : (
          <div className="grid" style={{ gap: '15px' }}>
            {pending.map(u => (
              <div key={u.id} className="card" style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '20px',
                borderLeft: '4px solid var(--warning)'
              }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'white' }}>
                    <User size={16} className="text-gold" />
                    {u.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Mail size={16} />
                    {u.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Calendar size={16} />
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <UserActions userId={u.id} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--success)' }}>
          Approuvés ({approved.length})
        </h2>
        <div className="grid" style={{ gap: '10px' }}>
          {approved.map(u => (
            <div key={u.id} className="card" style={{
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShieldCheck size={18} className="text-success" />
                <span style={{ fontWeight: 600 }}>{u.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
