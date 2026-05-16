import Link from 'next/link';
import { Compass, Home, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <Compass size={64} className="text-gold" style={{ margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>404</h1>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '15px', color: 'var(--text-secondary)' }}>
            Page introuvable
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link href="/" className="btn btn-primary">
              <Home size={18} /> Accueil
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              <MessageSquare size={18} /> Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
