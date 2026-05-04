'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

// Every response is exactly 5 lines so the terminal body never shifts height
const demos = [
  {
    method: 'GET',
    path: '/api/mock/users',
    status: 200,
    statusText: 'OK',
    time: '12ms',
    response: `{
  "users": [{ "id": 1, "name": "Alice" }],
  "total": 1,
  "page":  1
}`,
  },
  {
    method: 'POST',
    path: '/api/mock/orders',
    status: 201,
    statusText: 'Created',
    time: '8ms',
    response: `{
  "id":       "ord_k9x2m1",
  "status":   "created",
  "total":    129.99
}`,
  },
  {
    method: 'GET',
    path: '/api/mock/products',
    status: 200,
    statusText: 'OK',
    time: '5ms',
    response: `{
  "items": [{ "id": "p1", "price": 29 }],
  "count": 1,
  "page":  1
}`,
  },
  {
    method: 'DELETE',
    path: '/api/mock/session',
    status: 204,
    statusText: 'No Content',
    time: '3ms',
    response: `{
  "deleted":  true,
  "id":       "sess_x8kq2",
  "at":       "2026-05-05"
}`,
  },
]

const METHOD_COLORS: Record<string, string> = {
  GET: '#00d492',
  POST: '#ffffff',
  PUT: '#ffffff',
  DELETE: '#ffffff',
  PATCH: '#ffffff',
}

export default function AuthBrandPanel() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(i => (i + 1) % demos.length)
        setVisible(true)
      }, 350)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const demo = demos[current]

  return (
    <div className="brand-panel">
      {/* Dot grid background */}
      <div className="brand-dot-grid" aria-hidden="true" />

      {/* Glow orb */}
      <div className="brand-glow" aria-hidden="true" />

      <div className="brand-content">
        {/* Logo */}
        <div className="brand-logo">
          <Logo size="md" href="/" />
        </div>

        {/* Headline */}
        <h2 className="brand-headline">
          Mock APIs.<br />
          <span style={{ color: '#00d492' }}>Ship faster.</span>
        </h2>
        <p className="brand-sub">
          Define an endpoint, get a live URL.<br />
          No backend, no waiting, no excuses.
        </p>

        {/* Terminal */}
        <div className="terminal">
          {/* Terminal titlebar */}
          <div className="terminal-bar">
            <span className="t-dot" style={{ background: '#2a3f38' }} />
            <span className="t-dot" style={{ background: '#2a3f38' }} />
            <span className="t-dot" style={{ background: '#00d492' }} />
            <span className="t-title">apilab ~ live preview</span>
          </div>

          {/* Terminal body */}
          <div className="terminal-body" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
            {/* Request line */}
            <div className="t-line">
              <span className="t-prompt">$</span>
              <span
                className="t-method"
                style={{ color: METHOD_COLORS[demo.method] ?? '#fff' }}
              >
                {demo.method}
              </span>
              <span className="t-path">{demo.path}</span>
            </div>

            {/* Status line */}
            <div className="t-line t-status-line">
              <span
                className="t-status-badge"
                style={{
                  background: demo.status < 300
                    ? 'rgba(0,212,146,0.15)'
                    : 'rgba(255,255,255,0.08)',
                  color: demo.status < 300 ? '#00d492' : '#ffffff',
                }}
              >
                {demo.status} {demo.statusText}
              </span>
              <span className="t-time">· {demo.time}</span>
            </div>

            {/* Response JSON */}
            <pre className="t-response">{demo.response}</pre>

            {/* Blinking cursor */}
            <div className="t-line">
              <span className="t-prompt">$</span>
              <span className="t-cursor">▋</span>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="brand-features">
          {[
            { icon: '⚡', label: 'Instant endpoints' },
            { icon: '🔧', label: 'Zero config' },
            { icon: '🌍', label: 'Public URLs' },
          ].map(f => (
            <div key={f.label} className="feature-pill">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brand-panel {
          position: relative;
          width: 50%;
          min-height: 100vh;
          background: #070c0a;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 3rem 2.5rem;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .brand-panel { display: none; }
        }

        .brand-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #1e2e28 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          animation: grid-drift 80s linear infinite;
        }

        @keyframes grid-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 28px 28px; }
        }

        .brand-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0,212,146,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
        }

        .brand-logo {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 2rem;
        }

        .brand-headline {
          font-size: 2.4rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 0.875rem;
          letter-spacing: -0.03em;
        }

        .brand-sub {
          font-size: 0.9375rem;
          color: #6b8c7a;
          line-height: 1.6;
          margin: 0 0 2rem;
        }

        /* Terminal */
        .terminal {
          background: #0c1410;
          border: 1px solid #1e2e28;
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,146,0.06);
        }

        .terminal-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.625rem 0.875rem;
          background: #0f1a16;
          border-bottom: 1px solid #1e2e28;
        }

        .t-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          opacity: 0.85;
        }

        .t-title {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: #3d5a4e;
          margin-left: 0.375rem;
        }

        .terminal-body {
          padding: 1rem 1.125rem;
          height: 172px;
          overflow: hidden;
        }

        .t-line {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.375rem;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
        }

        .t-prompt {
          color: #3d5a4e;
          user-select: none;
          flex-shrink: 0;
        }

        .t-method {
          font-weight: 700;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .t-path {
          color: #c8ddd5;
        }

        .t-status-line {
          margin-top: 0.125rem;
          margin-bottom: 0.625rem;
        }

        .t-status-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 0.25rem;
        }

        .t-time {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #3d5a4e;
        }

        .t-response {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #7fb89a;
          margin: 0 0 0.5rem;
          white-space: pre;
          line-height: 1.55;
          overflow: hidden;
          /* exactly 5 lines: 0.74rem × 1.55 × 5 ≈ 91px */
          height: 91px;
        }

        .t-cursor {
          color: #00d492;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* Feature pills */
        .brand-features {
          display: flex;
          gap: 0.625rem;
          flex-wrap: wrap;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: rgba(0,212,146,0.06);
          border: 1px solid #1e2e28;
          border-radius: 9999px;
          font-size: 0.78rem;
          color: #7fb89a;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}
