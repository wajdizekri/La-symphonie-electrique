'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { deletePayment } from '@/lib/actions';

export default function RowDeletePayment({
  id,
  amount,
  status,
  projectTitle,
}: {
  id: number;
  amount: number;
  status: string;
  projectTitle: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handle = () => {
    startTransition(async () => {
      const res = await deletePayment(id);
      if (res.success) router.refresh();
      else alert(res.error || 'Erreur');
    });
  };

  const isPaid = status === 'paid';
  const message = isPaid
    ? `Supprimer la facture de ${amount.toFixed(2)} € pour « ${projectTitle} » ? Cette facture est déjà PAYÉE — son historique sera perdu (n'efface PAS le paiement Stripe). Action irréversible.`
    : `Supprimer la facture en attente de ${amount.toFixed(2)} € pour « ${projectTitle} » ? Action irréversible.`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={pending}
        className="btn btn-secondary"
        title="Supprimer cette facture"
        style={{ padding: '6px 10px', fontSize: '0.75rem', borderColor: 'var(--error)', color: 'var(--error)' }}
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handle}
        title="Supprimer cette facture ?"
        message={message}
        type="danger"
        confirmText="Oui, supprimer"
      />
    </>
  );
}
