import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Services — Électricité, Fibre, IRVE, VMC',
  description: 'Tous nos services : installation électrique, fibre optique, bornes de recharge IRVE, VMC, dépannage 24/7. Devis gratuit sous 48h.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
