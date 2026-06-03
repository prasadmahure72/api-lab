const METHOD_COLORS: Record<string, { bg: string; color: string }> = {
  GET:    { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' },
  POST:   { bg: 'rgba(0,212,146,0.12)',    color: '#00d492' },
  PUT:    { bg: 'rgba(245,158,11,0.12)',   color: '#f59e0b' },
  DELETE: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  PATCH:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
}

interface MethodBadgeProps {
  method: string
  size?: 'sm' | 'md'
}

export default function MethodBadge({ method, size = 'sm' }: MethodBadgeProps) {
  const s = METHOD_COLORS[method] ?? { bg: 'rgba(255,255,255,0.08)', color: '#e8f0ec' }
  const padding = size === 'md' ? '0.25rem 0.625rem' : '0.2rem 0.55rem'
  const fontSize = size === 'md' ? '0.75rem' : '0.65rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        background: s.bg,
        color: s.color,
        borderRadius: '4px',
        fontSize,
        fontWeight: '700',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}
    >
      {method}
    </span>
  )
}
