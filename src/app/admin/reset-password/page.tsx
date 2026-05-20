'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
        <AlertTriangle size={48} style={{ color: 'var(--error)', margin: '0 auto 15px' }} />
        <h1 style={{ fontSize: '1.3rem', margin: 0 }}>Lien invalide</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
          Ce lien ne contient pas de token. Refais une demande depuis la page « Mot de passe oublié ».
        </p>
        <Link href="/admin/forgot-password" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push('/admin/login?reset=1'), 1500);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
        <CheckCircle size={56} className="text-gold" style={{ margin: '0 auto 20px' }} />
        <h1 className="text-gold" style={{ fontSize: '1.5rem' }}>Mot de passe mis à jour</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
          Redirection vers la connexion…
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '40px', maxWidth: '420px', width: '100%' }}>
      <div className="text-center" style={{ marginBottom: '25px' }}>
        <h1 className="text-gold" style={{ fontSize: '1.5rem', margin: 0 }}>Nouveau mot de passe</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.9rem' }}>
          Minimum 8 caractères, au moins une lettre et un chiffre.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="password"
            required
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={inputStyle}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px' }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '420px' }}>
        <Suspense fallback={<div className="card" style={{ padding: '40px' }}>Chargement…</div>}>
          <ResetPasswordInner />
        </Suspense>
      </motion.div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
};
