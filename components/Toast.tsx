'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastType = 'success' | 'error'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <ToastBubble
            key={t.id}
            item={t}
            onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
          />
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

function ToastBubble({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const isSuccess = item.type === 'success'
  const accent = isSuccess ? '#00d492' : '#f87171'

  return (
    <div
      role="alert"
      onClick={onDismiss}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.75rem 1rem',
        background: '#111816',
        border: `1px solid ${accent}`,
        borderRadius: '0.625rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        minWidth: '260px',
        maxWidth: '400px',
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: 'toast-in 0.18s ease-out',
      }}
    >
      <span style={{ color: accent, fontSize: '0.875rem', fontWeight: '700', flexShrink: 0 }}>
        {isSuccess ? '✓' : '✕'}
      </span>
      <span style={{ color: '#e8f0ec', fontSize: '0.875rem', lineHeight: 1.4 }}>
        {item.message}
      </span>
    </div>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
