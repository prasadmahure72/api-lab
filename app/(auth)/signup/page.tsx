'use client'

import { useState, type CSSProperties, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/Logo'

function getPasswordStrength(pw: string): { label: string; color: string } | null {
  if (!pw) return null
  if (pw.length < 8) return { label: 'Too short — min 8 characters', color: '#f87171' }
  if (pw.length < 12) return { label: 'Acceptable', color: '#fbbf24' }
  return { label: 'Strong', color: '#00d492' }
}

const inputBase = (invalid?: boolean): CSSProperties => ({
  width: '100%',
  padding: '0.625rem 0.75rem',
  background: '#0c1410',
  border: `1px solid ${invalid ? '#f87171' : '#1e2e28'}`,
  borderRadius: '0.5rem',
  color: '#e8f0ec',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-mono)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
})

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  color: '#6b8c7a',
  marginBottom: '0.375rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

export default function SignUpPage() {
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(password)
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password

  function validateEmail(val: string) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    setEmailError(ok || !val ? '' : 'Enter a valid email address')
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true)
    setError('')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    setGoogleLoading(false)
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault()
    if (emailError || confirmMismatch || !strength || strength.color === '#f87171') return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #1e2e28',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <CheckCircle2 size={26} style={{ color: '#00d492' }} />
        </div>
        <h2 style={{ color: '#fff', fontSize: '1.375rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Check your email
        </h2>
        <p style={{ color: '#6b8c7a', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          We sent a confirmation link to{' '}
          <span style={{ color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{email}</span>.
          <br />Open it to activate your account.
        </p>
        <Link
          href="/signin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.625rem 1.5rem',
            background: '#00d492',
            borderRadius: '0.5rem',
            color: '#0a0f0d',
            fontWeight: '700',
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
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
          Create your account
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#6b8c7a', margin: 0 }}>
          Start mocking APIs in seconds
        </p>
      </div>

      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
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
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ flex: 1, height: '1px', background: '#1e2e28' }} />
        <span style={{ fontSize: '0.72rem', color: '#3d5a4e', whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          or email
        </span>
        <div style={{ flex: 1, height: '1px', background: '#1e2e28' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            style={inputBase()}
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

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value) }}
            placeholder="you@example.com"
            style={inputBase(!!emailError)}
            onFocus={e => {
              if (!emailError) {
                e.target.style.borderColor = '#00d492'
                e.target.style.boxShadow = 'none'
              }
            }}
            onBlur={e => {
              if (!emailError) {
                e.target.style.borderColor = '#1e2e28'
                e.target.style.boxShadow = 'none'
              }
            }}
          />
          {emailError && (
            <p style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '0.25rem' }}>{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputBase(), paddingRight: '2.75rem' }}
              onFocus={e => {
                e.target.style.borderColor = '#00d492'
                e.target.style.boxShadow = 'none'
              }}
              onBlur={e => {
                e.target.style.borderColor = '#1e2e28'
                e.target.style.boxShadow = 'none'
              }}
            />
            <EyeToggle show={showPassword} onClick={() => setShowPassword(v => !v)} />
          </div>
          {strength && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.375rem' }}>
              <div style={{ flex: 1, height: '3px', background: '#1e2e28', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '99px',
                    background: strength.color,
                    width: strength.color === '#f87171' ? '33%' : strength.color === '#fbbf24' ? '66%' : '100%',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: strength.color, whiteSpace: 'nowrap' }}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label style={labelStyle}>Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputBase(confirmMismatch), paddingRight: '2.75rem' }}
              onFocus={e => {
                if (!confirmMismatch) {
                  e.target.style.borderColor = '#00d492'
                  e.target.style.boxShadow = 'none'
                }
              }}
              onBlur={e => {
                if (!confirmMismatch) {
                  e.target.style.borderColor = '#1e2e28'
                  e.target.style.boxShadow = 'none'
                }
              }}
            />
            <EyeToggle show={showConfirm} onClick={() => setShowConfirm(v => !v)} />
          </div>
          {confirmMismatch && (
            <p style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '0.25rem' }}>
              Passwords do not match
            </p>
          )}
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
          disabled={loading || !!emailError || confirmMismatch}
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
            opacity: loading || !!emailError || confirmMismatch ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'filter 0.15s, box-shadow 0.15s',
            letterSpacing: '-0.01em',
            marginTop: '0.125rem',
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
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#3d5a4e', marginTop: '1.5rem' }}>
        Already have an account?{' '}
        <Link href="/signin" style={{ color: '#00d492', textDecoration: 'none', fontWeight: '600' }}>
          Sign in →
        </Link>
      </p>
    </div>
  )
}

function EyeToggle({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
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
