import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laisser un avis',
  description: 'Partagez votre expérience avec La Symphonie Électrique. Votre avis nous aide à nous améliorer et à informer nos futurs clients.',
};

export default function AvisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
