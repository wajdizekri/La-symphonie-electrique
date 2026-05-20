'use client';

import Navbar from '@/components/Navbar';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, CheckCircle, Clock, Construction, CreditCard, PartyPopper, Mail, Send } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type ProjectStatus = 'planning' | 'in_progress' | 'completed';

type Project = {
  token: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  amount_due: number | null;
  payment_id: number | null;
};

const STEP_ORDER: { key: ProjectStatus | 'accepted'; label: string }[] = [
  { key: 'accepted', label: 'Devis accepté' },
  { key: 'planning', label: 'En préparation' },
  { key: 'in_progress', label: 'Travaux en cours' },
  { key: 'completed', label: 'Mise en service' },
];

function buildSteps(project: Project) {
  const reached = STEP_ORDER.findIndex(s => s.key === project.status);
  return STEP_ORDER.map((s, i) => ({
    label: s.label,
    status: i < reached ? 'completed' : i === reached ? 'current' : 'pending',
  }));
}

function SuiviContent() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') ?? '';
  const [token, setToken] = useState(initialToken);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true); setResendError(''); setResendDone(false);
    try {
      const res = await fetch('/api/projects/resend-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (res.ok) setResendDone(true);
      else setResendError(data.error || 'Erreur');
    } catch {
      setResendError('Erreur réseau.');
    } finally {
      setResendLoading(false);
    }
  };

  const fetchProject = useCallback(async (t: string) => {
    setLoading(true);
    setError('');
    setProject(null);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(t)}`);
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: 'Erreur' }));
        setError(msg || 'Projet non trouvé.');
        return;
      }
      setProject(await res.json());
    } catch {
      setError('Erreur réseau. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialToken) {
      // Fetch au montage piloté par le token de l'URL : usage légitime, la règle le sur-signale.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProject(initialToken);
    }
  }, [initialToken, fetchProject]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token.trim()) return;
    await fetchProject(token.trim());
  };

  const handlePayment = async () => {
    if (!project || project.amount_due == null || project.payment_id == null) return;
    setPaying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: project.amount_due,
          projectName: project.title,
          trackingToken: project.token,
          paymentId: project.payment_id,
        }),
      });

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Erreur: URL de session non reçue.');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la redirection vers Stripe.');
    }
    setPaying(false);
  };

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '600px' }}>
          
          {searchParams.get('success') && (
            <div className="card" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)', marginBottom: '40px', textAlign: 'center' }}>
              <PartyPopper className="text-success" style={{ margin: '0 auto 10px' }} size={32} />
              <h3 className="text-success">Paiement Réussi !</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Merci pour votre confiance. Votre facture est en cours de traitement.</p>
            </div>
          )}

          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h1 className="text-gold">Suivi de votre Chantier</h1>
            <p>Collez le lien de suivi reçu par email ou saisissez votre code de suivi.</p>
          </div>

          <div className="card">
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Code de suivi (UUID)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: 'var(--radius-md)', 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  color: 'white'
                }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              </button>
            </form>
            {error && <p style={{ color: 'var(--error)', marginTop: '10px', fontSize: '0.875rem' }}>{error}</p>}

            {/* Renvoyer le lien par email */}
            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.85rem' }}>
              {!showResend ? (
                <button
                  type="button"
                  onClick={() => { setShowResend(true); setResendDone(false); setResendError(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Je n&apos;ai plus le lien — recevoir mes liens par email
                </button>
              ) : resendDone ? (
                <p style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}>
                  <CheckCircle size={16} />
                  Si un projet correspond à cet email, vous allez recevoir les liens.
                </p>
              ) : (
                <form onSubmit={handleResend} style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      placeholder="Votre email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%', padding: '10px 12px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        color: 'white', fontSize: '0.875rem',
                      }}
                    />
                  </div>
                  <button type="submit" disabled={resendLoading} className="btn btn-primary" style={{ padding: '0 14px', fontSize: '0.85rem' }}>
                    {resendLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResend(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 6px', fontSize: '0.85rem' }}
                  >
                    Annuler
                  </button>
                </form>
              )}
              {resendError && <p style={{ color: 'var(--error)', marginTop: '8px', fontSize: '0.8rem' }}>{resendError}</p>}
            </div>
          </div>

          {project && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '40px' }}
            >
              <div className="card" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                <h2 style={{ marginBottom: '30px' }}>{project.title}</h2>
                
                <div style={{ display: 'grid', gap: '30px', position: 'relative', marginBottom: '40px' }}>
                  {buildSteps(project).map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: step.status === 'completed' ? 'var(--success)' :
                                       step.status === 'current' ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                        border: '2px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.status === 'completed' ? 'white' : 'inherit'
                      }}>
                        {step.status === 'completed' ? <CheckCircle size={18} /> :
                         step.status === 'current' ? <Construction size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: step.status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{step.label}</h4>
                      </div>
                    </div>
                  ))}
                </div>

                {project.amount_due !== null && (
                  <div style={{
                    marginTop: '40px',
                    padding: '25px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Solde à régler</span>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{project.amount_due.toFixed(2)} €</div>
                    </div>
                    <button
                      onClick={handlePayment}
                      className="btn btn-primary"
                      disabled={paying}
                      style={{ padding: '12px 25px', boxShadow: 'var(--shadow-glow)' }}
                    >
                      {paying ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> Payer avec Stripe</>}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function SuiviProjet() {
  return (
    <Suspense fallback={null}>
      <SuiviContent />
    </Suspense>
  );
}
