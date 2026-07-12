'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, Star, Quote } from 'lucide-react';
import { googleReviews } from '@/lib/reviews-google';

type Review = { id: number; name: string; rating: number; comment: string };

export default function Projets() {
  // Avis Google par défaut : la section n'est jamais vide, même si la base ne renvoie rien.
  // On privilégie les avis courts pour garder des cartes de hauteur homogène.
  const [reviews, setReviews] = useState<Review[]>(
    googleReviews.filter(r => r.comment.length <= 200).slice(0, 3)
  );

  useEffect(() => {
    fetch('/api/reviews?status=approved')
      .then(r => r.ok ? r.json() : [])
      .then((data: Review[]) => {
        if (Array.isArray(data) && data.length >= 3) setReviews(data.slice(0, 3));
      })
      .catch(() => { /* on garde les avis par défaut */ });
  }, []);

  const projects = [
    {
      title: 'Installation Borne IRVE jusqu\'à 22 kW',
      client: 'Particulier — Sallanches',
      description: 'Pose d\'une borne de recharge murale jusqu\'à 22 kW dans un garage individuel, avec tirage de ligne dédiée depuis le tableau, protection différentielle type A et mise en service.',
      image: '/projects/borne.png',
      tags: ['Mobilité Électrique', 'IRVE'],
    },
    {
      title: 'Rénovation Tableau Électrique',
      client: 'Particulier — Cluses',
      description: 'Mise aux normes complète d\'un tableau vétuste : réorganisation du câblage, ajout de protections différentielles et de disjoncteurs adaptés pour une sécurité maximale.',
      image: '/services/electricite.jpg',
      tags: ['Électricité', 'Rénovation'],
      result: 'Conformité NF C 15-100 et attestation Consuel délivrée.'
    },
    {
      title: 'Raccordement Fibre & Baie de Brassage',
      client: 'Bureau professionnel — Chamonix-Mont-Blanc',
      description: 'Installation d\'une baie de brassage, raccordement fibre optique et câblage RJ45 Cat 6a, avec déploiement d\'un réseau Wi-Fi maillé haute densité.',
      image: '/services/reseaux.jpg',
      tags: ['Fibre Optique', 'Réseau'],
      result: 'Connexion stabilisée et couverture Wi-Fi totale du bâtiment.'
    },
    {
      title: 'Installation VMC Double Flux',
      client: 'Maison individuelle — Megève',
      description: 'Pose d\'une VMC double flux avec récupération de chaleur, réseau de gaines isolées et bouches d\'extraction/insufflation dans chaque pièce.',
      image: '/services/vmc.jpg',
      tags: ['VMC', 'Économies d\'énergie'],
      result: 'Air sain en permanence et jusqu\'à 20% d\'économies de chauffage.'
    },
    {
      title: 'Motorisation Portail Coulissant',
      client: 'Particulier — Annemasse',
      description: 'Installation d\'une motorisation pour portail coulissant avec photocellules de sécurité, feu clignotant, télécommandes et clavier à code extérieur.',
      image: '/services/portail-automatique.jpg',
      tags: ['Portail Automatique', 'Domotique'],
      result: 'Ouverture motorisée sécurisée conforme à la norme EN 12453.'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="container">
          <header style={{ marginBottom: '80px', textAlign: 'center' }}>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold"
              style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', fontWeight: 900, marginBottom: '20px' }}
            >
              Nos Réalisations
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)' }}
            >
              Découvrez comment nous transformons les infrastructures électriques pour allier performance, sécurité et modernité.
            </motion.p>
          </header>

          <div className="projects-list" style={{ display: 'grid', gap: '100px' }}>
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="project-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: index % 2 === 0 ? '1.1fr 0.9fr' : '0.9fr 1.1fr',
                  gap: '60px',
                  alignItems: 'center'
                }}
              >
                {index % 2 !== 0 && (
                  <div className="project-text" style={{ padding: '20px' }}>
                    <div className="project-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: 1.1 }}>{project.title}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Client : {project.client}</p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: 1.6 }}>{project.description}</p>
                    {project.result && (
                      <div style={{ display: 'grid', gap: '12px', marginBottom: '35px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-primary)', backgroundColor: 'rgba(250, 204, 21, 0.05)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-gold)' }}>
                          <CheckCircle2 size={24} className="text-gold" style={{ flexShrink: 0 }} />
                          <span><strong>Résultat :</strong> {project.result}</span>
                        </div>
                      </div>
                    )}
                    <Link href="/contact" className="btn btn-primary">
                      Demander un projet similaire <ArrowRight size={18} />
                    </Link>
                  </div>
                )}

                <div className="project-media" style={{
                  position: 'relative',
                  height: '500px',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  border: '1px solid var(--border)'
                }}>
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                  <div className="project-badge" style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--accent-gold)',
                    color: 'var(--accent-gold)',
                    fontWeight: 800,
                    fontSize: '0.8rem'
                  }}>
                    RÉALISÉ PAR NOS ÉQUIPES
                  </div>
                </div>

                {index % 2 === 0 && (
                  <div className="project-text" style={{ padding: '20px' }}>
                    <div className="project-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '6px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: 1.1 }}>{project.title}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>Client : {project.client}</p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '25px', lineHeight: 1.6 }}>{project.description}</p>
                    {project.result && (
                      <div style={{ display: 'grid', gap: '12px', marginBottom: '35px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-primary)', backgroundColor: 'rgba(250, 204, 21, 0.05)', padding: '15px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--accent-gold)' }}>
                          <CheckCircle2 size={24} className="text-gold" style={{ flexShrink: 0 }} />
                          <span><strong>Résultat :</strong> {project.result}</span>
                        </div>
                      </div>
                    )}
                    <Link href="/contact" className="btn btn-primary">
                      Demander un projet similaire <ArrowRight size={18} />
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', marginTop: '60px' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Ils nous font <span className="text-gold">confiance</span></h2>
            <p style={{ color: 'var(--text-secondary)' }}>La satisfaction de nos clients est notre plus belle récompense.</p>
          </div>

          <div className="grid grid-3">
            {reviews.length > 0 ? reviews.map((t, i) => (
              <motion.div
                key={t.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="card"
                style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}
              >
                <Quote size={40} style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--accent-gold)' }} />
                <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
                  {[...Array(t.rating)].map((_, index) => (
                    <Star key={index} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />
                  ))}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: '20px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>&laquo;&nbsp;{t.comment}&nbsp;&raquo;</p>
                <div>
                  <p style={{ fontWeight: 700, marginBottom: '2px', color: 'white' }}>{t.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client vérifié</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center" style={{ gridColumn: 'span 3', color: 'var(--text-muted)' }}>
                Chargement des avis…
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section text-center cta-section" style={{ padding: '100px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '3rem', marginBottom: '30px', fontWeight: 900 }}>Prêt à devenir notre prochaine <span className="text-gold">réussite ?</span></h2>
          <Link href="/contact" className="btn btn-primary cta-btn" style={{ padding: '1.25rem 4rem', fontSize: '1.25rem' }}>
            Lancer mon projet maintenant
          </Link>
        </div>
      </section>
    </main>
  );
}
