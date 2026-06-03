import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HeroDemo from '@/components/landing/HeroDemo'

/* ─── inline icons ───────────────────────────────────────────────── */
function IconBolt()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconLink()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconClock()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00d492" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="#00d492" strokeWidth="2" strokeLinecap="round"/></svg> }
function IconCode()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconShield() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00d492" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconGlobe()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00d492" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="#00d492" strokeWidth="2"/></svg> }
function IconArrow()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconCheck()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#00d492" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> }

/* ─── data ───────────────────────────────────────────────────────── */
const features = [
  { icon: <IconBolt />,   title: 'Instant Endpoints',   desc: 'Create a live, callable URL in under 10 seconds. No servers, no deploys, no waiting.' },
  { icon: <IconGlobe />,  title: 'Public by Default',   desc: 'Every mock endpoint is immediately accessible via a shareable public URL.' },
  { icon: <IconCode />,   title: 'Full JSON Control',   desc: 'Write any JSON response body. Arrays, nested objects, dynamic fields — all supported.' },
  { icon: <IconShield />, title: 'Custom Status Codes', desc: 'Return 200, 201, 400, 404, 500 — whatever your frontend needs to test against.' },
  { icon: <IconClock />,  title: 'Delay Simulation',    desc: 'Add artificial latency to simulate slow networks and test loading states perfectly.' },
  { icon: <IconLink />,   title: 'Method Support',      desc: 'GET, POST, PUT, DELETE — define the HTTP method that matches your real API contract.' },
]

const steps = [
  {
    n: '01',
    title: 'Define your endpoint',
    desc: 'Pick a path like /users or /orders and choose the HTTP method.',
    code: 'endpoint: /users\nmethod:   GET',
  },
  {
    n: '02',
    title: 'Write the response',
    desc: 'Paste any JSON body. Set the status code and an optional delay.',
    code: 'status:   200\ndelay:    0ms\nbody:     { ... }',
  },
  {
    n: '03',
    title: 'Get your live URL',
    desc: 'Copy the generated endpoint and call it from anywhere — browser, Postman, or code.',
    code: 'GET apilab.vercel.app\n    /api/mock/users',
  },
]

const testimonials = [
  { quote: 'APILab cut our frontend sprint time in half. We stop blocking on the backend team completely.', name: 'Arjun S.', role: 'Frontend Developer' },
  { quote: 'I mock every new feature\'s API on day one. By the time backend ships, the UI is already done.', name: 'Rohan M.', role: 'Senior Engineer' },
  { quote: 'Our QA team loves the custom status codes. Testing error states has never been easier.', name: 'Priya K.', role: 'QA Engineer' },
]

