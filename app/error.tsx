'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

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
          color: '#f87171',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          HTTP 500
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
          500
        </pre>

        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)',
          fontWeight: '500',
          color: '#6b8c7a',
          margin: '0 0 0.5rem',
        }}>
          Something went wrong
        </h1>

        {error.digest && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: '#3d5a4e',
            margin: '0 0 1.5rem',
          }}>
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          style={{
            padding: '0.5625rem 1.25rem',
            background: '#00d492',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#0a0f0d',
            fontWeight: '700',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'filter 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
          onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
