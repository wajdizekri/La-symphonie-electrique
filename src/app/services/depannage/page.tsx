import { Wrench, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dépannage Électrique 24/7 — Intervention Rapide',
  description: 'Dépannage électrique d\'urgence 24h/24 et 7j/7. Court-circuit, panne totale, tableau défectueux. Intervention sous 2h dans la vallée de l\'Arve.',
};

export default function DepannageService() {
  const points = [
    "Dépannage urgent 24h/24 et 7j/7",
    "Recherche de pannes électriques",
    "Maintenance préventive",
    "Remplacement d'appareillage",
    "Remise en sécurité immédiate"
  ];

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--error)', marginBottom: '20px' }}>
            <Wrench size={40} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Dépannage & Maintenance</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Réactivité et efficacité pour tous vos imprévus électriques.</p>
        </div>

        <div className="grid grid-2" style={{ gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '20px' }}>Urgence & Diagnostic</h2>
            <p>
              Une coupure de courant ? Un tableau qui grésille ? Nous intervenons dans les plus brefs délais pour sécuriser votre installation et rétablir votre confort.
            </p>
            <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
              {points.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-primary)' }}>
                  <Clock size={18} style={{ color: 'var(--error)' }} />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--error)' }}>
            <h3 style={{ color: 'var(--error)' }}>Besoin d'un dépanneur ?</h3>
            <p>Intervention rapide garantie.</p>
            <a href="tel:+330123456789" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--error)', borderColor: 'var(--error)', color: 'white' }}>Appeler le 01 23 45 67 89</a>
          </div>
        </div>
      </div>
    </main>
  );
}
