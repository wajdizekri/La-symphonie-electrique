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
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#0a1428',
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
        style={{ objectFit: 'contain', width: '85%', height: '85%' }}
      />
    </span>
  );
}
