import { NextResponse } from 'next/server';
import db from '@/lib/db';

/** Compteurs d'éléments à traiter pour les badges de la sidebar admin. */
export async function GET() {
  try {
    const pendingRequests = (db.prepare("SELECT COUNT(*) c FROM requests WHERE status='pending'").get() as { c: number }).c;
    const pendingReviews = (db.prepare("SELECT COUNT(*) c FROM reviews WHERE status='pending'").get() as { c: number }).c;
    const pendingUsers = (db.prepare("SELECT COUNT(*) c FROM users WHERE status='pending'").get() as { c: number }).c;
    const pendingPayments = (db.prepare("SELECT COUNT(*) c FROM payments WHERE status='pending'").get() as { c: number }).c;
    return NextResponse.json({
      requests: pendingRequests,
      reviews: pendingReviews,
      users: pendingUsers,
      payments: pendingPayments,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
