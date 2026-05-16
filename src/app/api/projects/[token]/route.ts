import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const project = db.prepare(
      'SELECT id, tracking_token, title, description, status, start_date, end_date, created_at FROM projects WHERE tracking_token = ?'
    ).get(token) as any;

    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable.' }, { status: 404 });
    }

    const pendingPayment = db.prepare(
      "SELECT id, amount FROM payments WHERE project_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1"
    ).get(project.id) as { id: number; amount: number } | undefined;

    return NextResponse.json({
      token: project.tracking_token,
      title: project.title,
      status: project.status,
      created_at: project.created_at,
      start_date: project.start_date,
      end_date: project.end_date,
      amount_due: pendingPayment?.amount ?? null,
      payment_id: pendingPayment?.id ?? null,
    });
  } catch (error: any) {
    console.error('Failed to fetch project:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
