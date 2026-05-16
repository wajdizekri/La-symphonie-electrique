import { Fence, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portails Automatiques — Motorisation & Dépannage',
  description: 'Installation et dépannage de portails automatiques (battants, coulissants), motorisations, télécommandes, interphones et contrôle d\'accès. Vallée de l\'Arve.',
};

export default function PortailAutomatiqueService() {
  const points = [
    "Motorisation portail battant (à bras ou enterrée)",
    "Motorisation portail coulissant (rail au sol ou autoportant)",
    "Dépannage et remplacement de motorisation",
    "Installation de télécommandes, claviers à code et interphones",
    "Contrôle d'accès et domotique (smartphone, badge, vidéo)",
    "Mise en sécurité (photocellules, feu clignotant) selon EN 12453",
  ];

  const brands = ['CAME', 'Nice', 'Faac', 'Somfy', 'BFT', 'Aprimatic'];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', color: 'var(--accent-gold)', marginBottom: '20px' }}>
            <Fence size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Portails Automatiques</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Motorisation, installation, dépannage et automatismes d&apos;accès dans la vallée de l&apos;Arve.
          </p>
        </div>

        {/* Image showcase */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '50px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/services/portail-automatique.jpg"
              alt="Installation et dépannage de motorisation de portail automatique"
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
                Intervention sous 24h
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 600 }}>
                Diagnostic gratuit, devis transparent, garantie 2 ans pièces et main-d&apos;œuvre.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Nos prestations</h2>
            <p style={{ marginBottom: '20px' }}>
              Que ce soit pour équiper un portail neuf, remplacer une motorisation vieillissante ou
              dépanner un système en panne, nous intervenons sur tous types de portails (battant ou coulissant)
              et toutes marques.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} className="text-gold" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '12px', fontSize: '1rem' }}>Marques que nous intervenons</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {brands.map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: '0.8rem',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <Fence size={32} className="text-gold" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ marginTop: 0 }}>Votre portail est en panne ?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Diagnostic sur place gratuit. Devis sous 48h. Pose et mise en service par nos techniciens certifiés.
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
