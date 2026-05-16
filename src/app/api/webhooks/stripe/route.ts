import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET non configuré.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Signature Stripe manquante.' }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error('Stripe signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;

    if (paymentId) {
      try {
        const result = db.prepare(
          "UPDATE payments SET status = 'paid', stripe_session_id = ? WHERE id = ? AND status != 'paid'"
        ).run(session.id, paymentId);

        // Si le paiement vient d'être marqué payé (et pas déjà 'paid' avant), on avance le projet.
        if (result.changes > 0) {
          const payment = db.prepare(
            'SELECT project_id FROM payments WHERE id = ?'
          ).get(paymentId) as { project_id: number | null } | undefined;

          if (payment?.project_id) {
            const remaining = db.prepare(
              "SELECT COUNT(*) AS c FROM payments WHERE project_id = ? AND status = 'pending'"
            ).get(payment.project_id) as { c: number };

            const project = db.prepare(
              'SELECT status FROM projects WHERE id = ?'
            ).get(payment.project_id) as { status: string } | undefined;

            if (project) {
              if (remaining.c === 0 && project.status !== 'completed') {
                // Toutes les factures sont réglées → projet terminé.
                db.prepare(
                  "UPDATE projects SET status = 'completed', end_date = date('now') WHERE id = ?"
                ).run(payment.project_id);
              } else if (project.status === 'planning') {
                // Acompte reçu mais d'autres factures pending → on passe en cours.
                db.prepare(
                  "UPDATE projects SET status = 'in_progress', start_date = COALESCE(start_date, date('now')) WHERE id = ?"
                ).run(payment.project_id);
              }
            }

            revalidatePath('/admin/projects');
            revalidatePath(`/admin/projects/${payment.project_id}`);
            revalidatePath('/admin/dashboard');
            revalidatePath('/admin/payments');
          }
        }
      } catch (err) {
        console.error('Failed to mark payment as paid:', err);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
