'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Zap, Wifi, BatteryCharging, Fan, Fence, CheckCircle2, ArrowRight, MessageSquare, ClipboardList, Hammer, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      id: 'electricite',
      title: 'Électricité Générale',
      icon: <Zap size={32} className="text-gold" />,
      tagline: 'Sécurité & Normes',
      items: ['Rénovation totale', 'Mise aux normes', 'Tableaux électriques', 'Dépannage 24/7']
    },
    {
      id: 'fibre',
      title: 'Réseaux & Fibre',
      icon: <Wifi size={32} className="text-blue" />,
      tagline: 'Vitesse & Stabilité',
      items: ['Raccordement fibre', 'Wi-Fi optimisé', 'Baies de brassage', 'Câblage RJ45']
    },
    {
      id: 'mobilite',
      title: 'Bornes Électriques',
      icon: <BatteryCharging size={32} className="text-gold" />,
      tagline: 'Mobilité Durable',
      items: ['Bornes de recharge', 'Certification IRVE', 'Aides de l\'État', 'Maintenance']
    },
    {
      id: 'vmc',
      title: 'Ventilation VMC',
      icon: <Fan size={32} className="text-blue" />,
      tagline: 'Qualité d\'Air',
      items: ['Simple & Double flux', 'Entretien annuel', 'Économies d\'énergie', 'Confort thermique']
    },
    {
      id: 'portail-automatique',
      title: 'Portail Automatique',
      icon: <Fence size={32} className="text-gold" />,
      tagline: 'Confort & Sécurité',
      items: ['Motorisation portail', 'Battant & coulissant', 'Télécommande & digicode', 'Dépannage & entretien']
    }
  ];

  const steps = [
    { icon: <MessageSquare size={32} />, title: '1. Contact', desc: 'Décrivez votre projet en 2 minutes via notre formulaire.' },
    { icon: <ClipboardList size={32} />, title: '2. Devis Gratuit', desc: 'Réception d\'un chiffrage précis sous 48h maximum.' },
    { icon: <Hammer size={32} />, title: '3. Réalisation', desc: 'Intervention soignée et sécurisée selon les normes.' }
  ];

  return (
    <main>
      
      {/* Hero Minimaliste */}
      <section className="section" style={{ textAlign: 'center', padding: '100px 0 60px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '20px' }}>
              Nos solutions <span className="text-gold">simples & efficaces</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Expertise certifiée pour un habitat sécurisé et connecté.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid de Services Simplifiée */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-2">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                whileHover={{ scale: 1.02 }}
                className="card"
                style={{ padding: '40px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}
              >
                <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                  {service.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {service.tagline}
                  </span>
                  <h2 style={{ fontSize: '1.75rem', margin: '5px 0 15px' }}>{service.title}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px' }}>
                    {service.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={14} className="text-gold" /> {item}
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="text-gold" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}>
                    En savoir plus <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section "Comment ça marche" */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem' }}>Votre projet en <span className="text-gold">3 étapes simples</span></h2>
          </div>
          
          <div className="grid grid-3">
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ color: 'var(--accent-gold)', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  {step.icon}
                </div>
                <h3 style={{ marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                {i < 2 && <div className="hidden-mobile" style={{ position: 'absolute', right: '-15%', top: '30%', color: 'var(--border)' }}><ArrowRight size={32} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Express */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
            <HelpCircle size={32} className="text-gold" />
            <h2 style={{ margin: 0 }}>Questions fréquentes</h2>
          </div>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              { q: "Quels sont vos délais d'intervention ?", a: "Pour un dépannage urgent, nous intervenons sous 2h. Pour un chantier, nous débutons généralement sous 10 jours après acceptation du devis." },
              { q: "Proposez-vous une garantie sur les travaux ?", a: "Oui, tous nos travaux sont couverts par une garantie décennale et nous utilisons uniquement du matériel certifié NF." },
              { q: "Le devis est-il vraiment gratuit ?", a: "Absolument. Nous nous déplaçons gratuitement pour évaluer vos besoins et vous proposer un chiffrage précis sans engagement." }
            ].map((faq, i) => (
              <div key={i} className="card" style={{ padding: '25px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>{faq.q}</h4>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="section text-center" style={{ paddingBottom: '100px' }}>
        <div className="container">
          <div className="card" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)', padding: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'inherit' }}>Prêt à sécuriser votre habitat ?</h2>
            <p style={{ marginBottom: '30px', fontWeight: 500 }}>Rejoignez nos +200 clients satisfaits cette année.</p>
            <Link href="/contact" className="btn btn-primary" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--accent-gold)', padding: '1rem 3rem' }}>
              Demander mon Devis Maintenant
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
