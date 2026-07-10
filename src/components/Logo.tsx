import Image from 'next/image';

export default function Logo({ size = 32, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '2px solid var(--accent-gold)',
        boxShadow: '0 0 12px rgba(250, 204, 21, 0.25)',
        flexShrink: 0,
      }}
    >
      <Image
        src="/logo.png"
        alt="La Symphonie Électrique"
        width={size}
        height={size}
        priority={priority}
        style={{ objectFit: 'contain', width: '90%', height: '90%' }}
      />
    </span>
  );
}
