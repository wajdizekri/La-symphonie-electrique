import { company } from '@/lib/company';

export const metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et traitement des données personnelles (RGPD) de La Symphonie Électrique.',
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-gold">Politique de Confidentialité</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Conforme au Règlement Général sur la Protection des Données (RGPD - UE 2016/679).
        </p>

        <section style={{ marginTop: '40px' }}>
          <h2>1. Responsable du traitement</h2>
          <p>
            {company.name}{company.owner ? ` (${company.owner})` : ''} — {company.address}.<br />
            Contact : {company.email}{company.phone ? ` — ${company.phone}` : ''}.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les données que vous nous transmettez :</p>
          <ul>
            <li><strong>Formulaire de devis</strong> : nom, email, téléphone, type de service, description du projet, photos éventuelles.</li>
            <li><strong>Dépôt d&apos;avis</strong> : nom (ou initiales), note, commentaire.</li>
            <li><strong>Paiement en ligne</strong> : traité directement par Stripe — nous ne stockons aucune donnée bancaire.</li>
          </ul>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>3. Finalités &amp; base légale</h2>
          <ul>
            <li>Établir un devis et répondre à votre demande (mesures précontractuelles).</li>
            <li>Suivre et facturer le chantier (exécution du contrat).</li>
            <li>Publier votre avis après modération (votre consentement).</li>
            <li>Obligations comptables et légales (intérêt légitime / obligation légale).</li>
          </ul>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>4. Destinataires &amp; sous-traitants</h2>
          <p>Vos données ne sont jamais vendues. Elles peuvent être traitées par nos sous-traitants techniques :</p>
          <ul>
            <li><strong>Vercel</strong> (hébergement)</li>
            <li><strong>Resend</strong> (envoi d&apos;emails transactionnels)</li>
            <li><strong>Twilio</strong> (envoi de SMS de notification)</li>
            <li><strong>Stripe</strong> (traitement sécurisé des paiements)</li>
          </ul>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>5. Durée de conservation</h2>
          <p>
            Données prospects : 3 ans après le dernier contact. Données clients (devis, factures) :
            10 ans au titre des obligations comptables et de la garantie décennale. Avis publiés :
            jusqu&apos;à demande de retrait.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>6. Vos droits</h2>
          <p>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
            limitation, d&apos;opposition et de portabilité. Pour l&apos;exercer, écrivez à{' '}
            <strong>{company.email}</strong>. Vous pouvez également introduire une réclamation
            auprès de la CNIL (<a href="https://www.cnil.fr" className="text-gold">cnil.fr</a>).
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>7. Cookies</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de suivi publicitaire. Seul un indicateur de
            consentement est stocké localement dans votre navigateur (localStorage) pour mémoriser
            votre choix sur le bandeau cookies. Aucune donnée n&apos;est transmise à des tiers à des
            fins marketing.
          </p>
        </section>
      </div>
    </main>
  );
}
