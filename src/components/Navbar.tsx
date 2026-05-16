'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav style={{
      padding: 'var(--spacing-md) 0',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--accent-gold)'
        }}>
          <Logo size={40} priority />
          <span style={{ color: 'var(--text-primary)' }}>LA SYMPHONIE</span>
          <span style={{ color: 'var(--accent-gold)' }}>ÉLECTRIQUE</span>
        </Link>
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center'
        }}>
          <Link href="/services" className="nav-link">Services</Link>
          <Link href="/projets" className="nav-link">Projets</Link>
          <Link href="/suivi" className="nav-link">Suivi Chantier</Link>
          <Link href="/contact" className="btn btn-primary" style={{ padding: '8px 20px' }}>Devis Gratuit</Link>
          <Link href="/admin/login" style={{ 
            marginLeft: '10px', 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
            Espace Pro
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .nav-link:hover {
          color: var(--accent-gold);
        }
      `}</style>
    </nav>
  );
}
