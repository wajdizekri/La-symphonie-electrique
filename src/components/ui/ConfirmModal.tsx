'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle } from 'lucide-react';

const noopSubscribe = () => () => {};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'warning'
}: ConfirmModalProps) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const color = type === 'danger' ? 'var(--error)' : 'var(--accent-gold)';

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 99999, // Priorité maximale
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="card" style={{ 
        width: '90%',
        maxWidth: '450px', 
        padding: '40px', 
        position: 'relative',
        textAlign: 'center',
        border: `1px solid ${color}44`,
        boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 30px ${color}11`,
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '20px'
      }}>
        <div style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          backgroundColor: `${color}11`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 25px',
          color: color,
          border: `1px solid ${color}33`
        }}>
          <AlertCircle size={38} />
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'white' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '35px', fontSize: '1rem', lineHeight: '1.6' }}>
          {message}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '14px', borderRadius: '12px' }}
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="btn btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: color,
              borderColor: color,
              color: type === 'danger' ? 'white' : 'black',
              fontWeight: 700
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
