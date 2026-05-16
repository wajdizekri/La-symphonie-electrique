'use client';

import { useState, useTransition } from 'react';
import { Check, Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { updateReviewStatus, deleteReview } from '@/lib/actions';

export default function ReviewActions({
  id,
  status,
  authorName,
}: {
  id: number;
  status: 'pending' | 'approved';
  authorName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const approve = () => {
    startTransition(async () => {
      const res = await updateReviewStatus(id, 'approved');
      if (res.success) router.refresh();
    });
  };

  const remove = () => {
    startTransition(async () => {
      const res = await deleteReview(id);
      if (res.success) router.refresh();
    });
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {status === 'pending' && (
        <button
          onClick={approve}
          disabled={pending}
          className="btn"
          style={{ backgroundColor: 'var(--success)', color: 'white', padding: '8px 14px', fontSize: '0.85rem' }}
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> Approuver</>}
        </button>
      )}
      <button
        onClick={() => setConfirmDelete(true)}
        disabled={pending}
        className="btn btn-secondary"
        style={{ padding: '8px 14px', fontSize: '0.85rem', borderColor: 'var(--error)', color: 'var(--error)' }}
      >
        <Trash2 size={14} /> Supprimer
      </button>
      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        title="Supprimer cet avis ?"
        message={`L'avis de ${authorName} sera supprimé définitivement. Action irréversible.`}
        type="danger"
        confirmText="Oui, supprimer"
      />
    </div>
  );
}
