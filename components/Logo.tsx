import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const sizes = {
  sm: { icon: 22, text: '1.1rem', gap: '0.45rem' },
  md: { icon: 28, text: '1.375rem', gap: '0.55rem' },
  lg: { icon: 36, text: '1.75rem', gap: '0.65rem' },
}

export default function Logo({ size = 'md', href = '/' }: LogoProps) {
  const s = sizes[size]

  const inner = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {/* Icon mark */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: s.icon,
          height: s.icon,
          background: '#00d492',
          borderRadius: '6px',
          flexShrink: 0,
        }}
      >
        <svg
          width={s.icon * 0.58}
          height={s.icon * 0.58}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          {/* Two horizontal "endpoint" bars with a small arrow — communicates API/routes */}
          <rect x="1" y="3" width="7" height="2" rx="1" fill="#0a0f0d" />
          <rect x="1" y="7" width="10" height="2" rx="1" fill="#0a0f0d" />
          <rect x="1" y="11" width="5" height="2" rx="1" fill="#0a0f0d" />
          <path d="M11 10.5L14 8l-3-2.5" stroke="#0a0f0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: s.text,
          fontWeight: '700',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: '#ffffff' }}>API</span>
        <span style={{ color: '#00d492' }}>Lab</span>
      </span>
    </span>
  )

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {inner}
    </Link>
  ) : (
    inner
  )
}
