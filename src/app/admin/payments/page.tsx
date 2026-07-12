import db from '@/lib/db';
import Link from 'next/link';
import { CreditCard, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import RowDeletePayment from './RowDeletePayment';

export default function AdminPayments() {
  const payments = db.prepare(`
    SELECT payments.*, projects.title as project_title, clients.name as client_name 
    FROM payments 
    JOIN projects ON payments.project_id = projects.id 
    JOIN clients ON projects.client_id = clients.id 
    ORDER BY created_at DESC
  `).all() as any[];

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <header style={{ marginBottom: 'var(--spacing-xxl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Suivi des Paiements</h1>
          <p>Gérez vos factures et suivez vos encaissements Stripe.</p>
        </div>
        <div className="card" style={{ padding: '10px 20px', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--success)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>REVENU TOTAL</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{totalRevenue.toLocaleString('fr-FR')}€</div>
        </div>
      </header>

      <div className="grid" style={{ gap: 'var(--spacing-md)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '10px 20px' }}>PROJET / CLIENT</th>
              <th style={{ padding: '10px 20px' }}>MONTANT</th>
              <th style={{ padding: '10px 20px' }}>DATE</th>
              <th style={{ padding: '10px 20px' }}>STATUT</th>
              <th style={{ padding: '10px 20px' }}>MÉTHODE</th>
              <th style={{ padding: '10px 20px' }}>FACTURE</th>
              <th style={{ padding: '10px 20px' }}></th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? payments.map((payment) => (
              <tr key={payment.id} className="card" style={{ display: 'table-row', border: 'none' }}>
                <td style={{ padding: '20px', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>
                  <div style={{ fontWeight: 600 }}>{payment.project_title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.client_name}</div>
                </td>
                <td style={{ padding: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {payment.amount.toLocaleString('fr-FR')}€
                </td>
                <td style={{ padding: '20px', fontSize: '0.875rem' }}>
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    backgroundColor: payment.status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                    color: payment.status === 'paid' ? 'var(--success)' : 'var(--accent-gold)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {payment.status === 'paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {payment.status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <CreditCard size={16} className="text-blue" /> Stripe
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <Link
                    href={`/admin/payments/${payment.id}/invoice`}
                    target="_blank"
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                  >
                    <FileText size={14} /> PDF
                  </Link>
                </td>
                <td style={{ padding: '20px', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                  <RowDeletePayment
                    id={payment.id}
                    amount={payment.amount}
                    status={payment.status}
                    projectTitle={payment.project_title}
                  />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="card text-center" style={{ padding: '60px' }}>
                  Aucune transaction enregistrée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
