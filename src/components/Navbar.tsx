'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand" onClick={close}>
          <Logo size={56} priority />
          <span className="brand-text brand-white">LA SYMPHONIE</span>
          <span className="brand-text brand-gold">ÉLECTRIQUE</span>
        </Link>

        <button
          type="button"
          className="nav-burger"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div className={open ? 'nav-links open' : 'nav-links'}>
          <Link href="/services" className="nav-link" onClick={close}>Services</Link>
          <Link href="/projets" className="nav-link" onClick={close}>Projets</Link>
          <Link href="/suivi" className="nav-link" onClick={close}>Suivi Chantier</Link>
          <Link href="/contact" className="btn btn-primary nav-cta" onClick={close}>Devis Gratuit</Link>
          <Link href="/admin/login" className="nav-pro" onClick={close}>
            <span className="nav-pro-dot" />
            Espace Pro
          </Link>
        </div>
      </div>
    </nav>
  );
}
