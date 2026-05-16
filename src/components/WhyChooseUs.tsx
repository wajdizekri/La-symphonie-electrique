'use client';

import { motion } from 'framer-motion';
import { Clock, FileCheck2, ShieldCheck, Award } from 'lucide-react';

const piliers = [
  {
    icon: <Clock size={36} />,
    title: 'Réactivité 24h',
    text: 'Intervention sous 24h selon urgence — dépannage le jour même possible.',
    color: 'var(--accent-gold)',
  },
  {
    icon: <FileCheck2 size={36} />,
    title: 'Devis gratuit sous 48h',
    text: 'Diagnostic sur place offert. Devis détaillé et transparent, sans engagement.',
    color: 'var(--accent-blue)',
  },
  {
    icon: <Award size={36} />,
    title: 'Certifié IRVE & habilité',
    text: "Installateur certifié IRVE jusqu'à 22 kW, habilitations B2V – BR – BC.",
    color: 'var(--accent-gold)',
  },
  {
    icon: <ShieldCheck size={36} />,
    title: 'Garantie décennale',
    text: 'Assurance décennale et responsabilité civile pro. Travail conforme NF C 15-100.',
    color: 'var(--accent-blue)',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Pourquoi nous <span className="text-gold">choisir</span></h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Des engagements concrets, vérifiables et tenus sur chaque chantier.
          </p>
        </div>

        <div className="grid grid-4" style={{ gap: '24px' }}>
          {piliers.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ textAlign: 'center', padding: '30px 20px' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: `${p.color === 'var(--accent-gold)' ? 'rgba(250, 204, 21, 0.1)' : 'rgba(56, 189, 248, 0.1)'}`,
                  color: p.color,
                  marginBottom: '20px',
                  border: `1px solid ${p.color === 'var(--accent-gold)' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{p.title}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
