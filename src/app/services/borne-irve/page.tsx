import { BatteryCharging, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bornes de Recharge IRVE — Installation Certifiée',
  description: 'Installation de bornes de recharge pour véhicules électriques par technicien certifié IRVE. Puissances 3,7 kW à 22 kW. Particuliers, copropriétés, entreprises. Aides ADVENIR.',
};

export default function BorneIRVEService() {
  const points = [
    "Installation de bornes 3,7 kW et 7,4 kW (monophasé)",
    "Installation de bornes 11 kW et 22 kW (triphasé)",
    "Pose en maison individuelle, copropriété et parking d'entreprise",
    "Pilotage intelligent (délestage, planification, recharge solaire)",
    "Bornes connectées avec contrôle par application",
    "Mise en service, attestation Consuel et garantie",
  ];

  const brands = ['Schneider EVlink', 'Hager Witty', 'Legrand Green\'up', 'Wallbox', 'Easee', 'Zaptec'];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', color: 'var(--accent-gold)', marginBottom: '20px' }}>
            <BatteryCharging size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Bornes de Recharge IRVE</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Installation certifiée IRVE pour véhicules électriques. Particuliers, copropriétés et entreprises.
          </p>
        </div>

        {/* Image showcase */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '50px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/projects/borne.png"
              alt="Borne de recharge IRVE 7,4 kW installée sur un mur de garage"
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
                Certifié IRVE
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '1rem', fontWeight: 600 }}>
                De 3,7 kW à 22 kW · Aides ADVENIR & crédit d&apos;impôt
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Nos prestations</h2>
            <p style={{ marginBottom: '20px' }}>
              En tant qu&apos;installateur certifié <strong>IRVE niveau 2</strong>, nous prenons en charge
              l&apos;ensemble du projet : étude de votre installation électrique, choix de la borne adaptée
              à votre véhicule, démarches administratives pour les aides, pose et mise en service.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} className="text-gold" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '12px', fontSize: '1rem' }}>Marques compatibles</h3>
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

            <div
              style={{
                marginTop: '30px',
                padding: '15px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
              }}
            >
              💡 <strong style={{ color: 'var(--success)' }}>Bon à savoir :</strong> jusqu&apos;à
              <strong> 50 % du coût</strong> de votre borne peut être pris en charge via les aides
              <strong> ADVENIR</strong> (copropriété) et le <strong>crédit d&apos;impôt transition énergétique</strong> (particulier). Nous nous occupons des démarches.
            </div>
          </div>

          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <BatteryCharging size={32} className="text-gold" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ marginTop: 0 }}>Projet de borne ?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Étude de votre installation gratuite. Devis détaillé sous 48h. Pose et mise en service par un technicien certifié IRVE.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>
              Demander un devis gratuit
            </Link>
            <Link href="/services/electricite" className="btn btn-secondary" style={{ width: '100%', marginTop: '10px', fontSize: '0.85rem' }}>
              Voir aussi : Électricité
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
