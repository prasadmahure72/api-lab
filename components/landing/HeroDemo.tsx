'use client'

import { useEffect, useState } from 'react'

const demos = [
  {
    method: 'GET',
    endpoint: '/api/mock/users',
    status: 200,
    statusText: 'OK',
    delay: '0ms',
    time: '11ms',
    response: `{
  "users": [
    { "id": 1, "name": "Alice Chen",  "role": "admin" },
    { "id": 2, "name": "Bob Smith",   "role": "user"  }
  ],
  "total": 2
}`,
  },
  {
    method: 'POST',
    endpoint: '/api/mock/orders',
    status: 201,
    statusText: 'Created',
    delay: '200ms',
    time: '214ms',
    response: `{
  "id":       "ord_k9x2m1af",
  "status":   "created",
  "total":    129.99,
  "currency": "USD"
}`,
  },
  {
    method: 'GET',
    endpoint: '/api/mock/products',
    status: 200,
    statusText: 'OK',
    delay: '0ms',
    time: '6ms',
    response: `{
  "items": [
    { "id": "p1", "name": "Pro Plan",  "price": 29 },
    { "id": "p2", "name": "Starter",   "price": 0  }
  ]
}`,
  },
]

const METHOD_BG: Record<string, string> = {
  GET:    'rgba(0,212,146,0.12)',
  POST:   'rgba(255,255,255,0.08)',
  PUT:    'rgba(255,255,255,0.08)',
  DELETE: 'rgba(255,255,255,0.08)',
}
const METHOD_COLOR: Record<string, string> = {
  GET:    '#00d492',
  POST:   '#ffffff',
  PUT:    '#ffffff',
  DELETE: '#ffffff',
}

export default function HeroDemo() {
  const [idx, setIdx]         = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % demos.length); setVisible(true) }, 340)
    }, 3400)
    return () => clearInterval(id)
  }, [])

  const d = demos[idx]

  return (
    <div className="hero-demo-shell">
      {/* ── Browser chrome ── */}
      <div className="hd-chrome">
        <span className="hd-dot" style={{ background: '#2a3f38' }} />
        <span className="hd-dot" style={{ background: '#2a3f38' }} />
        <span className="hd-dot" style={{ background: '#00d492' }} />
        <div className="hd-urlbar">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#fff" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="#fff" strokeWidth="2"/>
          </svg>
          <span className="hd-url">
            apilab.vercel.app
            <span style={{ opacity: 0.35 }}>/api/mock</span>
            <span style={{ color: '#00d492', opacity: visible ? 1 : 0, transition: 'opacity 0.34s' }}>
              {d.endpoint.replace('/api/mock', '')}
            </span>
          </span>
        </div>
      </div>

      {/* ── Main pane ── */}
      <div className="hd-body" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.34s ease' }}>

        {/* Left: config */}
        <div className="hd-config">
          <p className="hd-config-label">Request</p>

          <div className="hd-row">
            <span className="hd-badge"
              style={{ background: METHOD_BG[d.method], color: METHOD_COLOR[d.method] }}>
              {d.method}
            </span>
            <span className="hd-endpoint">{d.endpoint}</span>
          </div>

          <div className="hd-meta-grid">
            <div className="hd-meta-item">
              <span className="hd-meta-key">Status</span>
              <span className="hd-meta-val"
                style={{ color: d.status < 300 ? '#00d492' : '#fff' }}>
                {d.status} {d.statusText}
              </span>
            </div>
            <div className="hd-meta-item">
              <span className="hd-meta-key">Delay</span>
              <span className="hd-meta-val">{d.delay}</span>
            </div>
            <div className="hd-meta-item">
              <span className="hd-meta-key">Response</span>
              <span className="hd-meta-val">application/json</span>
            </div>
            <div className="hd-meta-item">
              <span className="hd-meta-key">Time</span>
              <span className="hd-meta-val" style={{ color: '#00d492' }}>{d.time}</span>
            </div>
          </div>

          {/* Live indicator */}
          <div className="hd-live">
            <span className="hd-live-dot" />
            Live endpoint
          </div>
        </div>

        {/* Divider */}
        <div className="hd-divider" />

        {/* Right: response */}
        <div className="hd-response">
          <div className="hd-response-header">
            <p className="hd-config-label">Response</p>
            <span className="hd-status-pill"
              style={{
                background: d.status < 300 ? 'rgba(0,212,146,0.12)' : 'rgba(255,255,255,0.08)',
                color:      d.status < 300 ? '#00d492' : '#fff',
              }}>
              {d.status} {d.statusText}
            </span>
          </div>
          <pre className="hd-json">{d.response}</pre>
        </div>
      </div>

      <style>{`
        .hero-demo-shell {
          background: #0c1410;
          border: 1px solid #1e2e28;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0,212,146,0.06),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 80px rgba(0,212,146,0.04);
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        /* Chrome */
        .hd-chrome {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          background: #0f1a15;
          border-bottom: 1px solid #1e2e28;
        }
        .hd-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          display: inline-block;
        }
        .hd-urlbar {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-left: 0.5rem;
          background: #0a0f0d;
          border: 1px solid #1e2e28;
          border-radius: 6px;
          padding: 0.25rem 0.625rem;
        }
        .hd-url {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: rgba(255,255,255,0.55);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Body */
        .hd-body {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          min-height: 220px;
        }

        .hd-config, .hd-response {
          padding: 1.125rem 1.25rem;
        }

        .hd-config-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #3d5a4e;
          margin: 0 0 0.75rem;
          font-family: var(--font-mono);
        }

        .hd-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .hd-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }

        .hd-endpoint {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #c8ddd5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hd-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }

        .hd-meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .hd-meta-key {
          font-size: 0.65rem;
          color: #3d5a4e;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hd-meta-val {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: #a0bfb0;
        }

        .hd-live {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.7rem;
          color: #00d492;
          font-family: var(--font-mono);
        }

        .hd-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00d492;
          box-shadow: 0 0 6px #00d492;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .hd-divider {
          background: #1e2e28;
          width: 1px;
        }

        .hd-response-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .hd-status-pill {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .hd-json {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #7fb89a;
          line-height: 1.65;
          margin: 0;
          white-space: pre;
          overflow: hidden;
          height: 138px;
        }
      `}</style>
    </div>
  )
}
