'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, X, Briefcase } from 'lucide-react';
import { createProject } from '@/lib/actions';

type Client = { id: number; name: string; email: string | null };

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
  fontSize: '0.9rem',
};

export default function NewProjectButton({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [clientId, setClientId] = useState<string>(clients[0]?.id ? String(clients[0].id) : '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cid = Number(clientId);
    if (!Number.isFinite(cid) || cid <= 0) {
      setError('Sélectionnez un client.');
      return;
    }
    startTransition(async () => {
      const res = await createProject({ clientId: cid, title, description });
      if (res.success) {
        setOpen(false);
        setTitle(''); setDescription('');
        router.push(`/admin/projects/${res.projectId}`);
      } else {
        setError(res.error || 'Erreur');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => clients.length > 0 ? setOpen(true) : alert('Crée d\'abord un client.')}
        className="btn btn-secondary"
        style={{ fontSize: '0.8rem', padding: '8px 16px' }}
      >
        <Plus size={14} /> Nouveau Chantier
      </button>

      {open && (
        <div
          onClick={() => !pending && setOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ width: '90%', maxWidth: '500px', padding: '28px', position: 'relative' }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Briefcase size={22} className="text-gold" />
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Nouveau chantier</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client</label>
                <select value={clientId} onChange={(e) => setClientId(e.target.value)} style={inputStyle}>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.email ? ` — ${c.email}` : ''}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Titre du chantier</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Pose borne IRVE 7,4 kW"
                  autoFocus
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Description (facultatif)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails du chantier visibles côté client…"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '5px' }}>
                <button type="button" onClick={() => setOpen(false)} disabled={pending} className="btn btn-secondary" style={{ padding: '10px 18px' }}>
                  Annuler
                </button>
                <button type="submit" disabled={pending} className="btn btn-primary" style={{ padding: '10px 18px' }}>
                  {pending ? <Loader2 size={16} className="animate-spin" /> : 'Créer le chantier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
