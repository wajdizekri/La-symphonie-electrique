'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { submitReview } from '@/lib/actions';

export default function LaisserAvis() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError('Sélectionnez une note de 1 à 5 étoiles.');
      return;
    }
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set('rating', String(rating));
    const res = await submitReview(formData);
    if (res.success) setSubmitted(true);
    else setError(res.error || 'Erreur');
    setSubmitting(false);
  };

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h1 className="text-gold">Laisser un avis</h1>
            <p>Votre retour nous aide à nous améliorer et rassure nos futurs clients.</p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center"
              style={{ padding: '60px' }}
            >
              <CheckCircle size={64} className="text-gold" style={{ margin: '0 auto 20px' }} />
              <h2 className="text-gold">Merci pour votre avis !</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                Il sera publié après validation par notre équipe.
              </p>
              <Link href="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>
                Retour à l&apos;accueil
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="card" style={{ padding: '30px', display: 'grid', gap: '20px' }}>
              {/* Honeypot anti-bot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
              />
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Votre nom (ou initiales + ville)</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ex : Marc D. — Cluses"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Votre note</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = n <= (hover || rating);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
                          transition: 'transform 0.1s',
                          transform: active ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        <Star size={32} fill={active ? 'var(--accent-gold)' : 'none'} />
                      </button>
                    );
                  })}
                  <span style={{ marginLeft: '12px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {rating > 0 ? `${rating}/5` : 'Cliquez sur une étoile'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Votre commentaire</label>
                <textarea
                  name="comment"
                  required
                  rows={6}
                  placeholder="Décrivez votre expérience : type de prestation, qualité du travail, professionnalisme…"
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Votre avis sera publié après validation par notre équipe (sous 48h). Nous nous réservons le droit de modérer les contenus inappropriés.
              </p>

              {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>{error}</p>}

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '14px', fontSize: '1rem' }}>
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Publier mon avis</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
  fontFamily: 'inherit',
  width: '100%',
};
