import db from '@/lib/db';
import { Users, FileText, Briefcase, TrendingUp, ShieldAlert, ArrowRight, ExternalLink, AlertCircle, Crown, Star } from 'lucide-react';
import Link from 'next/link';
import RevenueChart from './RevenueChart';

export default function AdminDashboard() {
  // Fetch stats from DB
  const clientsCount = db.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
  const requestsCount = db.prepare('SELECT COUNT(*) as count FROM requests').get() as { count: number };
  const projectsCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  
  // Pending Admin Users (Security)
  const pendingAdmins = db.prepare("SELECT * FROM users WHERE status = 'pending'").all() as any[];

  // Pending Reviews
  const pendingReviewsCount = (db.prepare("SELECT COUNT(*) as c FROM reviews WHERE status = 'pending'").get() as { c: number }).c;
  
  // Recent Requests
  const pendingRequests = db.prepare("SELECT requests.*, clients.name FROM requests JOIN clients ON requests.client_id = clients.id WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5").all() as any[];

  const paid = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'paid'").get() as { total: number };
  const totalRevenue = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(paid.total);

  const monthly = (table: 'clients' | 'requests') => db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END), 0) AS curr,
      COALESCE(SUM(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', '-1 month') THEN 1 ELSE 0 END), 0) AS prev
    FROM ${table}
  `).get() as { curr: number; prev: number };

  const revenueMonthly = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN amount ELSE 0 END), 0) AS curr,
      COALESCE(SUM(CASE WHEN strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now', '-1 month') THEN amount ELSE 0 END), 0) AS prev
    FROM payments WHERE status = 'paid'
  `).get() as { curr: number; prev: number };

  const trend = ({ curr, prev }: { curr: number; prev: number }) => {
    if (prev === 0) return curr === 0 ? '—' : 'Nouveau';
    const pct = Math.round(((curr - prev) / prev) * 100);
    return `${pct >= 0 ? '+' : ''}${pct}%`;
  };

  const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'in_progress'").get() as { count: number };

  // Revenu mensuel sur 12 mois glissants
  const revenueByMonthRows = db.prepare(`
    SELECT strftime('%Y-%m', created_at) AS ym, COALESCE(SUM(amount), 0) AS revenue
    FROM payments
    WHERE status = 'paid' AND created_at >= date('now', '-12 months')
    GROUP BY ym
  `).all() as { ym: string; revenue: number }[];

  const revenueByMonth: { month: string; revenue: number }[] = [];
  const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const row = revenueByMonthRows.find(r => r.ym === ym);
    revenueByMonth.push({ month: monthLabels[d.getMonth()], revenue: row?.revenue ?? 0 });
  }

  // Factures impayées par tranche d'ancienneté
  const unpaidTranches = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN julianday('now') - julianday(created_at) < 30 THEN amount ELSE 0 END), 0) AS lt30,
      COALESCE(SUM(CASE WHEN julianday('now') - julianday(created_at) >= 30 AND julianday('now') - julianday(created_at) < 60 THEN amount ELSE 0 END), 0) AS d30_60,
      COALESCE(SUM(CASE WHEN julianday('now') - julianday(created_at) >= 60 AND julianday('now') - julianday(created_at) < 90 THEN amount ELSE 0 END), 0) AS d60_90,
      COALESCE(SUM(CASE WHEN julianday('now') - julianday(created_at) >= 90 THEN amount ELSE 0 END), 0) AS gt90
    FROM payments WHERE status = 'pending'
  `).get() as { lt30: number; d30_60: number; d60_90: number; gt90: number };

  // Top 5 clients par CA encaissé
  const topClients = db.prepare(`
    SELECT clients.id, clients.name, SUM(payments.amount) AS revenue
    FROM payments
    JOIN projects ON payments.project_id = projects.id
    JOIN clients ON projects.client_id = clients.id
    WHERE payments.status = 'paid'
    GROUP BY clients.id
    ORDER BY revenue DESC
    LIMIT 5
  `).all() as { id: number; name: string; revenue: number }[];

  const eur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const stats = [
    { label: 'Clients', value: clientsCount.count, icon: <Users size={20} className="text-blue" />, trend: trend(monthly('clients')), color: 'var(--accent-blue)' },
    { label: 'Demandes', value: requestsCount.count, icon: <FileText size={20} className="text-gold" />, trend: trend(monthly('requests')), color: 'var(--accent-gold)' },
    { label: 'Projets actifs', value: activeProjects.count, icon: <Briefcase size={20} className="text-blue" />, trend: `${projectsCount.count} au total`, color: 'var(--accent-blue)' },
    { label: 'Revenus', value: totalRevenue, icon: <TrendingUp size={20} className="text-gold" />, trend: trend(revenueMonthly), color: 'var(--success)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: 'var(--spacing-xxl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>Tableau de Bord</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Vue d'ensemble de l'écosystème <span className="text-gold">Symphonie Électrique</span>.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/projects" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Nouveau Chantier</Link>
          <Link href="/" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Voir le Site <ExternalLink size={14} /></Link>
        </div>
      </header>

      {/* Pending Reviews Alert */}
      {pendingReviewsCount > 0 && (
        <div className="card" style={{
          marginBottom: 'var(--spacing-md)',
          border: '1px solid var(--accent-gold)',
          background: 'rgba(250, 204, 21, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 25px',
          flexWrap: 'wrap',
          gap: '15px',
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Star size={26} className="text-gold" fill="var(--accent-gold)" />
            <div>
              <h4 style={{ margin: 0, color: 'var(--accent-gold)' }}>
                {pendingReviewsCount} avis client{pendingReviewsCount > 1 ? 's' : ''} à modérer
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Approuvez-les pour qu&apos;ils apparaissent sur la page d&apos;accueil.
              </p>
            </div>
          </div>
          <Link href="/admin/reviews" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
            Modérer les avis
          </Link>
        </div>
      )}

      {/* Alerts / Security Section */}
      {pendingAdmins.length > 0 && (
        <div className="card" style={{ 
          marginBottom: 'var(--spacing-xl)', 
          border: '1px solid var(--warning)', 
          background: 'rgba(245, 158, 11, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 25px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ color: 'var(--warning)', animation: 'pulse 2s infinite' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--warning)' }}>Action requise : {pendingAdmins.length} administrateur(s) en attente</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>De nouveaux comptes ont été créés et attendent votre validation pour accéder au panel.</p>
            </div>
          </div>
          <Link href="/admin/users" className="btn btn-primary" style={{ backgroundColor: 'var(--warning)', borderColor: 'var(--warning)', color: 'black', fontSize: '0.8rem' }}>
            Gérer les accès
          </Link>
        </div>
      )}

      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: 'var(--spacing-lg)', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)'
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '0.75rem', color: stat.color === 'var(--success)' ? 'var(--success)' : 'var(--text-muted)' }}>{stat.trend}</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</h3>
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'white' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xxl)' }}>
        {/* Revenue Chart Card */}
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0 }}>Revenus mensuels</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>12 derniers mois (factures encaissées)</p>
            </div>
          </div>
          <RevenueChart data={revenueByMonth} />
        </div>

        {/* Unpaid invoices by aging */}
        <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} className="text-gold" /> Factures impayées
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { label: '< 30 jours', value: unpaidTranches.lt30, color: 'var(--accent-gold)' },
              { label: '30 à 60 jours', value: unpaidTranches.d30_60, color: '#f97316' },
              { label: '60 à 90 jours', value: unpaidTranches.d60_90, color: '#ef4444' },
              { label: '> 90 jours (relance urgente)', value: unpaidTranches.gt90, color: '#dc2626' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '24px', backgroundColor: t.color, borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.85rem' }}>{t.label}</span>
                </div>
                <strong style={{ color: t.value > 0 ? t.color : 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {eur(t.value)}
                </strong>
              </div>
            ))}
          </div>
          <Link href="/admin/payments" className="btn btn-secondary" style={{ width: '100%', marginTop: '20px', fontSize: '0.85rem', padding: '8px' }}>
            Voir le détail des paiements <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Top clients */}
      <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xxl)' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={18} className="text-gold" /> Top 5 clients
        </h3>
        {topClients.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '30px 0' }}>
            Pas encore de paiement encaissé.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {topClients.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < topClients.length - 1 ? '1px solid var(--border)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                    color: i === 0 ? '#1a1a1a' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                  }}>{i + 1}</span>
                  <Link href={`/admin/clients/${c.id}`} style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>
                    {c.name}
                  </Link>
                </div>
                <strong style={{ color: 'var(--success)' }}>{eur(c.revenue)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0 }}>Dernières Demandes de Devis</h3>
          <Link href="/admin/requests" className="text-gold" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Voir toutes les demandes</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Client</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type de Service</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? pendingRequests.map((req, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="table-row">
                  <td style={{ padding: '15px 25px', fontWeight: 600, color: 'white' }}>{req.name}</td>
                  <td style={{ padding: '15px 25px', color: 'var(--text-secondary)' }}>{req.service_type}</td>
                  <td style={{ padding: '15px 25px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(req.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </td>
                  <td style={{ padding: '15px 25px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      backgroundColor: 'rgba(250, 204, 21, 0.1)', 
                      color: 'var(--accent-gold)',
                      border: '1px solid rgba(250, 204, 21, 0.2)'
                    }}>
                      EN ATTENTE
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={40} style={{ marginBottom: '15px', opacity: 0.2 }} />
                    <p>Aucune nouvelle demande à traiter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
