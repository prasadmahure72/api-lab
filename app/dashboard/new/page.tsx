'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

const METHOD_COLOR: Record<string, string> = {
  GET:    '#60a5fa',
  POST:   '#00d492',
  PUT:    '#f59e0b',
  DELETE: '#f87171',
  PATCH:  '#a78bfa',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
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

const monoInputStyle: CSSProperties = {
  ...inputStyle,
  fontFamily: 'var(--font-mono)',
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: '#6b8c7a',
  marginBottom: '0.375rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

export default function NewAPIPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [endpointError, setEndpointError] = useState('')
  const [method, setMethod] = useState('GET')
  const [responseBody, setResponseBody] = useState('{\n  "message": "Hello from APILab"\n}')
  const [jsonValid, setJsonValid] = useState<boolean | null>(null)
  const [jsonError, setJsonError] = useState('')
  const [statusCode, setStatusCode] = useState(200)
  const [delay, setDelay] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function validateEndpoint(val: string) {
    if (val && !val.startsWith('/')) {
      setEndpointError('Must start with /')
    } else {
      setEndpointError('')
    }
  }

  function validateJson(val: string) {
    if (!val.trim()) { setJsonValid(null); setJsonError(''); return }
    try {
      JSON.parse(val)
      setJsonValid(true)
      setJsonError('')
    } catch (e: unknown) {
      setJsonValid(false)
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (endpointError || jsonValid === false) return
    setLoading(true)
    setError('')

    let parsedResponse: unknown
    try {
      parsedResponse = JSON.parse(responseBody)
    } catch {
      setError('Response body must be valid JSON')
      setLoading(false)
      return
    }

    const res = await fetch('/api/apis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        endpoint,
        method,
        response: parsedResponse,
        status: statusCode,
        delay,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const jsonBorderColor = jsonValid === true ? '#00d492' : jsonValid === false ? '#f87171' : '#1e2e28'

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back */}
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: '#6b8c7a',
          fontSize: '0.875rem',
          textDecoration: 'none',
          marginBottom: '1.75rem',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#e8f0ec')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b8c7a')}
      >
        <ArrowLeft size={15} />
        Dashboard
      </Link>

      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: '700', color: '#fff', margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>
          Create Mock API
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b8c7a', margin: 0 }}>
          Define an endpoint and get a live URL instantly
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: '#111816',
        border: '1px solid #1e2e28',
        borderRadius: '0.875rem',
        padding: '1.75rem',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Name */}
          <div>
            <label style={labelStyle}>API Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="User List API"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#00d492')}
              onBlur={e => (e.target.style.borderColor = '#1e2e28')}
            />
          </div>

          {/* Method + Endpoint row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Method</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  style={{
                    padding: '0.625rem 2rem 0.625rem 0.75rem',
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
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#00d492')}
                  onBlur={e => (e.target.style.borderColor = '#1e2e28')}
                >
                  {METHODS.map(m => (
                    <option key={m} value={m} style={{ color: METHOD_COLOR[m], background: '#0a0f0d' }}>{m}</option>
                  ))}
                </select>
                <svg
                  style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#3d5a4e' }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Endpoint Path</label>
              <input
                type="text"
                required
                value={endpoint}
                onChange={e => { setEndpoint(e.target.value); validateEndpoint(e.target.value) }}
                placeholder="/users"
                style={{ ...monoInputStyle, borderColor: endpointError ? '#f87171' : '#1e2e28' }}
                onFocus={e => { if (!endpointError) e.target.style.borderColor = '#00d492' }}
                onBlur={e => { if (!endpointError) e.target.style.borderColor = '#1e2e28' }}
              />
              {endpointError && (
                <p style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '0.25rem' }}>{endpointError}</p>
              )}
            </div>
          </div>

          {/* Response body */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Response Body</label>
              {jsonValid === true && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#00d492' }}>
                  <CheckCircle2 size={12} /> Valid JSON
                </span>
              )}
              {jsonValid === false && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#f87171' }}>
                  <AlertCircle size={12} /> Invalid JSON
                </span>
              )}
            </div>
            <textarea
              required
              value={responseBody}
              onChange={e => { setResponseBody(e.target.value); setJsonValid(null) }}
              onBlur={e => validateJson(e.target.value)}
              placeholder={'{\n  "message": "Hello from APILab"\n}'}
              rows={8}
              style={{
                ...monoInputStyle,
                fontSize: '0.8125rem',
                resize: 'vertical',
                minHeight: '180px',
                borderColor: jsonBorderColor,
                lineHeight: 1.6,
              }}
              onFocus={e => { if (jsonValid === null) e.target.style.borderColor = '#00d492' }}
            />
            {jsonError && (
              <p style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                {jsonError}
              </p>
            )}
          </div>

          {/* Status + Delay row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Status Code</label>
              <input
                type="number"
                value={statusCode}
                onChange={e => setStatusCode(Number(e.target.value))}
                placeholder="200"
                min={100}
                max={599}
                style={monoInputStyle}
                onFocus={e => (e.target.style.borderColor = '#00d492')}
                onBlur={e => (e.target.style.borderColor = '#1e2e28')}
              />
            </div>
            <div>
              <label style={labelStyle}>Delay (ms)</label>
              <input
                type="number"
                value={delay}
                onChange={e => setDelay(Number(e.target.value))}
                placeholder="0"
                min={0}
                max={10000}
                style={monoInputStyle}
                onFocus={e => (e.target.style.borderColor = '#00d492')}
                onBlur={e => (e.target.style.borderColor = '#1e2e28')}
              />
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.625rem 0.875rem',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              color: '#f87171',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!endpointError || jsonValid === false}
            style={{
              padding: '0.6875rem',
              background: '#00d492',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#0a0f0d',
              fontSize: '0.9375rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !!endpointError || jsonValid === false ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              letterSpacing: '-0.01em',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.filter = 'brightness(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Creating...' : 'Create API'}
          </button>
        </form>
      </div>
    </div>
  )
}
