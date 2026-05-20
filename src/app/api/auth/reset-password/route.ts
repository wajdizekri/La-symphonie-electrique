import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { ResetPasswordSchema, formatZodError } from '@/lib/validators';

export async function POST(request: Request) {
  const limit = rateLimit(`reset:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const parsed = ResetPasswordSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }
  const { token, password } = parsed.data;

  const user = db.prepare(
    'SELECT id, password_reset_expires FROM users WHERE password_reset_token = ?'
  ).get(token) as { id: number; password_reset_expires: string | null } | undefined;

  if (!user || !user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
    return NextResponse.json({ error: 'Lien invalide ou expiré. Refais une demande de réinitialisation.' }, { status: 400 });
  }

  try {
    const hashed = await hashPassword(password);
    db.prepare(
      'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?'
    ).run(hashed, user.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Reset error:', e);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}
