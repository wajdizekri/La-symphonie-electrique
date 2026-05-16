import { Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Installation Électrique & Mise aux Normes NF C 15-100',
  description: 'Installation électrique résidentielle et tertiaire, rénovation tableaux, mise aux normes NF C 15-100, Consuel. Devis gratuit, garantie décennale.',
};

export default function ElectriciteService() {
  const points = [
    "Installation complète à neuf",
    "Mise en conformité (Norme NF C 15-100)",
    "Remplacement de tableaux électriques",
    "Éclairage intérieur et extérieur",
    "Chauffage électrique intelligent",
    "Diagnostic et mise en sécurité",
  ];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', color: 'var(--accent-gold)', marginBottom: '20px' }}>
            <Zap size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Électricité Générale</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Expertise certifiée pour un habitat sécurisé et aux normes.
          </p>
        </div>

        {/* Image showcase */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '50px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/services/electricite.jpg"
              alt="Électricien intervenant sur un tableau électrique aux normes NF C 15-100"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1000px) 100vw, 1000px"
              priority
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(2,6,23,0.7) 0%, transparent 60%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '24px',
                right: '24px',
                color: 'white',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(250, 204, 21, 0.9)',
                  color: '#0c0a09',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                NF C 15-100
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 600 }}>
                Installations conformes, attestation Consuel et garantie décennale.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Qualité & Sécurité</h2>
            <p style={{ marginBottom: '20px' }}>
              Nous intervenons sur tous types de bâtiments (résidentiel, tertiaire) pour assurer une
              distribution électrique fiable. Chaque intervention est réalisée dans le respect strict
              des réglementations en vigueur.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} className="text-gold" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <Zap size={32} className="text-gold" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ marginTop: 0 }}>Besoin d&apos;une installation ?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Nos experts vous accompagnent de l&apos;étude à la réalisation, avec un devis détaillé sous 48h.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              Demander un devis gratuit
            </Link>
            <Link href="/services/depannage" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px', fontSize: '0.85rem' }}>
              Dépannage urgent
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
