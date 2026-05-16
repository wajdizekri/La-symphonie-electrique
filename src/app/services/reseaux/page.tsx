import { Wifi, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fibre Optique & Réseaux — Raccordement Pro',
  description: 'Installation fibre optique, déploiement réseau Ethernet, Wi-Fi professionnel. Expert ORANGE certifié. Devis gratuit sous 48h.',
};

export default function ReseauxService() {
  const points = [
    "Raccordement et tirage fibre optique",
    "Câblage informatique RJ45 (Cat 6 / Cat 6a)",
    "Installation de baies de brassage",
    "Optimisation Wi-Fi maillé (mesh)",
    "Caméras IP et réseaux vidéosurveillance",
    "Bureaux d'entreprise et copropriétés",
  ];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--accent-blue)', marginBottom: '20px' }}>
            <Wifi size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Fibre Optique & Réseaux</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Une connectivité ultra-rapide et stable pour votre domicile ou bureau.
          </p>
        </div>

        {/* Image showcase */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '50px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/services/reseaux.jpg"
              alt="Raccordement et installation fibre optique"
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
                  backgroundColor: 'rgba(56, 189, 248, 0.9)',
                  color: '#0c0a09',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Expert ORANGE
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 600 }}>
                Raccordement fibre, baies de brassage, Wi-Fi haute densité.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Vitesse & Stabilité</h2>
            <p style={{ marginBottom: '20px' }}>
              À l&apos;ère du tout numérique, la qualité de votre réseau domestique est primordiale.
              Nous concevons des infrastructures robustes pour le télétravail, le streaming et la
              domotique.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} className="text-blue" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <Wifi size={32} className="text-blue" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ marginTop: 0 }}>Boostez votre connexion</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Fini les zones blanches et les ralentissements. Étude réseau gratuite sur place.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}
            >
              Obtenir une étude réseau
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
