import { Phone, Zap } from 'lucide-react';

export default function UrgencyBanner() {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #fac015 0%, #f59e0b 100%)',
        color: '#0c0a09',
        padding: '10px 0',
        fontSize: '0.875rem',
        fontWeight: 700,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} fill="currentColor" />
          DÉPANNAGE URGENT — 24H/24 — 7J/7
        </span>
        <a
          href="tel:+3308841662"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0c0a09',
            color: '#fac015',
            padding: '4px 14px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          <Phone size={14} />
          08 84 16 62
        </a>
      </div>
    </div>
  );
}
