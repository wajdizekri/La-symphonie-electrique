'use client';

import { useState } from 'react';
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 44px 12px 14px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
  fontSize: '0.95rem',
};

function PasswordField({
  label, value, onChange, autoFocus = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: 'grid', gap: '6px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? 'Masquer' : 'Afficher'}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm() {
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (newPassword !== confirm) {
      return setFeedback({ kind: 'err', msg: 'Les deux nouveaux mots de passe ne correspondent pas.' });
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ kind: 'ok', msg: 'Mot de passe mis à jour ✅' });
        setCurrent(''); setNew(''); setConfirm('');
      } else {
        setFeedback({ kind: 'err', msg: data.error || 'Erreur' });
      }
    } catch {
      setFeedback({ kind: 'err', msg: 'Erreur réseau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card" style={{ padding: '24px', display: 'grid', gap: '18px', maxWidth: '480px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Lock size={20} className="text-gold" />
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Changer mon mot de passe</h2>
      </div>

      <PasswordField label="Mot de passe actuel" value={currentPassword} onChange={setCurrent} autoFocus />
      <PasswordField label="Nouveau mot de passe (min 8 caractères, lettre + chiffre)" value={newPassword} onChange={setNew} />
      <PasswordField label="Confirmer le nouveau mot de passe" value={confirm} onChange={setConfirm} />

      {feedback && (
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          color: feedback.kind === 'ok' ? 'var(--success)' : 'var(--error)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {feedback.kind === 'ok' && <CheckCircle size={16} />}
          {feedback.msg}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px', justifySelf: 'start' }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Mettre à jour'}
      </button>
    </form>
  );
}
