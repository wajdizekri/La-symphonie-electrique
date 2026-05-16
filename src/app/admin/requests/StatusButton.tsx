'use client';

import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function StatusButton({ requestId, status }: { requestId: number, status: 'approved' | 'rejected' }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        router.refresh();
        showToast(
          status === 'approved' ? 'Demande acceptée et email envoyé !' : 'Demande refusée.', 
          status === 'approved' ? 'success' : 'info'
        );
      } else {
        const data = await res.json();
        showToast(`Erreur: ${data.error || 'Inconnue'}`, 'error');
      }
    } catch (err) {
      showToast('Erreur réseau.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {status === 'approved' ? (
        <button 
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="btn" 
          style={{ 
            backgroundColor: 'var(--success)', 
            color: 'white', 
            padding: '10px 20px',
            fontSize: '0.85rem'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Accepter</>}
        </button>
      ) : (
        <button 
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="btn" 
          style={{ 
            backgroundColor: 'transparent', 
            border: '1px solid var(--error)',
            color: 'var(--error)', 
            padding: '10px 20px',
            fontSize: '0.85rem'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><X size={16} /> Refuser</>}
        </button>
      )}

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleUpdate}
        title={status === 'approved' ? 'Accepter la demande ?' : 'Refuser la demande ?'}
        message={`Voulez-vous vraiment ${status === 'approved' ? 'accepter' : 'refuser'} ce devis ? Un email automatique sera envoyé au client.`}
        type={status === 'approved' ? 'info' : 'danger'}
        confirmText={status === 'approved' ? 'Oui, accepter' : 'Oui, refuser'}
      />
    </>
  );
}
