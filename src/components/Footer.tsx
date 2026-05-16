import Link from 'next/link';
import { Mail, Phone, MapPin, Wifi, Wrench, Zap } from 'lucide-react';
import Logo from './Logo';
import { company } from '@/lib/company';

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export default function Footer() {
  const socialIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid var(--border)',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', paddingTop: '60px', paddingBottom: '30px', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              <Logo size={40} />
              <span>SYMPHONIE ÉLECTRIQUE</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Expertise et excellence électrique pour vos projets résidentiels et tertiaires. Intervention rapide et finitions premium.
            </p>
            
            {/* Dynamic Service Buttons */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link href="/services/electricite" style={socialIconStyle} title="Électricité Générale" className="social-icon">
                <Zap size={20} />
              </Link>
              <Link href="/services/reseaux" style={socialIconStyle} title="Réseaux & Fibre" className="social-icon">
                <Wifi size={20} />
              </Link>
              <Link href="/services/depannage" style={socialIconStyle} title="Dépannage & Urgence" className="social-icon">
                <Wrench size={20} />
              </Link>
              <a
                href="https://www.facebook.com/profile.php?id=61575041172022"
                target="_blank"
                rel="noopener noreferrer"
                style={socialIconStyle}
                title="Notre page Facebook"
                className="social-icon"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link href="/services/electricite" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Installation Électrique</Link></li>
              <li><Link href="/services/depannage" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Dépannage 24/7</Link></li>
              <li><Link href="/services/borne-irve" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Bornes IRVE</Link></li>
              <li><Link href="/services/reseaux" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Réseau & Fibre</Link></li>
              <li><Link href="/services/vmc" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">VMC</Link></li>
              <li><Link href="/services/portail-automatique" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Portail Automatique</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={16} className="text-gold" />
                {company.address}
              </li>
              {company.phone && (
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} className="text-gold" />
                  <a href={`tel:${company.phoneHref}`} style={{ color: 'inherit', textDecoration: 'none' }}>{company.phone}</a>
                </li>
              )}
              <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} className="text-gold" />
                <a href={`mailto:${company.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{company.email}</a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Informations</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li><Link href="/avis" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Laisser un avis</Link></li>
              <li><Link href="/mentions-legales" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Mentions Légales</Link></li>
              <li><Link href="/confidentialite" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Politique de Confidentialité</Link></li>
              <li><Link href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="footer-link">Espace Professionnel</Link></li>
            </ul>
          </div>

        </div>

        {/* Credentials band — replace placeholders with real values before going live */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '25px', paddingBottom: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: '1.6',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Identité légale
              </div>
              {company.siret ? <div>SIRET&nbsp;: {company.siret}</div> : null}
              {company.ape ? <div>Code APE&nbsp;: {company.ape}</div> : null}
              {company.tva ? <div>N° TVA&nbsp;: {company.tva}</div> : null}
              {!company.siret && !company.ape && !company.tva && (
                <div style={{ fontStyle: 'italic' }}>À renseigner</div>
              )}
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Assurance
              </div>
              <div>{company.insuranceRcPro}</div>
              <div>{company.insuranceDecennale}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Qualifications
              </div>
              <div>IRVE P1 — jusqu&apos;à 22 kW</div>
              <div>Habilitation B2V – BR – BC</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Normes respectées
              </div>
              <div>NF C 15-100</div>
              <div>Garantie décennale</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} La Symphonie Électrique. Tous droits réservés.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
            Travail soigné &amp; sécurisé · Réponse devis sous 48h
          </p>
        </div>
      </div>

      <style jsx>{`
        .social-icon:hover {
          background-color: var(--accent-gold) !important;
          color: var(--bg-primary) !important;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(250, 204, 21, 0.3) !important;
          border-color: var(--accent-gold) !important;
        }
        .footer-link:hover {
          color: var(--accent-gold) !important;
          padding-left: 5px;
        }
        .footer-link {
          transition: all 0.2s ease !important;
        }
        .social-icon:nth-child(2):hover {
          background-color: var(--accent-blue) !important;
          border-color: var(--accent-blue) !important;
          box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3) !important;
        }
        .social-icon:nth-child(3):hover {
          background-color: #ef4444 !important;
          border-color: #ef4444 !important;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3) !important;
        }
      `}</style>
    </footer>
  );
}
