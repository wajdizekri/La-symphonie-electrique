import db from '@/lib/db';
import Link from 'next/link';
import { Briefcase, CheckCircle, Clock, AlertCircle, Settings } from 'lucide-react';
import ProjectActions from './ProjectActions';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';

const PER_PAGE = 20;

function escapeLike(s: string) {
  return s.replace(/[\\%_]/g, c => '\\' + c);
}

const STATUSES = [
  { value: 'planning', label: 'En préparation' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
];

type ProjectRow = {
  id: number;
  title: string;
  status: string;
  tracking_token: string | null;
  client_name: string;
  pending_amount: number | null;
};

export default async function AdminProjects({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const status = sp.status ?? '';
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PER_PAGE;

  const where: string[] = [];
  const params: any[] = [];
  if (q) {
    where.push("(projects.title LIKE ? ESCAPE '\\' OR clients.name LIKE ? ESCAPE '\\')");
    const like = `%${escapeLike(q)}%`;
    params.push(like, like);
  }
  if (status) {
    where.push('projects.status = ?');
    params.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const total = (db.prepare(
    `SELECT COUNT(*) as c FROM projects JOIN clients ON projects.client_id = clients.id ${whereSql}`
  ).get(...params) as { c: number }).c;

  const projects = db.prepare(`
    SELECT
      projects.id, projects.title, projects.status, projects.tracking_token,
      clients.name AS client_name,
      (
        SELECT amount FROM payments
        WHERE project_id = projects.id AND status = 'pending'
        ORDER BY created_at DESC LIMIT 1
      ) AS pending_amount
    FROM projects
    JOIN clients ON projects.client_id = clients.id
    ${whereSql}
    ORDER BY projects.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, PER_PAGE, offset) as ProjectRow[];

  return (
    <div>
      <header style={{ marginBottom: 'var(--spacing-xxl)' }}>
        <h1>Gestion des Projets</h1>
        <p>Suivez l&apos;avancement de vos chantiers et gérez la facturation.</p>
      </header>

      <ListToolbar placeholder="Rechercher un projet (titre, client)" statusOptions={STATUSES} />

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {projects.length > 0 ? projects.map((project) => (
          <div key={project.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderRadius: '10px',
                color: 'var(--accent-blue)',
              }}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{project.title}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Client&nbsp;: {project.client_name}</p>
                {project.pending_amount != null && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={12} />
                    Facture en attente&nbsp;: {project.pending_amount.toFixed(2)} €
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: project.status === 'completed' ? 'var(--success)' : 'var(--accent-gold)',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {project.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                {project.status === 'completed' ? 'Terminé' : project.status === 'in_progress' ? 'En cours' : 'En préparation'}
              </span>

              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.875rem' }}
                >
                  <Settings size={14} /> Gérer
                </Link>
                <ProjectActions projectId={project.id} trackingToken={project.tracking_token} />
              </div>
            </div>
          </div>
        )) : (
          <div className="card text-center" style={{ padding: '60px' }}>
            <p>{q || status ? 'Aucun projet ne correspond aux filtres.' : 'Aucun projet actif. Acceptez un devis pour démarrer un projet.'}</p>
          </div>
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        perPage={PER_PAGE}
        basePath="/admin/projects"
        searchParams={sp}
      />
    </div>
  );
}
