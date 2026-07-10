'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, BatteryCharging, Fan, ShieldCheck, Cpu, Star, Phone, MessageSquare, Fence } from 'lucide-react';

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);
import Image from 'next/image';
import Link from 'next/link';
import TrustCounters from '@/components/TrustCounters';
import ProjectsGallery from '@/components/ProjectsGallery';
import FAQ from '@/components/FAQ';
import AreasServed from '@/components/AreasServed';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import { company } from '@/lib/company';

type Review = { id: number; name: string; rating: number; comment: string };

// Vrais avis Google (fiche LA SYMPHONIE ÉLECTRIQUE, Thyez) — 5/5 chacun.
// Affichés par défaut ; remplacés par les avis approuvés en base s'il y en a assez.
const demoReviews: Review[] = [
  { id: -1, name: 'Claudine Sauce', rating: 5, comment: "Merci pour l'installation rapide et les conseils. Très professionnel je recommande les yeux fermés !" },
  { id: -2, name: 'ION ERDIC', rating: 5, comment: 'Très réactif, travail soigné et de qualité. À garder dans les contacts.' },
  { id: -3, name: 'Orianne Aymard', rating: 5, comment: "Jaber est intervenu à deux reprises dans deux logements différents pour permettre l'accès à la fibre, alors que les techniciens Orange n'avaient pas réussi à résoudre le problème. À chaque fois, il a été très efficace et a su trouver des solutions là où d'autres bloquaient. Son travail est soigné, rapide et vraiment professionnel. En plus de ses compétences techniques, Jaber est très sympathique, ponctuel et agréable dans les échanges. Je le recommande vivement !" },
  { id: -4, name: 'Itidel Smati', rating: 5, comment: "Jaber fait preuve d'un grand professionnalisme et d'un réel sérieux. Son travail est soigné, transparent et de qualité. Je le recommande sans hésitation. Bonne continuation." },
  { id: -5, name: 'Selima Kadri', rating: 5, comment: 'Jaber est super professionnel, je ne peux que vous le recommander les yeux fermés. Travail de qualité, réalisé avec honnêteté. Bonne continuation pour la suite.' },
  { id: -6, name: 'Guillaume Chappaz', rating: 5, comment: 'Jaber est un super professionnel, disponible et juste dans ses devis et interventions.' },
  { id: -7, name: 'Benjamin Lazzari', rating: 5, comment: "Excellente expérience avec La Symphonie Électrique et son dirigeant Jaber. Professionnel, réactif et à l'écoute du client. Le travail est soigné, réalisé dans les délais et avec de très bons conseils tout au long du projet. On sent un vrai savoir-faire et une passion pour le métier. Je recommande vivement cette société pour tous vos travaux électriques." },
  { id: -8, name: 'michel Angelo', rating: 5, comment: 'Je le recommande vivement, très compétent et toujours disponible.' },
];

const services = [
  {
    title: 'Électricité',
    icon: <Zap className="text-gold" size={32} />,
    items: ['Installations & Rénovations', 'Mise aux normes NF C 15-100', 'Dépannage électrique', 'Tableaux & Protections'],
  },
  {
    title: 'Fibre Optique',
    icon: <Wifi className="text-blue" size={32} />,
    items: ['Raccordement & Installation', 'Réseau & Wi-Fi', 'Déploiement fibre', 'Solutions sur mesure'],
  },
  {
    title: 'Mobilité Électrique',
    icon: <BatteryCharging className="text-gold" size={32} />,
    items: ['Bornes de recharge', 'Installation IRVE', 'Solutions de charge', 'Particuliers & Pros'],
  },
  {
    title: 'VMC',
    icon: <Fan className="text-blue" size={32} />,
    items: ['Simple & Double flux', 'Entretien & Dépannage', "Qualité d'air", "Économies d'énergie"],
  },
  {
    title: 'Portail Automatique',
    icon: <Fence className="text-gold" size={32} />,
    items: ['Motorisation battant & coulissant', 'Dépannage motorisation', "Contrôle d'accès & interphone", 'Domotique & télécommandes'],
  },
];

const REVIEW_LIMIT = 170;

