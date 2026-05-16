import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  total,
  perPage,
  basePath,
  searchParams,
}: {
  page: number;
  total: number;
  perPage: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages === 1) return null;

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (typeof v === 'string') params.set(k, v);
    }
    if (p > 1) params.set('page', String(p));
    else params.delete('page');
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ''}`;
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '20px',
      padding: '15px 20px',
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
    }}>
      <span>
        Page {page} sur {totalPages} · {total} résultat{total > 1 ? 's' : ''}
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        {page > 1 && (
          <Link href={buildHref(page - 1)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            <ChevronLeft size={14} /> Précédent
          </Link>
        )}
        {page < totalPages && (
          <Link href={buildHref(page + 1)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
            Suivant <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
