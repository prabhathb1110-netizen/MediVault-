import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USE_MOCK } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-layout" aria-label="Staff login">
      <aside className="auth-intro">
        <div className="auth-intro-brand"><span className="brand-mark">+</span> MediVault</div>
        <h1>Making medicine easier to find.</h1>
        <p>Good care begins with knowing what is available.</p>
        <div className="auth-art" aria-hidden="true">
          <svg viewBox="0 0 430 335" role="presentation" focusable="false">
            <defs>
              <linearGradient id="pedestalTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff8f8"/><stop offset="1" stopColor="#f5c4c4"/></linearGradient>
              <linearGradient id="pedestalSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d77c80"/><stop offset="1" stopColor="#a42d36"/></linearGradient>
              <linearGradient id="tube" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#6b1b24"/><stop offset="1" stopColor="#3b0d12"/></linearGradient>
              <filter id="artShadow"><feDropShadow dx="0" dy="13" stdDeviation="13" floodColor="#7f1d1d" floodOpacity=".18"/></filter>
            </defs>
            <ellipse cx="214" cy="293" rx="157" ry="22" fill="#b3262f" opacity=".12"/>
            <g filter="url(#artShadow)">
              <path d="M62 222v42c0 39 68 60 152 60s152-21 152-60v-42" fill="url(#pedestalSide)"/>
              <ellipse cx="214" cy="222" rx="152" ry="54" fill="url(#pedestalTop)"/>
              <path d="M145 234c42-15 91-20 145-12" fill="none" stroke="#e8a8aa" strokeWidth="2" opacity=".6"/>
            </g>
            <g fill="none" stroke="url(#tube)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
              <path d="M146 31v89c0 47 20 68 55 68 33 0 54-23 54-68V31"/>
              <path d="M201 188v12c0 37 18 54 49 54 35 0 48-26 49-66"/>
            </g>
            <path d="M146 25v21M255 25v21" stroke="#f1c1c1" strokeWidth="12" strokeLinecap="round"/>
            <circle cx="299" cy="170" r="27" fill="#7a1d25" filter="url(#artShadow)"/>
            <circle cx="299" cy="170" r="18" fill="#fff2f2" stroke="#e8a7aa" strokeWidth="5"/>
            <circle cx="299" cy="170" r="7" fill="#b3262f"/>
          </svg>
        </div>
      </aside>
      <div className="auth-panel">
        <div className="auth-content">
          <span className="auth-eyebrow">STAFF PORTAL</span>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to manage your pharmacy's stock.</p>
          {USE_MOCK && (
            <div className="notice demo-credentials">
              <strong>Demo access</strong>
              <span>staff@medivault.lk</span>
              <span>staff123</span>
            </div>
          )}
          <form onSubmit={submit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
              />
            </label>
            <label>
              Password
              <span className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>
            {error && <div className="notice notice-error" role="alert">{error}</div>}
            <button className="btn login-submit" disabled={busy} aria-busy={busy}>
              {busy ? 'Signing in...' : 'Log in'}
            </button>
          </form>
          <p className="auth-footnote">Secure access for pharmacy teams</p>
        </div>
      </div>
    </section>
  );
}
