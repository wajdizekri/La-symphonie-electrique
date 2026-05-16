import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { UserApprovalSchema, formatZodError } from '@/lib/validators';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = UserApprovalSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) {
      return NextResponse.json({ error: `Utilisateur ${id} introuvable.` }, { status: 404 });
    }

    db.prepare("UPDATE users SET status = 'approved' WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to approve user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
