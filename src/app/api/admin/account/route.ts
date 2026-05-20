import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession, comparePasswords, hashPassword } from '@/lib/auth';
import { ChangePasswordSchema, formatZodError } from '@/lib/validators';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || typeof session.id !== 'number') {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  const parsed = ChangePasswordSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }
  const { currentPassword, newPassword } = parsed.data;

  const user = db.prepare('SELECT id, password FROM users WHERE id = ?').get(session.id) as
    | { id: number; password: string }
    | undefined;
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  }

  const ok = await comparePasswords(currentPassword, user.password);
  if (!ok) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: 'Le nouveau mot de passe doit être différent de l\'ancien.' }, { status: 400 });
  }

  const hashed = await hashPassword(newPassword);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, user.id);

  return NextResponse.json({ success: true });
}
