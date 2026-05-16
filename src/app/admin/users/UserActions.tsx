'use client';

import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserActions({ userId }: { userId: number }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const router = useRouter();

  const call = async (action: 'approve' | 'reject') => {
    setLoading(action);
    try {
      const res = action === 'approve'
        ? await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' }),
          })
        : await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });

      if (res.ok) router.refresh();
      else alert((await res.json()).error || 'Erreur');
    } catch {
      alert('Erreur réseau.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => call('approve')}
        disabled={loading !== null}
        className="btn"
        style={{ backgroundColor: 'var(--success)', color: 'white', padding: '8px 16px', fontSize: '0.85rem' }}
      >
        {loading === 'approve' ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Approuver</>}
      </button>
      <button
        onClick={() => call('reject')}
        disabled={loading !== null}
        className="btn"
        style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', padding: '8px 16px', fontSize: '0.85rem' }}
      >
        {loading === 'reject' ? <Loader2 size={16} className="animate-spin" /> : <><X size={16} /> Rejeter</>}
      </button>
    </div>
  );
}
