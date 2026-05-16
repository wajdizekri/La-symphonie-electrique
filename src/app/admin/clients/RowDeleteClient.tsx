'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { deleteClient } from '@/lib/actions';

export default function RowDeleteClient({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handle = () => {
    startTransition(async () => {
      try { await deleteClient(id); } catch {}
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={pending}
        className="btn btn-secondary"
        title="Supprimer ce client"
        style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: 'var(--error)', color: 'var(--error)' }}
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handle}
        title="Supprimer ce client ?"
        message={`Supprimer définitivement ${name} ainsi que toutes ses demandes, projets et factures associés ? Cette action est irréversible.`}
        type="danger"
        confirmText="Oui, tout supprimer"
      />
    </>
  );
}
