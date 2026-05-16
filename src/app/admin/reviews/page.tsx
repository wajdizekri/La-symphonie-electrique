import db from '@/lib/db';
import { Star, Clock, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import ReviewActions from './ReviewActions';

type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved';
  created_at: string;
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? 'var(--accent-gold)' : 'none'}
          className={i < rating ? 'text-gold' : 'text-muted'}
          color={i < rating ? 'var(--accent-gold)' : 'var(--text-muted)'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="card"
      style={{
        padding: '20px 24px',
        borderLeft: review.status === 'pending' ? '4px solid var(--accent-gold)' : '4px solid var(--success)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>{review.name}</h3>
            <StarRow rating={review.rating} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {review.rating}/5
            </span>
          </div>
          <p style={{ margin: '8px 0 12px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            &laquo;&nbsp;{review.comment}&nbsp;&raquo;
          </p>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={12} /> Reçu le {new Date(review.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <ReviewActions id={review.id} status={review.status} authorName={review.name} />
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const all = db.prepare('SELECT id, name, rating, comment, status, created_at FROM reviews ORDER BY created_at DESC').all() as Review[];
  const pending = all.filter(r => r.status === 'pending');
  const approved = all.filter(r => r.status === 'approved');

  const avg = approved.length > 0
    ? approved.reduce((a, r) => a + r.rating, 0) / approved.length
    : 0;

  return (
    <div>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Avis clients</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Modérez les avis avant qu&apos;ils n&apos;apparaissent sur le site public.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-3" style={{ marginBottom: '30px', gap: '20px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>À modérer</span>
            <AlertCircle size={16} className="text-gold" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px' }}>{pending.length}</div>
        </div>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avis publiés</span>
            <CheckCircle2 size={16} className="text-success" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px' }}>{approved.length}</div>
        </div>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Note moyenne</span>
            <Star size={16} className="text-gold" fill="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '6px' }}>
            {avg > 0 ? `${avg.toFixed(1)} / 5` : '—'}
          </div>
        </div>
      </div>

      {/* Pending */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} className="text-gold" />
          En attente de modération ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun avis en attente. 👍
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {pending.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} className="text-success" />
          Avis publiés sur le site ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
            <p style={{ margin: 0 }}>Aucun avis approuvé. Approuvez-en un ci-dessus pour l&apos;afficher sur la page d&apos;accueil.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {approved.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
