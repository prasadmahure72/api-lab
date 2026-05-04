import AuthBrandPanel from '@/components/AuthBrandPanel'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-root">
      <AuthBrandPanel />

      {/* Form panel */}
      <div className="auth-form-side">
        <div className="auth-form-inner">{children}</div>
      </div>

      <style>{`
        .auth-root {
          display: flex;
          min-height: 100vh;
          background: #0a0f0d;
        }

        .auth-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          overflow-y: auto;
          position: relative;
        }

        /* Subtle right-panel texture */
        .auth-form-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #1e2e28 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.18;
          pointer-events: none;
        }

        .auth-form-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
        }
      `}</style>
    </div>
  )
}
