import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { ForgotPasswordSchema, formatZodError } from '@/lib/validators';
import { Resend } from 'resend';
import { randomBytes } from 'node:crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'La Symphonie Électrique <onboarding@resend.dev>';
const RESET_TTL_MS = 60 * 60 * 1000; // 1h

export async function POST(request: Request) {
  // Anti-énumération : rate limit serré par IP.
  const limit = rateLimit(`forgot:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const parsed = ForgotPasswordSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }
  const { email } = parsed.data;

  // RÉPONSE TOUJOURS GÉNÉRIQUE — on ne révèle pas si l'email existe ou non.
  const genericResponse = NextResponse.json({
    success: true,
    message: 'Si un compte existe pour cet email, un lien de réinitialisation vient d\'être envoyé.',
  });

  try {
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(email) as
      | { id: number; name: string; email: string }
      | undefined;
    if (!user) return genericResponse;

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + RESET_TTL_MS).toISOString();
    db.prepare(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?'
    ).run(token, expires, user.id);

    if (process.env.RESEND_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const link = `${baseUrl}/admin/reset-password?token=${token}`;
      try {
        await resend.emails.send({
          from: FROM,
          to: user.email,
          subject: 'Réinitialisation de votre mot de passe',
          html: `
            <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #fac015; border-radius: 10px;">
              <h2 style="color: #fac015;">Bonjour ${user.name},</h2>
              <p>Vous avez demandé à réinitialiser votre mot de passe sur l'espace pro La Symphonie Électrique.</p>
              <p style="margin: 30px 0;">
                <a href="${link}" style="background-color: #fac015; color: #0c0a09; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700;">
                  Choisir un nouveau mot de passe
                </a>
              </p>
              <p style="font-size: 0.85rem; color: #666;">
                Ou copiez ce lien : <a href="${link}">${link}</a>
              </p>
              <p style="font-size: 0.85rem; color: #666;">
                <strong>Ce lien expire dans 1 heure.</strong> Si vous n'êtes pas à l'origine de cette demande, ignorez ce message — votre mot de passe restera inchangé.
              </p>
            </div>
          `,
        });
      } catch (e: any) {
        console.error('Resend error (reset):', e.message);
      }
    }
  } catch (e) {
    console.error('Forgot-password error:', e);
  }

  return genericResponse;
}
