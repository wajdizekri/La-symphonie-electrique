import db from '@/lib/db';
import { Calendar as CalendarIcon, Clock, MapPin, User as UserIcon, Plus } from 'lucide-react';

export default function AdminPlanning() {
  const interventions = db.prepare(`
    SELECT interventions.*, clients.name, clients.address 
    FROM interventions 
    LEFT JOIN clients ON interventions.client_id = clients.id 
    ORDER BY date ASC
  `).all() as any[];

  return (
    <div>
      <header style={{ marginBottom: 'var(--spacing-xxl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Planning des Interventions</h1>
          <p>Visualisez vos rendez-vous et chantiers à venir.</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Nouveau RDV</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-xl)' }}>
        {/* Agenda View */}
        <div className="grid" style={{ gap: 'var(--spacing-md)' }}>
          {interventions.length > 0 ? interventions.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ 
                textAlign: 'center', 
                padding: '15px', 
                backgroundColor: 'rgba(250, 204, 21, 0.1)', 
                borderRadius: 'var(--radius-md)',
                minWidth: '90px'
              }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {new Date(item.date).toLocaleDateString('fr-FR', { month: 'short' })}
                </span>
                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {new Date(item.date).getDate()}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.title}</h3>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {item.start_time || 'Non défini'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><UserIcon size={14} /> {item.name || 'Inconnu'}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--accent-blue)',
                  fontWeight: 600
                }}>
                  En cours
                </span>
              </div>
            </div>
          )) : (
            <div className="card text-center" style={{ padding: '60px' }}>
              <CalendarIcon size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>Aucun rendez-vous prévu pour les prochains jours.</p>
            </div>
          )}
        </div>

        {/* Calendar Sidebar placeholder */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px' }}>Calendrier Rapide</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '10px', 
            textAlign: 'center',
            fontSize: '0.8rem'
          }}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{d}</div>)}
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} style={{ 
                padding: '8px', 
                borderRadius: '4px',
                backgroundColor: (i + 1) === new Date().getDate() ? 'var(--accent-gold)' : 'transparent',
                color: (i + 1) === new Date().getDate() ? 'var(--bg-primary)' : 'var(--text-primary)',
                fontWeight: (i + 1) === new Date().getDate() ? 800 : 400
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
