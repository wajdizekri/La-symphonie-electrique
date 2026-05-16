'use client';

import { useState, useTransition } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateClient } from '@/lib/actions';

type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
  fontSize: '0.9rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  fontWeight: 700,
};

export default function ClientEditForm({ client }: { client: Client }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateClient(formData);
      if (res.success) {
        setFeedback({ kind: 'ok', msg: 'Modifications enregistrées.' });
        router.refresh();
      } else {
        setFeedback({ kind: 'err', msg: res.error || 'Erreur' });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="card" style={{ padding: '24px' }}>
      <input type="hidden" name="id" value={client.id} />

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Nom complet</label>
        <input name="name" defaultValue={client.name} required style={inputStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" defaultValue={client.email ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Téléphone</label>
          <input name="phone" type="tel" defaultValue={client.phone ?? ''} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Adresse</label>
        <input name="address" defaultValue={client.address ?? ''} style={inputStyle} placeholder="12 rue des Glières, 74300 Cluses" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        {feedback && (
          <span style={{
            fontSize: '0.85rem',
            color: feedback.kind === 'ok' ? 'var(--success)' : 'var(--error)',
          }}>
            {feedback.msg}
          </span>
        )}
        <button type="submit" disabled={pending} className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 20px' }}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Enregistrer</>}
        </button>
      </div>
    </form>
  );
}
