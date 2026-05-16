'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/login?registered=true');
      } else {
        setError(data.error || 'Erreur lors de l\'inscription.');
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
        style={{ width: '100%', maxWidth: '450px' }}
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
              <UserPlus size={30} />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Créer un compte Admin</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Initialisez l'accès gestion de la plateforme.</p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nom complet</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Mot de passe</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-md)', 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: '1px solid var(--border)',
                    color: 'white'
                  }} 
                />
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirmation</label>
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
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
              {loading ? <Loader2 className="animate-spin" /> : 'Créer mon compte'}
            </button>
          </form>

          {error && <p style={{ color: 'var(--error)', marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}
        </div>

        <div className="text-center">
          <Link href="/admin/login" style={{ 
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
            <ArrowLeft size={18} /> Retour au login
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
