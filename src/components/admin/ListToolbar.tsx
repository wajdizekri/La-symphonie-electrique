'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Search, Filter, X } from 'lucide-react';

type StatusOption = { value: string; label: string };

export default function ListToolbar({
  placeholder = 'Rechercher…',
  statusOptions,
}: {
  placeholder?: string;
  statusOptions?: StatusOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const status = searchParams.get('status') ?? '';

  // Debounce search input updates
  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if (q === current) return;
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (q) params.set('q', q);
      else params.delete('q');
      params.delete('page');
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }, 300);
    return () => clearTimeout(id);
  }, [q, pathname, router, searchParams]);

  const updateStatus = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('status', value);
    else params.delete('status');
    params.delete('page');
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  };

  const clearAll = () => {
    setQ('');
    startTransition(() => router.replace(pathname));
  };

  const hasFilters = q || status;

  return (
    <div className="card" style={{ padding: '15px 20px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder={placeholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'white',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {statusOptions && statusOptions.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} className="text-gold" />
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              color: 'white',
              fontSize: '0.9rem',
              minWidth: '160px',
            }}
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={clearAll}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
        >
          <X size={14} /> Réinitialiser
        </button>
      )}

      {pending && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>…</span>}
    </div>
  );
}
