import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { RegisterSchema, formatZodError } from '@/lib/validators';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { randomBytes } from 'node:crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || 'La Symphonie Électrique <onboarding@resend.dev>';

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`register:${clientIp(request)}`, 3, 60 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${limit.retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const parsed = RegisterSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { name, email, password } = parsed.data;

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = randomBytes(32).toString('hex');

    // Statut 'unverified' : ni le pro ni l'admin ne peut rien faire tant que l'email
    // n'est pas confirmé. Une fois confirmé : passe en 'pending' → approbation admin.
    db.prepare(
      'INSERT INTO users (name, email, password, role, status, email_verification_token) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, email, hashedPassword, 'admin', 'unverified', verificationToken);

    // Email de confirmation au pro
    if (process.env.RESEND_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const verifyLink = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;
      try {
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: 'Confirmez votre email — Espace Pro La Symphonie Électrique',
          html: `
            <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #fac015; border-radius: 10px;">
              <h2 style="color: #fac015;">Bienvenue ${name},</h2>
              <p>Votre inscription à l'espace professionnel de La Symphonie Électrique a bien été reçue.</p>
              <p><strong>Une dernière étape :</strong> confirmez votre adresse email en cliquant sur le bouton ci-dessous.</p>
              <p style="margin: 30px 0;">
                <a href="${verifyLink}" style="background-color: #fac015; color: #0c0a09; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 700;">
                  Confirmer mon email
                </a>
              </p>
              <p style="font-size: 0.85rem; color: #666;">
                Ou copiez ce lien dans votre navigateur :<br />
                <a href="${verifyLink}">${verifyLink}</a>
              </p>
              <p style="font-size: 0.85rem; color: #666;">
                Une fois votre email confirmé, votre compte sera examiné par notre équipe avant validation finale.
              </p>
              <p style="font-size: 0.75rem; color: #999; margin-top: 30px;">
                Si vous n'êtes pas à l'origine de cette inscription, ignorez ce message.
              </p>
            </div>
          `,
        });
      } catch (emailError: any) {
        console.error('Resend error (confirmation):', emailError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Un email de confirmation vient de vous être envoyé.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription.' }, { status: 500 });
  }
}
