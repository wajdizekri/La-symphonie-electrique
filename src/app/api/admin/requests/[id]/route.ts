import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { Resend } from 'resend';
import { RequestStatusSchema, formatZodError } from '@/lib/validators';
import { sendSms } from '@/lib/sms';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = RequestStatusSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { status } = parsed.data;

    const rawRequest = db.prepare('SELECT * FROM requests WHERE id = ?').get(id) as any;
    if (!rawRequest) {
      return NextResponse.json({ error: `Demande ${id} introuvable.` }, { status: 404 });
    }

    const rawClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(rawRequest.client_id) as any;
    if (!rawClient) {
      return NextResponse.json({ error: `Client ${rawRequest.client_id} introuvable.` }, { status: 404 });
    }

    db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, id);

    let projectId: number | null = null;
    let trackingToken: string | null = null;
    if (status === 'approved') {
      trackingToken = randomUUID();
      const result = db.prepare(
        'INSERT INTO projects (client_id, title, description, status, tracking_token) VALUES (?, ?, ?, ?, ?)'
      ).run(rawRequest.client_id, `Projet : ${rawRequest.service_type}`, rawRequest.description, 'planning', trackingToken);
      projectId = result.lastInsertRowid as number;
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const isApproved = status === 'approved';
        const subject = isApproved
          ? 'Bonne nouvelle : votre demande de devis a été acceptée'
          : 'Information concernant votre demande de devis';

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const trackingLink = trackingToken ? `${baseUrl}/suivi?token=${trackingToken}` : null;

        const html = isApproved ? `
          <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #fac015; border-radius: 10px;">
            <h2 style="color: #fac015;">Bonjour ${rawClient.name},</h2>
            <p>Votre demande pour le service <strong>${rawRequest.service_type}</strong> a été acceptée par notre équipe technique.</p>
            ${trackingToken ? `
              <div style="margin: 20px 0; padding: 15px; background: #fff8e1; border-radius: 6px;">
                <p style="margin: 0 0 6px 0;"><strong>Votre code de suivi :</strong></p>
                <p style="margin: 0; font-family: monospace; font-size: 16px; letter-spacing: 1px; color: #b58500;">${trackingToken}</p>
              </div>
              <p>Suivez l'avancement directement : <a href="${trackingLink}">${trackingLink}</a></p>
            ` : ''}
            <p>Un de nos experts vous recontactera sous 24h pour affiner les détails et fixer un rendez-vous.</p>
            <br />
            <p>Merci de votre confiance,</p>
            <p>L'équipe <strong>La Symphonie Électrique</strong></p>
          </div>
        ` : `
          <div style="font-family: sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #666;">Bonjour ${rawClient.name},</h2>
            <p>Nous avons bien reçu votre demande concernant : <strong>${rawRequest.service_type}</strong>.</p>
            <p>Après étude, nous ne pourrons pas donner suite à votre demande pour le moment.</p>
            <p>Nous vous remercions de l'intérêt porté à nos services.</p>
            <br />
            <p>Cordialement,</p>
            <p>L'équipe <strong>La Symphonie Électrique</strong></p>
          </div>
        `;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'La Symphonie Électrique <onboarding@resend.dev>',
          to: rawClient.email,
          subject,
          html,
        });
      } catch (emailError) {
        console.error('Email sending failed but DB was updated:', emailError);
      }
    }

    // SMS au client (acceptation uniquement, si on a son téléphone)
    if (status === 'approved' && rawClient.phone && trackingToken) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const trackingLink = `${baseUrl}/suivi?token=${trackingToken}`;
      const smsBody =
        `La Symphonie Electrique: votre devis (${rawRequest.service_type}) a ete accepte. ` +
        `Code de suivi: ${trackingToken}. ` +
        `Suivi en ligne: ${trackingLink}`;
      const smsResult = await sendSms(rawClient.phone, smsBody);
      if (!smsResult.ok) {
        console.error('SMS failed:', smsResult.error);
      }
    }

    return NextResponse.json({ success: true, projectId, trackingToken });
  } catch (error: any) {
    console.error('Error updating request status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
