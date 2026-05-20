import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User, Mail, ShieldCheck } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';

export default async function AdminAccountPage() {
  const session = await getSession();
  if (!session || typeof session.id !== 'number') {
    redirect('/admin/login');
  }

  const me = db.prepare(
    'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?'
  ).get(session.id) as
    | { id: number; name: string; email: string; role: string; status: string; created_at: string }
    | undefined;

  if (!me) redirect('/admin/login');

  return (
    <div>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Mon compte</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Gérez vos informations et votre mot de passe.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Profil</h2>
          <div style={{ display: 'grid', gap: '14px', marginTop: '15px' }}>
            <Row icon={<User size={16} className="text-gold" />} label="Nom" value={me.name} />
            <Row icon={<Mail size={16} className="text-gold" />} label="Email" value={me.email} />
            <Row icon={<ShieldCheck size={16} className="text-gold" />} label="Rôle" value={me.role} />
            <Row label="Statut" value={me.status} />
            <Row label="Compte créé le" value={new Date(me.created_at).toLocaleDateString('fr-FR')} />
          </div>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {icon} {label}
      </span>
      <span style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
