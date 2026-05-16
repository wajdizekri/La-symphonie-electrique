import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { PaymentCreateSchema, formatZodError } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const parsed = PaymentCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { projectId, amount } = parsed.data;

    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return NextResponse.json({ error: `Projet ${projectId} introuvable.` }, { status: 404 });
    }

    const result = db.prepare(
      "INSERT INTO payments (project_id, amount, status) VALUES (?, ?, 'pending')"
    ).run(projectId, amount);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
