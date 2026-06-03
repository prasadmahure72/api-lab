'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Copy, Check, Loader2, Send, Trash2,
  CheckCircle2, AlertCircle,
} from 'lucide-react'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const METHOD_COLOR: Record<string, string> = {
  GET: '#60a5fa', POST: '#00d492', PUT: '#f59e0b', DELETE: '#f87171', PATCH: '#a78bfa',
}
const METHOD_BG: Record<string, string> = {
  GET: 'rgba(96,165,250,0.12)', POST: 'rgba(0,212,146,0.12)',
  PUT: 'rgba(245,158,11,0.12)', DELETE: 'rgba(248,113,113,0.12)',
  PATCH: 'rgba(167,139,250,0.12)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.5625rem 0.75rem',
  background: '#0a0f0d',
  border: '1px solid #1e2e28',
  borderRadius: '0.5rem',
  color: '#e8f0ec',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
const monoInput: CSSProperties = { ...inputStyle, fontFamily: 'var(--font-mono)' }
const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  color: '#6b8c7a',
  marginBottom: '0.3rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

type ApiData = {
  id: string
  name: string
  endpoint: string
  method: string
  response: unknown
  status: number
  delay: number | null
  createdAt: string
}

export default function ApiDetailClient({ api }: { api: ApiData }) {
  const router = useRouter()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const liveUrl = `${siteUrl}/api/mock${api.endpoint}`

  // Edit form state
  const [name, setName] = useState(api.name)
  const [endpoint, setEndpoint] = useState(api.endpoint)
  const [endpointError, setEndpointError] = useState('')
  const [method, setMethod] = useState(api.method)
  const [responseBody, setResponseBody] = useState(JSON.stringify(api.response, null, 2))
  const [jsonValid, setJsonValid] = useState<boolean | null>(null)
  const [jsonError, setJsonError] = useState('')
  const [statusCode, setStatusCode] = useState(api.status)
  const [delay, setDelay] = useState(api.delay ?? 0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Copy state
  const [copied, setCopied] = useState(false)

  // Test panel state
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    status: number
    time: number
    body: string
  } | null>(null)

  function validateEndpoint(val: string) {
    setEndpointError(val && !val.startsWith('/') ? 'Must start with /' : '')
  }

  function validateJson(val: string) {
    if (!val.trim()) { setJsonValid(null); setJsonError(''); return }
    try { JSON.parse(val); setJsonValid(true); setJsonError('') }
    catch (e: unknown) { setJsonValid(false); setJsonError(e instanceof Error ? e.message : 'Invalid JSON') }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (endpointError || jsonValid === false) return
    setSaving(true)
    setSaveError('')
    setSaved(false)

    let parsedResponse: unknown
    try { parsedResponse = JSON.parse(responseBody) }
    catch { setSaveError('Response body must be valid JSON'); setSaving(false); return }

    const res = await fetch(`/api/apis/${api.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, endpoint, method, response: parsedResponse, status: statusCode, delay }),
    })
    const data = await res.json()
    if (!res.ok) { setSaveError(data.error ?? 'Save failed'); setSaving(false); return }
    setSaved(true)
    setSaving(false)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/apis/${api.id}`, { method: 'DELETE' })
    router.push('/dashboard')
    router.refresh()
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(liveUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function sendTestRequest() {
    setTesting(true)
    setTestResult(null)
    const start = Date.now()
    try {
      const res = await fetch(liveUrl, { method })
      const elapsed = Date.now() - start
      let body = ''
      try { body = JSON.stringify(await res.json(), null, 2) } catch { body = await res.text() }
      setTestResult({ status: res.status, time: elapsed, body })
    } catch (err) {
      setTestResult({ status: 0, time: Date.now() - start, body: String(err) })
    }
    setTesting(false)
  }

  const jsonBorderColor = jsonValid === true ? '#00d492' : jsonValid === false ? '#f87171' : '#1e2e28'

  function statusColor(code: number) {
    if (code === 0) return '#f87171'
    if (code < 300) return '#00d492'
    if (code < 400) return '#60a5fa'
    if (code < 500) return '#f59e0b'
    return '#f87171'
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back */}
      <Link
        href="/dashboard"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#6b8c7a', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.75rem', transition: 'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#e8f0ec')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b8c7a')}
      >
        <ArrowLeft size={15} />
        Dashboard
      </Link>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <span style={{
          padding: '0.2rem 0.625rem',
          background: METHOD_BG[api.method] ?? 'rgba(255,255,255,0.08)',
          color: METHOD_COLOR[api.method] ?? '#fff',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '700',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}>
          {api.method}
        </span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
          {api.name}
        </h1>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT — Details + Edit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Live URL card */}
          <div style={{ background: '#0a0f0d', border: '1px solid #1e2e28', borderRadius: '0.75rem', padding: '1.125rem' }}>
            <p style={{ fontSize: '0.68rem', color: '#3d5a4e', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)', margin: '0 0 0.625rem' }}>
              Live Mock URL
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <code style={{
                flex: 1,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: '#00d492',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {liveUrl}
              </code>
              <button
                onClick={copyUrl}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.375rem 0.75rem',
                  background: copied ? 'rgba(0,212,146,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${copied ? 'rgba(0,212,146,0.3)' : '#1e2e28'}`,
                  borderRadius: '0.375rem',
                  color: copied ? '#00d492' : '#6b8c7a',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontWeight: '500',
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Edit form */}
          <div style={{ background: '#111816', border: '1px solid #1e2e28', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>
              Edit Configuration
            </h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name */}
              <div>
                <label style={labelStyle}>API Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#00d492')}
                  onBlur={e => (e.target.style.borderColor = '#1e2e28')}
                />
              </div>

              {/* Method + Endpoint */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.625rem' }}>
                <div>
                  <label style={labelStyle}>Method</label>
                  <div style={{ position: 'relative' }}>
                    <select value={method} onChange={e => setMethod(e.target.value)}
                      style={{
                        padding: '0.5625rem 1.75rem 0.5625rem 0.75rem',
                        background: '#0a0f0d',
                        border: '1px solid #1e2e28',
                        borderRadius: '0.5rem',
                        color: METHOD_COLOR[method] ?? '#fff',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '700',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                      }}
                      onFocus={e => (e.target.style.borderColor = '#00d492')}
                      onBlur={e => (e.target.style.borderColor = '#1e2e28')}
                    >
                      {METHODS.map(m => <option key={m} value={m} style={{ color: METHOD_COLOR[m], background: '#0a0f0d' }}>{m}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#3d5a4e' }}
                      width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Endpoint</label>
                  <input type="text" required value={endpoint}
                    onChange={e => { setEndpoint(e.target.value); validateEndpoint(e.target.value) }}
                    style={{ ...monoInput, borderColor: endpointError ? '#f87171' : '#1e2e28' }}
                    onFocus={e => { if (!endpointError) e.target.style.borderColor = '#00d492' }}
                    onBlur={e => { if (!endpointError) e.target.style.borderColor = '#1e2e28' }}
                  />
                  {endpointError && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.2rem' }}>{endpointError}</p>}
                </div>
              </div>

              {/* Response */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Response Body</label>
                  {jsonValid === true && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#00d492' }}><CheckCircle2 size={11}/> Valid</span>}
                  {jsonValid === false && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#f87171' }}><AlertCircle size={11}/> Invalid</span>}
                </div>
                <textarea
                  required
                  value={responseBody}
                  onChange={e => { setResponseBody(e.target.value); setJsonValid(null) }}
                  onBlur={e => validateJson(e.target.value)}
                  rows={7}
                  style={{ ...monoInput, fontSize: '0.8rem', resize: 'vertical', minHeight: '140px', lineHeight: 1.6, borderColor: jsonBorderColor }}
                  onFocus={e => { if (jsonValid === null) e.target.style.borderColor = '#00d492' }}
                />
                {jsonError && <p style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>{jsonError}</p>}
              </div>

              {/* Status + Delay */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                <div>
                  <label style={labelStyle}>Status Code</label>
                  <input type="number" value={statusCode} onChange={e => setStatusCode(Number(e.target.value))}
                    min={100} max={599} style={monoInput}
                    onFocus={e => (e.target.style.borderColor = '#00d492')}
                    onBlur={e => (e.target.style.borderColor = '#1e2e28')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Delay (ms)</label>
                  <input type="number" value={delay} onChange={e => setDelay(Number(e.target.value))}
                    min={0} max={10000} style={monoInput}
                    onFocus={e => (e.target.style.borderColor = '#00d492')}
                    onBlur={e => (e.target.style.borderColor = '#1e2e28')}
                  />
                </div>
              </div>

              {saveError && (
                <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#f87171' }}>
                  {saveError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  type="submit"
                  disabled={saving || !!endpointError || jsonValid === false}
                  style={{
                    flex: 1,
                    padding: '0.5625rem',
                    background: '#00d492',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#0a0f0d',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving || !!endpointError || jsonValid === false ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    transition: 'filter 0.15s',
                  }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saved ? <><Check size={14}/> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                </button>

                {!confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    style={{
                      padding: '0.5625rem 0.875rem',
                      background: 'transparent',
                      border: '1px solid rgba(248,113,113,0.25)',
                      borderRadius: '0.5rem',
                      color: '#f87171',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      style={{
                        padding: '0.5625rem 0.75rem',
                        background: 'rgba(248,113,113,0.12)',
                        border: '1px solid rgba(248,113,113,0.3)',
                        borderRadius: '0.5rem',
                        color: '#f87171',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: deleting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {deleting ? <Loader2 size={12} className="animate-spin" /> : null}
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      style={{
                        padding: '0.5625rem 0.75rem',
                        background: 'transparent',
                        border: '1px solid #1e2e28',
                        borderRadius: '0.5rem',
                        color: '#6b8c7a',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT — Test Panel */}
        <div style={{ position: 'sticky', top: '5.5rem' }}>
          <div style={{ background: '#111816', border: '1px solid #1e2e28', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', margin: '0 0 1.25rem', letterSpacing: '-0.01em' }}>
              Test Request
            </h2>

            {/* Request display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.75rem',
              background: '#0a0f0d',
              border: '1px solid #1e2e28',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}>
              <span style={{
                padding: '0.175rem 0.5rem',
                background: METHOD_BG[method] ?? 'rgba(255,255,255,0.08)',
                color: METHOD_COLOR[method] ?? '#fff',
                borderRadius: '3px',
                fontSize: '0.65rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}>
                {method}
              </span>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#7fb89a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                /api/mock{endpoint}
              </code>
            </div>

            {/* Send button */}
            <button
              onClick={sendTestRequest}
              disabled={testing}
              style={{
                width: '100%',
                padding: '0.625rem',
                background: '#00d492',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#0a0f0d',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: testing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                transition: 'filter 0.15s',
                opacity: testing ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (!testing) e.currentTarget.style.filter = 'brightness(1.08)' }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
            >
              {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {testing ? 'Sending...' : 'Send Request'}
            </button>

            {/* Loading skeleton */}
            {testing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[80, 60, 90, 55].map((w, i) => (
                  <div key={i} style={{ height: '10px', background: '#1e2e28', borderRadius: '4px', width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            )}

            {/* Result */}
            {!testing && testResult && (
              <div>
                {/* Status + time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{
                    padding: '0.2rem 0.625rem',
                    background: `${statusColor(testResult.status)}18`,
                    color: statusColor(testResult.status),
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {testResult.status === 0 ? 'Error' : `${testResult.status}`}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#3d5a4e', fontFamily: 'var(--font-mono)' }}>
                    {testResult.time}ms
                  </span>
                </div>

                {/* Body */}
                <div style={{
                  background: '#0a0f0d',
                  border: '1px solid #1e2e28',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  overflow: 'auto',
                  maxHeight: '320px',
                }}>
                  <pre style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#7fb89a',
                    margin: 0,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {testResult.body}
                  </pre>
                </div>
              </div>
            )}

            {!testing && !testResult && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                border: '1px dashed #1e2e28',
                borderRadius: '0.5rem',
                color: '#3d5a4e',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
              }}>
                Hit "Send Request" to test your mock endpoint
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
