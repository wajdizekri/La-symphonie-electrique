import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Devis Gratuit sous 48h',
  description: 'Demandez votre devis gratuit pour vos projets d\'électricité, fibre optique, IRVE ou VMC. Réponse garantie sous 48h. Dépannage urgent 24/7.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
