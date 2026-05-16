'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function DangerDeleteButton({
  onConfirm,
  label = 'Supprimer',
  modalTitle,
  modalMessage,
  confirmText = 'Oui, supprimer',
}: {
  onConfirm: () => Promise<unknown>;
  label?: string;
  modalTitle: string;
  modalMessage: string;
  confirmText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handle = () => {
    startTransition(async () => {
      try {
        await onConfirm();
      } catch (e) {
        // server action threw → ignore (likely a redirect, which is the success path)
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={pending}
        className="btn"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--error)',
          color: 'var(--error)',
          padding: '10px 18px',
          fontSize: '0.875rem',
        }}
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> {label}</>}
      </button>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handle}
        title={modalTitle}
        message={modalMessage}
        type="danger"
        confirmText={confirmText}
      />
    </>
  );
}
