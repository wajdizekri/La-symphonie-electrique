'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
          <AlertTriangle size={64} className="text-gold" style={{ margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '15px' }}>Une erreur est survenue</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Désolé, quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
          </p>
          {error.digest && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '30px' }}>
              Code d&apos;erreur : {error.digest}
            </p>
          )}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button onClick={reset} className="btn btn-primary">
              <RefreshCw size={18} /> Réessayer
            </button>
            <Link href="/" className="btn btn-secondary">
              <Home size={18} /> Accueil
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
