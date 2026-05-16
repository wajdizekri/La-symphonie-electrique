'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Erreur lors de l\'connexion.');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div className="card" style={{ padding: '40px', marginBottom: '25px' }}>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: 'rgba(250, 204, 21, 0.1)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: 'var(--accent-gold)'
            }}>
              <Lock size={30} />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Espace Administrateur</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Identifiez-vous pour gérer votre activité.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="votre@email.fr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 12px 12px 40px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '1px solid var(--border)',
                    color: 'white'
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '12px 12px 12px 40px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '1px solid var(--border)',
                    color: 'white'
                  }} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Se connecter'}
            </button>
          </form>

          {error && <p style={{ color: 'var(--error)', marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
          
          <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.85rem' }}>
            <Link href="/admin/register" style={{ color: 'var(--accent-gold)' }}>Créer un compte administrateur</Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px', 
            color: 'white', 
            fontSize: '0.95rem',
            fontWeight: 500,
            textDecoration: 'none',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <ArrowLeft size={18} /> Retour au site
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
