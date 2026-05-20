import db from '@/lib/db';
import { comparePasswords, createToken } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { LoginSchema, formatZodError } from '@/lib/validators';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`login:${clientIp(request)}`, 5, 15 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Trop de tentatives. Réessayez dans ${limit.retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const parsed = LoginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (!user || !(await comparePasswords(password, user.password))) {
      return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 });
    }

    if (user.status === 'unverified' || !user.email_verified_at) {
      return NextResponse.json({
        error: 'Votre email n\'est pas encore confirmé. Vérifiez votre boîte de réception (et vos spams).',
      }, { status: 403 });
    }

    if (user.status !== 'approved') {
      return NextResponse.json({
        error: 'Votre compte est en attente de validation par l\'administrateur.',
      }, { status: 403 });
    }

    const token = await createToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24h
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erreur lors de la connexion.' }, { status: 500 });
  }
}
