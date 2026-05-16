import { ImageResponse } from 'next/og';

export const alt = 'La Symphonie Électrique — Expert Électricien, Fibre & Mobilité Électrique';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#020617',
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(250, 204, 21, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: '#fac015',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}
          >
            ⚡
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '22px', color: '#94a3b8', letterSpacing: '4px', textTransform: 'uppercase' }}>
              LA SYMPHONIE
            </span>
            <span style={{ fontSize: '28px', color: '#fac015', fontWeight: 800, letterSpacing: '2px' }}>
              ÉLECTRIQUE
            </span>
          </div>
        </div>

        <h1
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.1,
            maxWidth: '900px',
          }}
        >
          Solutions électriques durables
        </h1>
        <p
          style={{
            fontSize: '28px',
            color: '#fac015',
            margin: '20px 0 0',
            fontWeight: 600,
          }}
        >
          Électricité · Fibre · IRVE · VMC
        </p>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '40px',
            fontSize: '20px',
            color: '#cbd5e1',
            fontWeight: 600,
          }}
        >
          <span>NF C 15-100</span>
          <span>•</span>
          <span>Certifié IRVE</span>
          <span>•</span>
          <span>Décennale</span>
          <span>•</span>
          <span>24/7</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
