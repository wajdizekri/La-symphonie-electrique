import db from '@/lib/db';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';
import { company } from '@/lib/company';

type Row = {
  payment_id: number;
  amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_created_at: string;
  project_title: string;
  project_description: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
};

function formatInvoiceNumber(id: number, createdAt: string) {
  const year = new Date(createdAt).getFullYear();
  return `FAC-${year}-${String(id).padStart(5, '0')}`;
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = Number(id);
  if (!Number.isFinite(paymentId)) notFound();

  const row = db.prepare(`
    SELECT
      payments.id AS payment_id,
      payments.amount,
      payments.status AS payment_status,
      payments.created_at AS payment_created_at,
      projects.title AS project_title,
      projects.description AS project_description,
      clients.name AS client_name,
      clients.email AS client_email,
      clients.phone AS client_phone,
      clients.address AS client_address
    FROM payments
    JOIN projects ON payments.project_id = projects.id
    JOIN clients ON projects.client_id = clients.id
    WHERE payments.id = ?
  `).get(paymentId) as Row | undefined;

  if (!row) notFound();

  const invoiceNumber = formatInvoiceNumber(row.payment_id, row.payment_created_at);
  const dateStr = new Date(row.payment_created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const ht = +(row.amount / 1.2).toFixed(2);
  const tva = +(row.amount - ht).toFixed(2);
  const isPaid = row.payment_status === 'paid';

  return (
    <>
      <style>{`
        @page { size: A4; margin: 15mm; }
        @media print {
          body { background: white !important; color: black !important; }
          aside, .no-print { display: none !important; }
          main { padding: 0 !important; }
          .invoice-paper { box-shadow: none !important; padding: 0 !important; }
        }
        .invoice-root {
          background: white;
          color: #1a1a1a;
          min-height: 100vh;
          padding: 40px 20px;
        }
        .invoice-paper {
          background: white;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
        }
        .invoice-paper h1 { color: #1a1a1a; margin: 0; }
        .invoice-paper p { color: #1a1a1a; margin: 0; }
        .invoice-paper table { width: 100%; border-collapse: collapse; }
        .invoice-paper th, .invoice-paper td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e5e5; }
        .invoice-paper th { background: #f9fafb; font-size: 0.75rem; text-transform: uppercase; color: #666; }
      `}</style>

      <div className="invoice-root">
        <div className="no-print" style={{ maxWidth: '800px', margin: '0 auto 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <a href={`/admin/payments`} style={{ color: '#666', fontSize: '0.85rem', alignSelf: 'center' }}>← Retour</a>
          <PrintButton />
        </div>

        <div className="invoice-paper">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', paddingBottom: '20px', borderBottom: '2px solid #fac015' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="/logo.png" alt="" width={48} height={48} style={{ objectFit: 'contain' }} />
              <div>
                <h1 style={{ fontSize: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                  La Symphonie Électrique
                </h1>
                <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#666' }}>
                  Expert Électricité · Fibre · IRVE · VMC · Portail
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fac015' }}>FACTURE</h2>
              <p style={{ fontSize: '0.9rem', fontFamily: 'monospace', marginTop: '4px' }}>{invoiceNumber}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>{dateStr}</p>
              {isPaid && (
                <div style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 12px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                }}>
                  ACQUITTÉE
                </div>
              )}
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px' }}>Émetteur</p>
              <p style={{ fontWeight: 700, marginBottom: '4px' }}>{company.name}</p>
              <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.5' }}>
                {company.address}<br />
                {company.siret && <>SIRET&nbsp;: {company.siret}<br /></>}
                {company.ape && <>Code APE&nbsp;: {company.ape}<br /></>}
                {company.tva && <>TVA&nbsp;: {company.tva}<br /></>}
                {company.phone && <>Tél&nbsp;: {company.phone}<br /></>}
                {company.email}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#666', letterSpacing: '1px', marginBottom: '8px' }}>Facturé à</p>
              <p style={{ fontWeight: 700, marginBottom: '4px' }}>{row.client_name}</p>
              <p style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.5' }}>
                {row.client_address && <>{row.client_address}<br /></>}
                {row.client_email && <>{row.client_email}<br /></>}
                {row.client_phone && <>{row.client_phone}</>}
              </p>
            </div>
          </div>

          {/* Line items */}
          <table style={{ marginBottom: '30px' }}>
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Désignation</th>
                <th style={{ textAlign: 'center' }}>Qté</th>
                <th style={{ textAlign: 'right' }}>Prix HT</th>
                <th style={{ textAlign: 'right' }}>Total HT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{row.project_title}</strong>
                  {row.project_description && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>{row.project_description}</div>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>1</td>
                <td style={{ textAlign: 'right' }}>{ht.toFixed(2)} €</td>
                <td style={{ textAlign: 'right' }}>{ht.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <table style={{ width: '300px' }}>
              <tbody>
                <tr>
                  <td style={{ fontSize: '0.85rem' }}>Total HT</td>
                  <td style={{ textAlign: 'right' }}>{ht.toFixed(2)} €</td>
                </tr>
                <tr>
                  <td style={{ fontSize: '0.85rem' }}>TVA (20%)</td>
                  <td style={{ textAlign: 'right' }}>{tva.toFixed(2)} €</td>
                </tr>
                <tr style={{ background: '#fffbeb' }}>
                  <td style={{ fontWeight: 700, fontSize: '1rem' }}>TOTAL TTC</td>
                  <td style={{ fontWeight: 700, fontSize: '1.25rem', textAlign: 'right', color: '#fac015' }}>{row.amount.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment status / instructions */}
          {isPaid ? (
            <div style={{ padding: '15px', background: '#dcfce7', borderRadius: '8px', marginBottom: '30px', fontSize: '0.875rem' }}>
              ✅ Cette facture a été <strong>réglée intégralement</strong> par carte bancaire via Stripe.
            </div>
          ) : (
            <div style={{ padding: '15px', background: '#fef3c7', borderRadius: '8px', marginBottom: '30px', fontSize: '0.875rem' }}>
              💳 Règlement par carte bancaire sécurisée via Stripe (lien envoyé par email).
              <br />Conditions de règlement&nbsp;: à réception de facture, sans escompte.
            </div>
          )}

          {/* Legal footer */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid #e5e5e5', fontSize: '0.7rem', color: '#666', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '6px' }}>
              <strong>Assurance décennale&nbsp;:</strong> {company.insuranceDecennale} — Garantie travaux 10 ans
            </p>
            <p style={{ marginBottom: '6px' }}>
              <strong>Pénalités de retard&nbsp;:</strong> En cas de retard de paiement, application d&apos;une pénalité égale à 3 fois le taux d&apos;intérêt légal et indemnité forfaitaire pour frais de recouvrement de 40&nbsp;€ (art. L.441-10 et D.441-5 du Code de commerce).
            </p>
            <p>
              TVA acquittée sur les débits — Médiation de la consommation&nbsp;: CMAP, www.cmap.fr
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