/* ─── page ───────────────────────────────────────────────────────── */
export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div style={{ background: '#0a0f0d', color: '#e8f0ec', overflowX: 'hidden' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-glow lp-glow-1" aria-hidden="true" />
        <div className="lp-glow lp-glow-2" aria-hidden="true" />
        <div className="lp-dot-grid"        aria-hidden="true" />

        <div className="lp-container" style={{ position: 'relative', zIndex: 1 }}>

          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            Built for developer velocity
          </div>

          <h1 className="lp-h1">
            Mock APIs.<br />
            <span className="lp-gradient-text">Instantly.</span>
          </h1>

          <p className="lp-hero-sub">
            Define an endpoint. Get a live URL. Ship faster.
          </p>

          <div className="lp-cta-row">
            <Link href="/signup" className="lp-btn-primary">
              Get started free <IconArrow />
            </Link>
            <a href="#how-it-works" className="lp-btn-ghost">
              See How It Works
            </a>
          </div>

          <p className="lp-trust">
            No credit card required &nbsp;·&nbsp; Free forever for small projects
          </p>

          <div className="lp-demo-wrap">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════════════════ */}
      <div className="lp-stats-bar">
        {[
          { value: '10,000+', label: 'Mock APIs created' },
          { value: '2,500+',  label: 'Developers' },
          { value: '< 5ms',   label: 'Avg response time' },
          { value: '99.9%',   label: 'Uptime' },
        ].map(s => (
          <div key={s.label} className="lp-stat">
            <span className="lp-stat-value">{s.value}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-tag">How it works</span>
            <h2 className="lp-h2">
              From idea to live endpoint<br />
              <span className="lp-gradient-text">in three steps.</span>
            </h2>
            <p className="lp-section-sub">
              No servers to spin up. No config files. Just define and call.
            </p>
          </div>

          <div className="lp-steps">
            {steps.map((step, i) => (
              <div key={step.n} className="lp-step">
                {i < steps.length - 1 && <div className="lp-step-line" aria-hidden="true" />}
                <div className="lp-step-n">{step.n}</div>
                <h3 className="lp-step-title">{step.title}</h3>
                <p className="lp-step-desc">{step.desc}</p>
                <div className="lp-step-code"><pre>{step.code}</pre></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-tag">Features</span>
            <h2 className="lp-h2">
              Everything you need.<br />
              <span className="lp-gradient-text">Nothing you don&apos;t.</span>
            </h2>
          </div>
          <div className="lp-features-grid">
            {features.map(f => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ URL ANATOMY ════════════════════════════════════════════ */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-tag">Your endpoint, your rules</span>
            <h2 className="lp-h2">
              One URL pattern.<br />
              <span className="lp-gradient-text">Infinite possibilities.</span>
            </h2>
            <p className="lp-section-sub">
              Every mock API you create maps to a clean, shareable public URL.
            </p>
          </div>

          <div className="lp-url-card">
            <div className="lp-url-anatomy">
              <div className="lp-url-part">
                <span className="lp-url-chunk lp-url-base">apilab.vercel.app</span>
                <span className="lp-url-seg-label">Domain</span>
              </div>
              <span className="lp-url-slash">/</span>
              <div className="lp-url-part">
                <span className="lp-url-chunk lp-url-prefix">api/mock</span>
                <span className="lp-url-seg-label">Base path</span>
              </div>
              <span className="lp-url-slash">/</span>
              <div className="lp-url-part">
                <span className="lp-url-chunk lp-url-endpoint">users</span>
                <span className="lp-url-seg-label" style={{ color: '#00d492' }}>Your endpoint</span>
              </div>
            </div>

            <div className="lp-url-checks">
              {[
                'Callable from browser, Postman, or code',
                'Returns your configured JSON instantly',
                'Supports all HTTP methods',
                'Optional delay for latency testing',
              ].map(t => (
                <div key={t} className="lp-check-row">
                  <IconCheck />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════ */}
      <section className="lp-section lp-section-alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-tag">Loved by developers</span>
            <h2 className="lp-h2">
              Built for teams that<br />
              <span className="lp-gradient-text">move fast.</span>
            </h2>
          </div>
          <div className="lp-testimonials">
            {testimonials.map(t => (
              <div key={t.name} className="lp-testimonial">
                <p className="lp-t-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="lp-t-author">
                  <div className="lp-t-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="lp-t-name">{t.name}</p>
                    <p className="lp-t-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" aria-hidden="true" />
        <div className="lp-container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="lp-cta-h2">
            Your backend isn&apos;t ready.<br />
            <span className="lp-gradient-text">Your frontend is.</span>
          </h2>
          <p className="lp-cta-sub">
            Start mocking APIs in under 30 seconds. Free forever for small projects.
          </p>
          <Link href="/signup" className="lp-btn-primary lp-btn-lg">
            Create free account <IconArrow />
          </Link>
          <p className="lp-trust" style={{ marginTop: '1.25rem' }}>
            No credit card &nbsp;·&nbsp; No setup &nbsp;·&nbsp; No backend required
          </p>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
            <span style={{ color: '#fff' }}>API</span>
            <span style={{ color: '#00d492' }}>Lab</span>
          </span>
          <span className="lp-footer-copy">© 2026 APILab. Built for developers.</span>
        </div>
      </footer>

      <style>{`
        .lp-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* hero */
        .lp-hero {
          position: relative;
          padding: 7rem 0 5rem;
          text-align: center;
          overflow: hidden;
        }
        .lp-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .lp-glow-1 {
          width: 640px; height: 640px;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%);
        }
        .lp-glow-2 { display: none; }
        .lp-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #1e2e28 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.3;
          pointer-events: none;
        }

        .lp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #fff;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9999px;
          padding: 0.3rem 0.875rem;
          margin-bottom: 1.75rem;
          letter-spacing: 0.04em;
          font-family: var(--font-mono);
        }
        .lp-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00d492;
          animation: lp-pulse 2s ease-in-out infinite;
        }
        @keyframes lp-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(0.75); }
        }

        .lp-h1 {
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin: 0 0 1.25rem;
        }
        .lp-gradient-text {
          background: linear-gradient(135deg, #00d492 0%, #00f5a8 50%, #00b87c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-hero-sub {
          font-size: clamp(1rem, 2vw, 1.175rem);
          color: #6b8c7a;
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 2.25rem;
        }
        .lp-br { display: block; }
        @media (max-width: 600px) { .lp-br { display: none; } }

        .lp-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.875rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .lp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.625rem;
          background: #00d492;
          border-radius: 8px;
          color: #0a0f0d;
          font-weight: 700;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: filter 0.15s, box-shadow 0.15s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .lp-btn-primary:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
        .lp-btn-lg { padding: 0.9rem 2rem; font-size: 1rem; }
        .lp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid #1e2e28;
          border-radius: 8px;
          color: #a0bfb0;
          font-weight: 500;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s, transform 0.15s;
        }
        .lp-btn-ghost:hover {
          border-color: #00d492;
          color: #fff;
          transform: translateY(-1px);
        }
        .lp-trust {
          font-size: 0.78rem;
          color: #3d5a4e;
          margin: 0;
          font-family: var(--font-mono);
        }
        .lp-demo-wrap {
          margin-top: 3.5rem;
          padding: 0 1rem;
        }

        /* stats bar */
        .lp-stats-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #1e2e28;
          border-bottom: 1px solid #1e2e28;
          background: #0c1410;
          flex-wrap: wrap;
        }
        .lp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 1.5rem 3rem;
          border-right: 1px solid #1e2e28;
          flex: 1;
          min-width: 130px;
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-value {
          font-size: 1.625rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          font-family: var(--font-mono);
        }
        .lp-stat-label {
          font-size: 0.7rem;
          color: #3d5a4e;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-family: var(--font-mono);
        }

        /* sections */
        .lp-section { padding: 6rem 0; }
        .lp-section-alt {
          background: #0c1410;
          border-top: 1px solid #1e2e28;
          border-bottom: 1px solid #1e2e28;
        }
        .lp-section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .lp-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: #00d492;
          background: transparent;
          border: 1px solid #1e2e28;
          border-radius: 9999px;
          padding: 0.25rem 0.75rem;
          margin-bottom: 1rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .lp-h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.035em;
          margin: 0 0 1rem;
        }
        .lp-section-sub {
          font-size: 1rem;
          color: #6b8c7a;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* steps */
        .lp-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          position: relative;
        }
        @media (max-width: 768px) {
          .lp-steps { grid-template-columns: 1fr; }
          .lp-step-line { display: none !important; }
        }
        .lp-step {
          position: relative;
          background: #111816;
          border: 1px solid #1e2e28;
          border-radius: 14px;
          padding: 1.75rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lp-step:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .lp-step-line {
          position: absolute;
          top: 2.5rem;
          right: -0.875rem;
          width: 1.75rem;
          height: 1px;
          background: linear-gradient(90deg, #1e2e28, transparent);
          z-index: 2;
        }
        .lp-step-n {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: #00d492;
          background: transparent;
          border: 1px solid #1e2e28;
          border-radius: 6px;
          padding: 0.2rem 0.5rem;
          display: inline-block;
          margin-bottom: 1rem;
          letter-spacing: 0.06em;
        }
        .lp-step-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .lp-step-desc {
          font-size: 0.875rem;
          color: #6b8c7a;
          line-height: 1.65;
          margin: 0 0 1.25rem;
        }
        .lp-step-code {
          background: #0a0f0d;
          border: 1px solid #1e2e28;
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }
        .lp-step-code pre {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: #7fb89a;
          margin: 0;
          white-space: pre;
          line-height: 1.7;
        }

        /* features */
        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .lp-features-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .lp-features-grid { grid-template-columns: 1fr; } }
        .lp-feature-card {
          background: #111816;
          border: 1px solid #1e2e28;
          border-radius: 14px;
          padding: 1.625rem;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .lp-feature-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .lp-feature-icon {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.04);
          border: 1px solid #1e2e28;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .lp-feature-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.4rem;
          letter-spacing: -0.02em;
        }
        .lp-feature-desc {
          font-size: 0.845rem;
          color: #6b8c7a;
          line-height: 1.65;
          margin: 0;
        }

        /* URL anatomy */
        .lp-url-card {
          background: #111816;
          border: 1px solid #1e2e28;
          border-radius: 16px;
          padding: 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          max-width: 860px;
          margin: 0 auto;
        }
        @media (max-width: 680px) { .lp-url-card { grid-template-columns: 1fr; gap: 2rem; } }
        .lp-url-anatomy {
          display: flex;
          align-items: flex-start;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .lp-url-part {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .lp-url-chunk {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.35rem 0.625rem;
          border-radius: 6px;
          white-space: nowrap;
        }
        .lp-url-base    { background: rgba(255,255,255,0.05); color: #a0bfb0; }
        .lp-url-prefix  { background: rgba(255,255,255,0.05); color: #a0bfb0; }
        .lp-url-endpoint { background: transparent; color: #00d492; border: 1px solid #1e2e28; }
        .lp-url-seg-label {
          font-size: 0.65rem;
          color: #3d5a4e;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .lp-url-slash {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: #1e2e28;
          padding-top: 0.3rem;
        }
        .lp-url-checks { display: flex; flex-direction: column; gap: 0.75rem; }
        .lp-check-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.875rem;
          color: #a0bfb0;
        }

        /* testimonials */
        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .lp-testimonials { grid-template-columns: 1fr; } }
        .lp-testimonial {
          background: #111816;
          border: 1px solid #1e2e28;
          border-radius: 14px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: border-color 0.2s;
        }
        .lp-testimonial:hover { border-color: rgba(255,255,255,0.1); }
        .lp-t-quote {
          font-size: 0.9375rem;
          color: #c8ddd5;
          line-height: 1.7;
          margin: 0;
          font-style: italic;
        }
        .lp-t-author { display: flex; align-items: center; gap: 0.75rem; margin-top: auto; }
        .lp-t-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid #1e2e28;
          color: #fff;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .lp-t-name { font-size: 0.85rem; font-weight: 600; color: #fff; margin: 0 0 0.1rem; }
        .lp-t-role { font-size: 0.74rem; color: #3d5a4e; margin: 0; font-family: var(--font-mono); }

        /* final CTA */
        .lp-cta-section {
          position: relative;
          padding: 8rem 0;
          text-align: center;
          overflow: hidden;
        }
        .lp-cta-glow { display: none; }
        .lp-cta-h2 {
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 0 0 1.25rem;
        }
        .lp-cta-sub {
          font-size: 1rem;
          color: #6b8c7a;
          margin: 0 auto 2.25rem;
          max-width: 420px;
          line-height: 1.7;
        }

        /* footer */
        .lp-footer {
          border-top: 1px solid #1e2e28;
          padding: 1.5rem 0;
          background: #0c1410;
        }
        .lp-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .lp-footer-copy {
          font-size: 0.78rem;
          color: #3d5a4e;
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  )
}
