'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Quel est votre délai d\'intervention pour un dépannage ?',
    a: 'Nous intervenons rapidement selon l\'urgence de la situation, généralement sous 24h. Pour les dépannages urgents, une intervention le jour même peut être proposée selon nos disponibilités.',
  },
  {
    q: 'Faites-vous les installations aux normes NF C 15-100 ?',
    a: 'Oui, toutes nos installations électriques sont réalisées dans le respect de la norme NF C 15-100 afin de garantir sécurité, conformité et fiabilité.',
  },
  {
    q: 'Êtes-vous certifié IRVE pour l\'installation de bornes de recharge ?',
    a: 'Oui, nous sommes certifiés IRVE pour l\'installation de bornes de recharge pour véhicules électriques, conformément à la réglementation en vigueur. Nous installons toutes les puissances : 3,7 kW, 7,4 kW et jusqu\'à 22 kW (triphasé).',
  },
  {
    q: 'Êtes-vous assurés pour les travaux que vous réalisez ?',
    a: 'Oui, nous disposons d\'une assurance responsabilité civile professionnelle ainsi que d\'une garantie décennale pour couvrir nos interventions.',
  },
  {
    q: 'Travaillez-vous pour les particuliers et les professionnels ?',
    a: 'Oui, nous accompagnons aussi bien les particuliers que les professionnels pour tous types de travaux électriques.',
  },
  {
    q: 'Quelle est votre zone d\'intervention ?',
    a: 'Nous intervenons dans toute la région ainsi que dans les communes avoisinantes. N\'hésitez pas à nous contacter pour vérifier si votre secteur est couvert.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          }),
        }}
      />
      <section className="section" id="faq">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Questions <span className="text-gold">fréquentes</span></h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    borderColor: isOpen ? 'var(--accent-gold)' : undefined,
                  }}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px 24px',
                      gap: '20px',
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: isOpen ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                      {f.q}
                    </h3>
                    <ChevronDown
                      size={20}
                      style={{
                        color: 'var(--accent-gold)',
                        transition: 'transform 0.3s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            padding: '0 24px 20px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
