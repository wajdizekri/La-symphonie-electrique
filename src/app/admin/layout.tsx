'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Briefcase, CreditCard, LogOut, ShieldCheck, Star, UserCog, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';

type Counts = { requests: number; reviews: number; users: number; payments: number };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [counts, setCounts] = useState<Counts>({ requests: 0, reviews: 0, users: 0, payments: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  // Récupère les compteurs au chargement et à chaque changement de page (refresh).
  useEffect(() => {
    let cancelled = false;
    const fetchCounts = () => {
      fetch('/api/admin/counts')
        .then(r => (r.ok ? r.json() : null))
        .then(d => { if (!cancelled && d && typeof d.requests === 'number') setCounts(d); })
        .catch(() => {});
    };
    fetchCounts();
    const id = setInterval(fetchCounts, 60_000); // refresh toutes les minutes
    return () => { cancelled = true; clearInterval(id); };
  }, [pathname]);

  // Referme le menu mobile quand on change de page
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin/dashboard', badge: 0 },
    { name: 'Demandes', icon: <FileText size={20} />, href: '/admin/requests', badge: counts.requests },
    { name: 'Clients', icon: <Users size={20} />, href: '/admin/clients', badge: 0 },
    { name: 'Projets', icon: <Briefcase size={20} />, href: '/admin/projects', badge: 0 },
    { name: 'Paiements', icon: <CreditCard size={20} />, href: '/admin/payments', badge: counts.payments },
    { name: 'Avis clients', icon: <Star size={20} />, href: '/admin/reviews', badge: counts.reviews },
    { name: 'Accès', icon: <ShieldCheck size={20} />, href: '/admin/users', badge: counts.users },
    { name: 'Mon compte', icon: <UserCog size={20} />, href: '/admin/account', badge: 0 },
  ];

  const totalBadges = counts.requests + counts.reviews + counts.users + counts.payments;

  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/register' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password';

  if (isAuthPage) {
    return <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Barre du haut — mobile uniquement */}
      <header className="admin-topbar">
        <Link href="/admin/dashboard" className="admin-topbar-brand">
          <Logo size={32} />
          <span>SYMPHONIE ADMIN</span>
        </Link>
        <button
          type="button"
          className="admin-burger"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
          {!menuOpen && totalBadges > 0 && <span className="admin-burger-dot" />}
        </button>
      </header>

      {/* Voile de fermeture — mobile uniquement */}
      {menuOpen && <div className="admin-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={menuOpen ? 'admin-sidebar open' : 'admin-sidebar'}>
        <Link href="/" className="admin-sidebar-brand" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          fontSize: '1rem',
          fontWeight: 800,
          color: 'var(--accent-gold)'
        }}>
          <Logo size={36} />
          <span>SYMPHONIE ADMIN</span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {menuItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  backgroundColor: active ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.badge > 0 && (
                  <span
                    aria-label={`${item.badge} en attente`}
                    style={{
                      minWidth: '22px',
                      height: '22px',
                      padding: '0 7px',
                      borderRadius: '11px',
                      backgroundColor: 'var(--accent-gold)',
                      color: '#0c0a09',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: '12px 16px',
            color: 'var(--error)',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}>
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main" style={{ flex: 1, padding: 'var(--spacing-xxl)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
