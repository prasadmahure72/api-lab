'use client'

import { useEffect } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
      }}
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: '#111816',
          border: '1px solid #1e2e28',
          borderRadius: '1rem',
          padding: '1.75rem',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{
          color: '#fff',
          fontSize: '1.0625rem',
          fontWeight: '700',
          margin: '0 0 0.5rem',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h3>
        <p style={{
          color: '#6b8c7a',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          margin: '0 0 1.5rem',
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #1e2e28',
              borderRadius: '0.5rem',
              color: '#a0bfb0',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: danger ? 'rgba(248,113,113,0.1)' : '#00d492',
              border: `1px solid ${danger ? 'rgba(248,113,113,0.4)' : 'transparent'}`,
              borderRadius: '0.5rem',
              color: danger ? '#f87171' : '#0a0f0d',
              fontSize: '0.875rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              transition: 'filter 0.15s',
            }}
          >
            {loading && <LoadingSpinner size={13} />}
            {loading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
