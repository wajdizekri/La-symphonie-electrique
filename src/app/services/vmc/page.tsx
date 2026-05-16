import { Fan, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VMC — Ventilation Mécanique Contrôlée',
  description: 'Installation, entretien et dépannage de VMC simple flux et double flux. Qualité de l\'air, économies d\'énergie, conformité RT2012/RE2020.',
};

export default function VMCService() {
  const points = [
    "VMC simple flux hygroréglable (Type A et B)",
    "VMC double flux avec récupération de chaleur",
    "Remplacement et mise aux normes RT2012 / RE2020",
    "Nettoyage des bouches et gaines",
    "Entretien préventif et dépannage",
    "Pose dans collectif et tertiaire",
  ];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: 'var(--accent-blue)', marginBottom: '20px' }}>
            <Fan size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>VMC — Ventilation</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Installation, entretien et dépannage de VMC pour un air sain et des économies d&apos;énergie.
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '50px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/services/vmc.jpg"
              alt="Installation et entretien de VMC simple et double flux"
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
                RT 2012 / RE 2020
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 600 }}>
                Simple flux, double flux, entretien et remplacement.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Un air sain, des économies</h2>
            <p style={{ marginBottom: '20px' }}>
              Une VMC bien dimensionnée évacue l&apos;humidité, prévient les moisissures et permet
              jusqu&apos;à 20% d&apos;économies sur le chauffage (en double flux). Nous installons les
              marques de référence et adaptons la solution à votre logement.
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
            <Fan size={32} className="text-blue" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ marginTop: 0 }}>Étude ou dépannage VMC ?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Diagnostic sur place gratuit. Devis sous 48h. Pose et entretien par nos techniciens.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}
            >
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
