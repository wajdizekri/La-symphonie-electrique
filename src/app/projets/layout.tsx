import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Réalisations — Galerie de Projets',
  description: 'Découvrez nos réalisations en électricité, fibre optique, bornes IRVE et VMC. Chantiers résidentiels et tertiaires dans la vallée de l\'Arve et toute la Haute-Savoie.',
};

export default function ProjetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
