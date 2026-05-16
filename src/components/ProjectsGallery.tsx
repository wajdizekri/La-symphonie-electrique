'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

type Project = {
  image: string;
  title: string;
  category: string;
  location: string;
};

const demoProjects: Project[] = [
  {
    image: '/projects/borne.png',
    title: 'Installation borne IRVE 7,4 kW',
    category: 'Mobilité Électrique',
    location: 'Sallanches',
  },
  {
    image: '/services/electricite.jpg',
    title: 'Rénovation tableau électrique',
    category: 'Électricité',
    location: 'Cluses',
  },
  {
    image: '/services/reseaux.jpg',
    title: 'Raccordement fibre & baie de brassage',
    category: 'Fibre Optique',
    location: 'Chamonix-Mont-Blanc',
  },
  {
    image: '/services/vmc.jpg',
    title: 'Installation VMC double flux',
    category: 'VMC',
    location: 'Megève',
  },
  {
    image: '/services/portail-automatique.jpg',
    title: 'Motorisation portail coulissant',
    category: 'Portail Automatique',
    location: 'Annemasse',
  },
];

export default function ProjectsGallery() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Nos <span className="text-gold">réalisations</span></h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Quelques exemples de chantiers récents — chaque installation est réalisée aux normes en vigueur et garantie.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: demoProjects.length === 1 ? 'minmax(0, 700px)' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            justifyContent: 'center',
            maxWidth: demoProjects.length === 1 ? '700px' : '100%',
            margin: '0 auto',
          }}
        >
          {demoProjects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10' }}>
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.3) 60%, transparent 100%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(250, 204, 21, 0.9)',
                    color: '#0c0a09',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {p.category}
                </span>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: 'white' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 700 }}>{p.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    {p.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/projets" className="btn btn-secondary" style={{ padding: '12px 28px' }}>
            Voir toutes nos réalisations <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
