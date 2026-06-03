import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 · Endpoint Not Found — APILab',
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 3.5rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      textAlign: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: '#00d492',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          HTTP 404
        </div>

        <pre style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(3rem, 10vw, 6rem)',
          fontWeight: '700',
          color: '#fff',
          margin: '0 0 0.5rem',
          lineHeight: 1,
          letterSpacing: '-0.05em',
        }}>
          404
        </pre>

        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)',
          fontWeight: '500',
          color: '#6b8c7a',
          margin: '0 0 0.5rem',
          letterSpacing: '0.01em',
        }}>
          Endpoint Not Found
        </h1>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          color: '#3d5a4e',
          margin: '0 0 2rem',
        }}>
          No mock matched this route.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.5625rem 1.125rem',
              background: '#00d492',
              borderRadius: '0.5rem',
              color: '#0a0f0d',
              fontWeight: '700',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.5625rem 1.125rem',
              background: 'transparent',
              border: '1px solid #1e2e28',
              borderRadius: '0.5rem',
              color: '#a0bfb0',
              fontWeight: '500',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
