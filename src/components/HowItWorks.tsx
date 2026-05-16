'use client';

import { motion } from 'framer-motion';
import { Phone, Search, FileText, Wrench } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    n: '01',
    icon: <Phone size={26} />,
    title: 'Vous nous contactez',
    text: 'Par téléphone, WhatsApp ou via le formulaire en ligne. Réponse rapide, sans engagement.',
  },
  {
    n: '02',
    icon: <Search size={26} />,
    title: 'Diagnostic sur place',
    text: 'Nous nous déplaçons pour analyser votre besoin. Diagnostic gratuit et conseil personnalisé.',
  },
  {
    n: '03',
    icon: <FileText size={26} />,
    title: 'Devis sous 48h',
    text: 'Devis détaillé et transparent envoyé par email. Lignes claires, sans frais cachés.',
  },
  {
    n: '04',
    icon: <Wrench size={26} />,
    title: 'Intervention & garantie',
    text: 'Travaux réalisés aux normes par notre équipe. Suivi du chantier en ligne, garantie décennale.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Comment <span className="text-gold">ça marche</span></h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Un processus simple et transparent, du premier contact à la mise en service.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              style={{
                position: 'relative',
                padding: '32px 20px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-primary)',
                textAlign: 'center',
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-gold)',
                  color: '#0c0a09',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  boxShadow: '0 4px 12px rgba(250, 204, 21, 0.4)',
                }}
              >
                {s.n}
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(250, 204, 21, 0.1)',
                  color: 'var(--accent-gold)',
                  marginBottom: '14px',
                  marginTop: '6px',
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/contact" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            Démarrer mon projet
          </Link>
        </div>
      </div>
    </section>
  );
}
