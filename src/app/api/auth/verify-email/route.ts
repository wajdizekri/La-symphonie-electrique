import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
const FROM = process.env.RESEND_FROM_EMAIL || 'La Symphonie Électrique <onboarding@resend.dev>';

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || '';

  if (token.length < 20) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=invalid-token`);
  }

  const user = db.prepare(
    'SELECT id, name, email, email_verified_at FROM users WHERE email_verification_token = ?'
  ).get(token) as { id: number; name: string; email: string; email_verified_at: string | null } | undefined;

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/admin/login?error=invalid-token`);
  }

  // Déjà vérifié : on accepte (idempotent), pas d'erreur, juste redirect.
  if (user.email_verified_at) {
    return NextResponse.redirect(`${baseUrl}/admin/login?verified=1`);
  }

  // Marquer comme vérifié + passer en 'pending' (en attente d'approbation admin).
  db.prepare(
    "UPDATE users SET email_verified_at = CURRENT_TIMESTAMP, email_verification_token = NULL, status = 'pending' WHERE id = ?"
  ).run(user.id);

  // Notifier l'admin de référence qu'un compte est à approuver.
  const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (process.env.RESEND_API_KEY && notifyTo) {
    try {
      await resend.emails.send({
        from: FROM,
        to: notifyTo,
        subject: 'Nouvel admin à valider',
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #fac015;">Nouvelle inscription confirmée</h2>
            <p>Un professionnel vient de confirmer son email :</p>
            <ul>
              <li><strong>Nom :</strong> ${user.name}</li>
              <li><strong>Email :</strong> ${user.email}</li>
            </ul>
            <p>Connectez-vous à <a href="${baseUrl}/admin/users">${baseUrl}/admin/users</a> pour approuver son accès.</p>
          </div>
        `,
      });
    } catch (e: any) {
      console.error('Resend error (admin notif):', e.message);
    }
  }

  return NextResponse.redirect(`${baseUrl}/admin/login?verified=1`);
}