export default function HomeContent({ reviews }: { reviews: Review[] }) {
  const [openReview, setOpenReview] = useState<number | null>(null);
  // Avis approuvés en base si assez nombreux, sinon les vrais avis Google par défaut.
  const displayedReviews: Review[] = (reviews.length >= 3 ? reviews : demoReviews).slice(0, 6);

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden', padding: '100px 0' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.4,
        }}>
          <Image
            src="/hero.png"
            alt="Premium Electrician Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.8), var(--bg-primary))',
          }} />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: '8px 16px',
              backgroundColor: 'rgba(250, 204, 21, 0.1)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-gold)',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: 'var(--spacing-xl)',
              border: '1px solid rgba(250, 204, 21, 0.2)',
            }}>
              <ShieldCheck size={16} />
              SÉCURITÉ • PERFORMANCE • CONFIANCE
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: 'var(--spacing-lg)' }}>
              VOTRE EXPERT DE CONFIANCE POUR DES <br />
              <span className="text-gold">SOLUTIONS ÉLECTRIQUES DURABLES</span>
            </h1>

            <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto var(--spacing-xxl)' }}>
              La Symphonie Électrique vous accompagne dans tous vos projets d&apos;électricité,
              fibre optique et mobilité électrique avec une expertise certifiée.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Demander un Devis Gratuit
              </Link>
              <Link href="/services" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Nos Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Counters */}
      <TrustCounters />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Services Grid */}
      <section className="section" id="services">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Nos <span className="text-gold">Expertises</span></h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>{service.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>{service.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {service.items.map((item, i) => (
                    <li key={i} style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '40px',
          }}>
            {[
              { icon: <Cpu size={40} />, label: 'Diplômé AFPA' },
              { icon: <Star size={40} />, label: 'Expert ORANGE' },
              { icon: <ShieldCheck size={40} />, label: 'Certifié IRVE' },
            ].map((badge, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-gold)', marginBottom: '10px' }}>{badge.icon}</div>
                <div style={{ fontWeight: 700, letterSpacing: '1px', fontSize: '0.9rem' }}>{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <ProjectsGallery />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem' }}>Ce que nos <span className="text-gold">clients disent</span></h2>
            <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          </div>

          <div className="grid grid-3">
            {displayedReviews.map((review, i) => (
              <motion.div
                key={review.id ?? i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="card"
                style={{ textAlign: 'center' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '15px' }}>
                  {Array.from({ length: review.rating }).map((_, s) => (
                    <Star key={s} size={16} fill="var(--accent-gold)" className="text-gold" />
                  ))}
                </div>
                {(() => {
                  const isLong = review.comment.length > REVIEW_LIMIT;
                  const isOpen = openReview === i;
                  const shown = isLong && !isOpen ? review.comment.slice(0, REVIEW_LIMIT).trimEnd() + '…' : review.comment;
                  return (
                    <>
                      <p style={{ fontStyle: 'italic', marginBottom: isLong ? '8px' : '20px' }}>&laquo;&nbsp;{shown}&nbsp;&raquo;</p>
                      {isLong && (
                        <button
                          onClick={() => setOpenReview(isOpen ? null : i)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', padding: 0 }}
                        >
                          {isOpen ? 'voir moins' : 'voir plus'}
                        </button>
                      )}
                    </>
                  );
                })()}
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{review.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Client vérifié</div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/avis" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              <Star size={18} fill="currentColor" /> Laisser mon avis
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              Vous avez fait appel à nos services ? Partagez votre expérience.
            </p>
          </div>
        </div>
      </section>

      {/* Areas Served (SEO local) */}
      <AreasServed />

      {/* FAQ Section */}
      <FAQ />

      {/* Quick Contact Footer */}
      <footer className="section" style={{ padding: '60px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid grid-3">
            <div>
              <h3 className="text-gold">DÉPANNAGE URGENT</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>24H/24 — 7J/7</p>
              {company.phone ? (
                <a href={`tel:${company.phoneHref}`} className="btn btn-primary" style={{ marginTop: '10px' }}>
                  <Phone size={18} /> {company.phone}
                </a>
              ) : (
                <Link href="/contact" className="btn btn-primary" style={{ marginTop: '10px' }}>
                  <Phone size={18} /> Nous joindre
                </Link>
              )}
            </div>

            <div className="text-center">
              <h3 className="text-gold">DEVIS GRATUIT</h3>
              <p>Réponse garantie sous 48h</p>
              <Link href="/contact" className="btn btn-secondary">
                <MessageSquare size={18} /> Nous Contacter
              </Link>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 className="text-gold">CONTACT</h3>
              <p>Lasymphonie.e@gmail.com</p>
              <p><a href={`tel:${company.phoneHref}`} style={{ color: 'inherit', textDecoration: 'none' }}>{company.phone}</a></p>
              <p><a href={`tel:${company.phoneHref2}`} style={{ color: 'inherit', textDecoration: 'none' }}>{company.phone2}</a></p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <a
                  href="https://www.facebook.com/profile.php?id=61575041172022"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Notre page Facebook"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                    border: '1px solid rgba(24, 119, 242, 0.3)',
                    color: '#4f9af6',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <FacebookIcon size={16} /> Suivez-nous sur Facebook
                </a>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '60px', paddingTop: '30px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem' }}>© 2024 La Symphonie Électrique. Tous droits réservés. Travail soigné &amp; sécurisé.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
