'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'

const inputBase: CSSProperties = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  background: '#0c1410',
  border: '1px solid #1e2e28',
  borderRadius: '0.5rem',
  color: '#e8f0ec',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-mono)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export default function SignInPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError('')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setGoogleLoading(false)
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '0.875rem' }}>
          <Logo size="md" href="/" />
        </div>
        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: '700',
            color: '#fff',
            margin: '0 0 0.3rem',
            letterSpacing: '-0.02em',
          }}
        >
          Welcome back
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6b8c7a', margin: 0 }}>
          Sign in to your workspace
        </p>
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          padding: '0.6875rem 1rem',
          background: '#111816',
          border: '1px solid #1e2e28',
          borderRadius: '0.5rem',
          color: '#e8f0ec',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          marginBottom: '1.25rem',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#00d492'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1e2e28'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: '#1e2e28' }} />
        <span style={{ fontSize: '0.72rem', color: '#3d5a4e', whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          or email
        </span>
        <div style={{ flex: 1, height: '1px', background: '#1e2e28' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b8c7a', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputBase}
            onFocus={e => {
              e.target.style.borderColor = '#00d492'
              e.target.style.boxShadow = 'none'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#1e2e28'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: '#6b8c7a', marginBottom: '0.375rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputBase, paddingRight: '2.75rem' }}
              onFocus={e => {
                e.target.style.borderColor = '#00d492'
                e.target.style.boxShadow = 'none'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#1e2e28'
                e.target.style.boxShadow = 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#3d5a4e',
                display: 'flex',
                padding: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00d492')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3d5a4e')}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.625rem 0.75rem',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              color: '#f87171',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.6875rem',
            background: '#00d492',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#0a0f0d',
            fontSize: '0.9375rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'filter 0.15s, box-shadow 0.15s',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.filter = 'brightness(1.08)'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = 'brightness(1)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#3d5a4e', marginTop: '1.5rem' }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: '#00d492', textDecoration: 'none', fontWeight: '600' }}>
          Sign up →
        </Link>
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
