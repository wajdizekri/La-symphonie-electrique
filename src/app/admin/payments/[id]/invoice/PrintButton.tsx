'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: '10px 20px',
        backgroundColor: '#fac015',
        color: '#1a1a1a',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <Printer size={16} /> Imprimer / Enregistrer en PDF
    </button>
  );
}
