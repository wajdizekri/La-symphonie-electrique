'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, FileText, Briefcase, CreditCard, LogOut, ShieldCheck, Star } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin/dashboard' },
    { name: 'Demandes', icon: <FileText size={20} />, href: '/admin/requests' },
    { name: 'Clients', icon: <Users size={20} />, href: '/admin/clients' },
    { name: 'Projets', icon: <Briefcase size={20} />, href: '/admin/projects' },
    { name: 'Paiements', icon: <CreditCard size={20} />, href: '/admin/payments' },
    { name: 'Avis clients', icon: <Star size={20} />, href: '/admin/reviews' },
    { name: 'Accès', icon: <ShieldCheck size={20} />, href: '/admin/users' },
  ];

  const isAuthPage = pathname === '/admin/login' || pathname === '/admin/register';

  if (isAuthPage) {
    return <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--border)',
        padding: 'var(--spacing-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xxl)'
      }}>
        <Link href="/" style={{
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
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: pathname === item.href ? 'var(--accent-gold)' : 'var(--text-secondary)',
                backgroundColor: pathname === item.href ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                fontWeight: pathname === item.href ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
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
      <main style={{ flex: 1, padding: 'var(--spacing-xxl)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
