'use client';

import { useState, useTransition } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateProject } from '@/lib/actions';

type Project = {
  id: number;
  title: string;
  description: string | null;
  status: 'planning' | 'in_progress' | 'completed';
  start_date: string | null;
  end_date: string | null;
  internal_notes: string | null;
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  color: 'white',
  fontSize: '0.9rem',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  fontWeight: 700,
};

export default function ProjectEditForm({ project }: { project: Project }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProject(formData);
      if (res.success) {
        setFeedback({ kind: 'ok', msg: 'Modifications enregistrées.' });
        router.refresh();
      } else {
        setFeedback({ kind: 'err', msg: res.error || 'Erreur' });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '24px' }}>
      <input type="hidden" name="id" value={project.id} />

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Titre</label>
        <input name="title" defaultValue={project.title} required style={inputStyle} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Statut</label>
        <select name="status" defaultValue={project.status} style={inputStyle}>
          <option value="planning">En préparation</option>
          <option value="in_progress">Travaux en cours</option>
          <option value="completed">Terminé</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle}>Date de début</label>
          <input name="start_date" type="date" defaultValue={project.start_date ?? ''} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Date de fin prévue</label>
          <input name="end_date" type="date" defaultValue={project.end_date ?? ''} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Description (visible client)</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={project.description ?? ''}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Notes internes (admin uniquement)</label>
        <textarea
          name="internal_notes"
          rows={4}
          defaultValue={project.internal_notes ?? ''}
          placeholder="Diagnostic, matériel à commander, particularités du chantier…"
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        {feedback && (
          <span style={{
            fontSize: '0.85rem',
            color: feedback.kind === 'ok' ? 'var(--success)' : 'var(--error)',
          }}>
            {feedback.msg}
          </span>
        )}
        <button type="submit" disabled={pending} className="btn btn-primary" style={{ marginLeft: 'auto', padding: '10px 20px' }}>
          {pending ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Enregistrer</>}
        </button>
      </div>
    </form>
  );
}
