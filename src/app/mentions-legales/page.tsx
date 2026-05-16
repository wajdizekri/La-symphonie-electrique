import { company } from '@/lib/company';

export const metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales du site La Symphonie Électrique — éditeur, hébergeur, propriété intellectuelle.',
};

export default function MentionsLegales() {
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="text-gold">Mentions Légales</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN).
        </p>

        <section style={{ marginTop: '40px' }}>
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>{company.name}</strong> est édité par :<br />
            {company.owner ? <>{company.owner} — </> : null}{company.legalForm}<br />
            Siège social : {company.address}<br />
            {company.siret ? <>SIRET : {company.siret}<br /></> : null}
            {company.ape ? <>Code APE : {company.ape}<br /></> : null}
            {company.tva ? <>N° TVA intracommunautaire : {company.tva}<br /></> : null}
            Email : {company.email}<br />
            {company.phone ? <>Téléphone : {company.phone}</> : null}
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>2. Directeur de la publication</h2>
          <p>{company.owner || 'Le représentant légal de ' + company.name}.</p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>3. Hébergeur</h2>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
            <a href="https://vercel.com" className="text-gold">vercel.com</a>
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus de ce site (textes, images, logo, structure) relève de la
            législation française et internationale sur le droit d&apos;auteur et la propriété
            intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans
            autorisation est interdite.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>5. Activité &amp; assurances</h2>
          <p>
            Artisan électricien. Travaux réalisés conformément à la norme NF C 15-100.<br />
            Responsabilité Civile Professionnelle : {company.insuranceRcPro}.<br />
            Garantie Décennale : {company.insuranceDecennale}.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>6. Médiation de la consommation</h2>
          <p>
            Conformément à l&apos;article L.612-1 du Code de la consommation, en cas de litige non
            résolu, le client peut recourir gratuitement à un médiateur de la consommation. Les
            coordonnées du médiateur compétent sont communiquées sur simple demande à {company.email}.
          </p>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>7. Données personnelles</h2>
          <p>
            Le traitement de vos données est détaillé dans notre{' '}
            <a href="/confidentialite" className="text-gold">Politique de Confidentialité</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
