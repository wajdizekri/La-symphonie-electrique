'use client';

import { useState } from 'react';
import { CreditCard, Link2, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectActions({
  projectId,
  trackingToken,
}: {
  projectId: number;
  trackingToken: string | null;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    if (!trackingToken) return;
    const url = `${window.location.origin}/suivi?token=${trackingToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(url);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Montant invalide.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, amount: parsed }),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Erreur');
        return;
      }
      setShowModal(false);
      setAmount('');
      router.refresh();
    } catch {
      setError('Erreur réseau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary"
        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
      >
        <CreditCard size={14} /> Créer une facture
      </button>
      <button
        onClick={copyLink}
        disabled={!trackingToken}
        className="btn btn-secondary"
        style={{ padding: '8px 16px', fontSize: '0.875rem' }}
      >
        {copied ? <><Check size={14} /> Copié</> : <><Link2 size={14} /> Lien client</>}
      </button>

      {showModal && (
        <div
          onClick={() => !submitting && setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{ minWidth: '400px', padding: '30px' }}
          >
            <h3 style={{ marginTop: 0 }}>Nouvelle facture</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Le client verra cette ligne sur sa page de suivi et pourra la régler via Stripe.
            </p>
            <form onSubmit={submit}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px' }}>
                Montant (€)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'white', marginBottom: '15px',
                }}
              />
              {error && (
                <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '15px' }}>{error}</p>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px' }}
                >
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '10px 20px' }}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
