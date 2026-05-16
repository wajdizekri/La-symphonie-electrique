'use client';

import { deleteClient } from '@/lib/actions';
import DangerDeleteButton from '@/components/admin/DangerDeleteButton';

export default function DeleteClientButton({
  id,
  clientName,
  requestsCount,
  projectsCount,
  paymentsCount,
}: {
  id: number;
  clientName: string;
  requestsCount: number;
  projectsCount: number;
  paymentsCount: number;
}) {
  const dependencies: string[] = [];
  if (requestsCount > 0) dependencies.push(`${requestsCount} demande${requestsCount > 1 ? 's' : ''}`);
  if (projectsCount > 0) dependencies.push(`${projectsCount} projet${projectsCount > 1 ? 's' : ''}`);
  if (paymentsCount > 0) dependencies.push(`${paymentsCount} paiement${paymentsCount > 1 ? 's' : ''}`);

  const message = dependencies.length > 0
    ? `Supprimer définitivement ${clientName} ainsi que ${dependencies.join(', ')} associé${dependencies.length > 1 ? 's' : ''} ? Cette action est irréversible.`
    : `Supprimer définitivement ${clientName} ? Cette action est irréversible.`;

  return (
    <DangerDeleteButton
      onConfirm={async () => { await deleteClient(id); }}
      label="Supprimer ce client"
      modalTitle="Supprimer ce client ?"
      modalMessage={message}
      confirmText="Oui, tout supprimer"
    />
  );
}
