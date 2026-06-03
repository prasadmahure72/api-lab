import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeleteButton from './DeleteButton'

const METHOD_STYLE: Record<string, { bg: string; color: string }> = {
  GET:    { bg: 'rgba(96,165,250,0.12)',   color: '#60a5fa' },
  POST:   { bg: 'rgba(0,212,146,0.12)',    color: '#00d492' },
  PUT:    { bg: 'rgba(245,158,11,0.12)',   color: '#f59e0b' },
  DELETE: { bg: 'rgba(248,113,113,0.12)', color: '#f87171' },
  PATCH:  { bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
}

function statusColor(code: number) {
  if (code < 300) return '#00d492'
  if (code < 400) return '#60a5fa'
  if (code < 500) return '#f59e0b'
  return '#f87171'
}

function statusText(code: number) {
  const map: Record<number, string> = {
    200: 'OK', 201: 'Created', 204: 'No Content',
    301: 'Moved', 302: 'Found', 304: 'Not Modified',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
    404: 'Not Found', 409: 'Conflict', 422: 'Unprocessable',
    500: 'Server Error', 502: 'Bad Gateway', 503: 'Unavailable',
  }
  return map[code] ?? ''
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    },
  })

  const apis = await prisma.mockAPI.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  const methodCounts = apis.reduce<Record<string, number>>((acc, a) => {
    acc[a.method] = (acc[a.method] ?? 0) + 1
    return acc
  }, {})

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
            My APIs
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b8c7a', margin: '0.25rem 0 0' }}>
            {apis.length} mock {apis.length === 1 ? 'endpoint' : 'endpoints'} configured
          </p>
        </div>
        <Link
          href="/dashboard/new"
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
            letterSpacing: '-0.01em',
            transition: 'filter 0.15s',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Create New API
        </Link>
      </div>

      {/* Stats bar */}
      {apis.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1rem',
          background: '#111816',
          border: '1px solid #1e2e28',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#6b8c7a', fontFamily: 'var(--font-mono)' }}>
            Total: <span style={{ color: '#fff', fontWeight: '600' }}>{apis.length}</span>
          </span>
          <div style={{ width: '1px', height: '14px', background: '#1e2e28' }} />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.entries(methodCounts).map(([method, count]) => {
              const s = METHOD_STYLE[method] ?? { bg: 'rgba(255,255,255,0.08)', color: '#fff' }
              return (
                <span
                  key={method}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.6rem',
                    background: s.bg,
                    color: s.color,
                    borderRadius: '99px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {method} <span style={{ opacity: 0.7, fontWeight: '400' }}>×{count}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {apis.length === 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5rem 2rem',
          border: '1px dashed #1e2e28',
          borderRadius: '1rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#111816',
            border: '1px solid #1e2e28',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3d5a4e" strokeWidth="1.5">
              <path d="M8 9l3 3-3 3M13 15h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
            </svg>
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            No APIs yet
          </h2>
          <p style={{ color: '#6b8c7a', fontSize: '0.9rem', margin: '0 0 1.75rem', lineHeight: 1.6, maxWidth: '320px' }}>
            Create your first mock API and get a live URL instantly.
          </p>
          <Link
            href="/dashboard/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.625rem 1.25rem',
              background: '#00d492',
              borderRadius: '0.5rem',
              color: '#0a0f0d',
              fontWeight: '700',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Create API
          </Link>
        </div>
      )}

      {/* API Grid */}
      {apis.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}>
          {apis.map(api => {
            const ms = METHOD_STYLE[api.method] ?? { bg: 'rgba(255,255,255,0.08)', color: '#fff' }
            const sc = statusColor(api.status)
            const st = statusText(api.status)
            return (
              <div
                key={api.id}
                className="api-card"
                style={{
                  background: '#111816',
                  border: '1px solid #1e2e28',
                  borderRadius: '0.875rem',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Top row: method + name */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '0.625rem' }}>
                  <span style={{
                    flexShrink: 0,
                    padding: '0.2rem 0.55rem',
                    background: ms.bg,
                    color: ms.color,
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                    marginTop: '2px',
                  }}>
                    {api.method}
                  </span>
                  <span style={{
                    color: '#e8f0ec',
                    fontWeight: '600',
                    fontSize: '0.9375rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {api.name}
                  </span>
                </div>

                {/* Endpoint */}
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: '#00d492',
                  marginBottom: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {api.endpoint}
                </div>

                {/* Status + date row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.55rem',
                    background: `${sc}18`,
                    color: sc,
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {api.status}{st ? ` ${st}` : ''}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#3d5a4e', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(api.createdAt)}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#1e2e28', marginBottom: '1rem' }} />

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link
                    href={`/dashboard/${api.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.4375rem 0.875rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid #1e2e28',
                      borderRadius: '0.375rem',
                      color: '#e8f0ec',
                      fontSize: '0.8125rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    View Details
                  </Link>
                  <DeleteButton id={api.id} name={api.name} />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .api-card:hover { border-color: #00d492 !important; }
      `}</style>
    </div>
  )
}
