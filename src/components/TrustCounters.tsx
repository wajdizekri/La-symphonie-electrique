'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Award, Star, Users } from 'lucide-react';

type Counter = {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
};

const counters: Counter[] = [
  { icon: <Briefcase size={32} />, value: 200, suffix: '+', label: 'Chantiers réalisés' },
  { icon: <Award size={32} />, value: 5, suffix: ' ans', label: "D'expérience" },
  { icon: <Star size={32} />, value: 10, decimals: 0, suffix: '/10', label: 'Note clients moyenne' },
  { icon: <Users size={32} />, value: 300, suffix: '+', label: 'Clients satisfaits' },
];

function AnimatedCount({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(target * eased);
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(target);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {decimals ? value.toFixed(decimals) : Math.floor(value).toLocaleString('fr-FR')}
    </span>
  );
}

export default function TrustCounters() {
  return (
    <section
      className="section"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '60px 0',
      }}
    >
      <div className="container">
        <div className="grid grid-4" style={{ gap: '30px' }}>
          {counters.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ color: 'var(--accent-gold)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                {c.icon}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                <AnimatedCount target={c.value} decimals={c.decimals} />
                {c.suffix && <span style={{ color: 'var(--accent-gold)' }}>{c.suffix}</span>}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {c.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
