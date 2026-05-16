'use client';

import { useState } from 'react';
import { UserPlus, Edit2, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function ClientActions({ mode, client }: { mode: 'add' | 'edit', client?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = mode === 'add' ? 'POST' : 'PATCH';
      const body = mode === 'add' ? formData : { ...formData, id: client.id };

      const res = await fetch('/api/admin/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        router.refresh();
        showToast(
          mode === 'add' ? 'Client créé avec succès !' : 'Informations client mises à jour.',
          'success'
        );
        setIsOpen(false);
      } else {
        showToast('Erreur lors de l\'enregistrement.', 'error');
      }
    } catch (err) {
      showToast('Erreur réseau.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === 'add' ? (
        <button onClick={() => setIsOpen(true)} className="btn btn-primary" style={{ gap: '10px' }}>
          <UserPlus size={18} /> Nouveau Client
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
          <Edit2 size={14} /> Modifier
        </button>
      )}

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="card" style={{ width: '500px', padding: '30px', position: 'relative' }}>
            <button onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '25px' }}>{mode === 'add' ? 'Ajouter un Client' : 'Modifier le Client'}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Nom Complet</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Téléphone</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Adresse</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                {loading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'add' ? 'Créer le client' : 'Sauvegarder')}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
