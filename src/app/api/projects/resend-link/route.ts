import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { ResendTrackingSchema, formatZodError } from '@/lib/validators';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
const FROM = process.env.RESEND_FROM_EMAIL || 'La Symphonie Électrique <onboarding@resend.dev>';

export async function POST(request: Request) {
  // Rate limit serré (anti-énumération + spam).
  const limit = rateLimit(`resend-tracking:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Trop de demandes. Réessayez dans ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const parsed = ResendTrackingSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }
  const { email } = parsed.data;

  // Réponse toujours générique — on ne dit pas si l'email existe.
  const genericResponse = NextResponse.json({
    success: true,
    message: 'Si un projet correspond à cet email, vous allez recevoir les liens de suivi.',
  });

  try {
    const client = db.prepare('SELECT id, name FROM clients WHERE email = ?').get(email) as
      | { id: number; name: string }
      | undefined;
    if (!client) return genericResponse;

    const projects = db.prepare(
      'SELECT id, title, tracking_token, status FROM projects WHERE client_id = ? AND tracking_token IS NOT NULL ORDER BY created_at DESC'
    ).all(client.id) as { id: number; title: string; tracking_token: string; status: string }[];

    if (projects.length === 0) return genericResponse;

    if (process.env.RESEND_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const projectsList = projects
        .map(p => `
          <li style="margin-bottom: 10px;">
            <strong>${p.title}</strong> (${p.status === 'completed' ? 'Terminé' : p.status === 'in_progress' ? 'En cours' : 'En préparation'})<br />
            <a href="${baseUrl}/suivi?token=${p.tracking_token}">${baseUrl}/suivi?token=${p.tracking_token}</a>
          </li>
        `)
        .join('');

      try {
        await resend.emails.send({
          from: FROM,
          to: email,
          subject: 'Vos liens de suivi — La Symphonie Électrique',
          html: `
            <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #fac015; border-radius: 10px;">
              <h2 style="color: #fac015;">Bonjour ${client.name},</h2>
              <p>Voici vos lien${projects.length > 1 ? 's' : ''} de suivi de chantier${projects.length > 1 ? 's' : ''} :</p>
              <ul style="padding-left: 20px;">
                ${projectsList}
              </ul>
              <p style="font-size: 0.85rem; color: #666; margin-top: 20px;">
                Conservez ces liens — ils donnent accès à l'état de votre chantier et au règlement en ligne.
              </p>
            </div>
          `,
        });
      } catch (e: any) {
        console.error('Resend error (tracking resend):', e.message);
      }
    }
  } catch (e) {
    console.error('resend-link error:', e);
  }

  return genericResponse;
}
