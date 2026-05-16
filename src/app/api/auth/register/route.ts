import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { RegisterSchema, formatZodError } from '@/lib/validators';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Vérifier si l'utilisateur existe déjà
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    db.prepare('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)')
      .run(name, email, hashedPassword, 'admin', 'pending');

    const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (process.env.RESEND_API_KEY && notifyTo) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Symphonie Électrique <onboarding@resend.dev>',
          to: notifyTo,
          subject: 'Nouvel admin à valider',
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #fac015;">Nouvelle inscription administrateur</h2>
              <p>Un nouvel utilisateur s'est inscrit sur la plateforme :</p>
              <ul>
                <li><strong>Nom :</strong> ${name}</li>
                <li><strong>Email :</strong> ${email}</li>
              </ul>
              <p>Ce compte est actuellement bloqué (statut: pending).</p>
              <p>Connectez-vous au dashboard pour approuver cet utilisateur.</p>
            </div>
          `,
        });
      } catch (emailError: any) {
        console.error('Resend error:', emailError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription.' }, { status: 500 });
  }
}
