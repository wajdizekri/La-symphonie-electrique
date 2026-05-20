'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card" style={{ padding: '40px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={56} className="text-gold" style={{ margin: '0 auto 20px' }} />
              <h1 className="text-gold" style={{ fontSize: '1.5rem' }}>Email envoyé</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '15px' }}>
                Si un compte existe pour cet email, un lien de réinitialisation vient d&apos;être envoyé. Vérifiez votre boîte de réception (et vos spams).
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '20px' }}>
                Le lien expire dans 1 heure.
              </p>
              <Link href="/admin/login" className="btn btn-secondary" style={{ marginTop: '25px' }}>
                <ArrowLeft size={16} /> Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center" style={{ marginBottom: '25px' }}>
                <h1 className="text-gold" style={{ fontSize: '1.5rem', margin: 0 }}>Mot de passe oublié</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.9rem' }}>
                  Saisissez votre email, nous vous enverrons un lien pour choisir un nouveau mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    placeholder="email@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%', padding: '12px 14px 12px 42px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border)', color: 'white',
                    }}
                  />
                </div>

                {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px' }}>
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Envoyer le lien'}
                </button>

                <Link href="/admin/login" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                  <ArrowLeft size={14} style={{ display: 'inline', marginRight: '4px' }} /> Retour à la connexion
                </Link>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
