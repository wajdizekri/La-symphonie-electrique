import { MapPin } from 'lucide-react';

const zones: { code: string; name: string; villes: string[] }[] = [
  {
    code: '74',
    name: 'Pays du Mont-Blanc',
    villes: ['Chamonix-Mont-Blanc', 'Megève', 'Combloux', 'Passy', 'Domancy'],
  },
  {
    code: '74',
    name: 'Cluses Arve & Montagnes',
    villes: ['Cluses', 'Marnaz', 'Thyez', 'Scionzier', 'Bonneville'],
  },
  {
    code: '74',
    name: 'Genevois français',
    villes: ['Annemasse', 'Bonne', 'Ville-la-Grand', 'Ambilly', 'Gaillard'],
  },
  {
    code: '74',
    name: 'Et alentours',
    villes: ['Sallanches', 'Magland', 'Saint-Gervais', 'La Roche-sur-Foron', 'Sur étude…'],
  },
];

export default function AreasServed() {
  return (
    <section
      className="section"
      id="zone-intervention"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="container">
        <div className="text-center" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Zone <span className="text-gold">d&apos;intervention</span></h2>
          <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--accent-gold)', margin: '20px auto' }} />
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Nous intervenons dans toute la <strong className="text-gold">vallée de l&apos;Arve</strong> et en Haute-Savoie, pour vos chantiers résidentiels et tertiaires.
          </p>
        </div>

        <div className="grid grid-4" style={{ gap: '24px' }}>
          {zones.map((z, i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <MapPin size={20} className="text-gold" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                    Haute-Savoie · {z.code}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{z.name}</h3>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {z.villes.map((v) => (
                  <li key={v} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Votre commune n&apos;est pas listée ? <a href="/contact" className="text-gold">Contactez-nous</a>, nous étudions chaque demande dans la région.
        </p>
      </div>
    </section>
  );
}
