'use client';

import { deleteProject } from '@/lib/actions';
import DangerDeleteButton from '@/components/admin/DangerDeleteButton';

export default function DeleteProjectButton({
  id,
  title,
  paymentsCount,
  paidCount,
}: {
  id: number;
  title: string;
  paymentsCount: number;
  paidCount: number;
}) {
  let message = `Supprimer définitivement « ${title} » ?`;
  if (paymentsCount > 0) {
    message += `\n\nCela supprimera également ${paymentsCount} facture${paymentsCount > 1 ? 's' : ''} liée${paymentsCount > 1 ? 's' : ''}`;
    if (paidCount > 0) {
      message += ` (dont ${paidCount} déjà payée${paidCount > 1 ? 's' : ''} — historique perdu !)`;
    }
    message += '.';
  }
  message += '\n\nCette action est irréversible.';

  return (
    <DangerDeleteButton
      onConfirm={async () => { await deleteProject(id); }}
      label="Supprimer ce projet"
      modalTitle="Supprimer ce projet ?"
      modalMessage={message}
      confirmText="Oui, supprimer"
    />
  );
}
