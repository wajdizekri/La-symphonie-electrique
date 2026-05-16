import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://lasymphonieelectrique.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/electricite', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/depannage', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/reseaux', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/portail-automatique', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/vmc', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/borne-irve', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/projets', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.9, changeFrequency: 'yearly' },
    { path: '/avis', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/suivi', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/mentions-legales', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/confidentialite', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return pages.map(p => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
