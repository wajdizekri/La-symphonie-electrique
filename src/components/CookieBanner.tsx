'use client';

import { useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const noopSubscribe = () => () => {};

export default function CookieBanner() {
  const consent = useSyncExternalStore(
    noopSubscribe,
    () => localStorage.getItem('cookie-consent'),
    () => null
  );
  const [dismissed, setDismissed] = useState(false);
  const isVisible = !dismissed && consent !== 'accepted' && consent !== 'rejected';

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setDismissed(true);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div className="card" style={{ 
            maxWidth: '800px', 
            padding: '20px 30px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: '1px solid var(--accent-gold)'
          }}>
            <ShieldCheck className="text-gold" size={40} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0' }}>Respect de votre vie privée</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant, vous acceptez notre politique de confidentialité.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={acceptCookies}
                className="btn btn-primary" 
                style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}
              >
                Accepter
              </button>
              <button
                onClick={rejectCookies}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Refuser
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
