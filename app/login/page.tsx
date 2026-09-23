import type { Metadata } from "next";
import { SESSION_DAYS, authConfig, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const next = safeNext(one(sp.next));
  const error = one(sp.error);
  const configured = authConfig() !== null;

  return (
    <div className="auth">
      <div className="auth-card">
        <div className="auth-brand">
          <svg width="34" height="34" viewBox="0 0 26 26" aria-hidden="true">
            <rect x="1" y="1" width="24" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 16h4V9h4v7h4V9h4" fill="none" stroke="var(--signal)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <div>
            <h1>Signoff</h1>
            <p className="muted small">VLSI training system</p>
          </div>
        </div>

        <svg className="auth-wave" viewBox="0 0 320 28" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 22h24V6h24v16h24V6h24v16h24V6h24v16h24V6h24v16h24V6h24v16h24V6h32" />
        </svg>

        {!configured && (
          <div className="callout warn small" role="alert">
            Sign-in is not configured yet. Set <code>AUTH_ID</code> and <code>AUTH_PASSWORD</code> as environment variables on the host, then redeploy.
          </div>
        )}
        {configured && error === "invalid" && <div className="callout auth-error small" role="alert">That id and password do not match. Try again.</div>}
        {configured && error === "config" && <div className="callout warn small" role="alert">Sign-in is not configured on the server.</div>}
        {one(sp.signedout) && !error && <div className="callout info small" role="status">You are signed out.</div>}

        <form method="post" action="/api/auth/login">
          <input type="hidden" name="next" value={next} />
          <div className="field">
            <label htmlFor="auth-id">ID</label>
            <input id="auth-id" name="id" type="text" autoComplete="username" autoCapitalize="none" spellCheck={false} required autoFocus disabled={!configured} />
          </div>
          <div className="field">
            <label htmlFor="auth-pw">Password</label>
            <input id="auth-pw" name="password" type="password" autoComplete="current-password" required disabled={!configured} />
          </div>
          <button className="btn primary auth-submit" type="submit" disabled={!configured}>Sign in</button>
        </form>
        <p className="tiny muted auth-note">You stay signed in on this browser for {SESSION_DAYS} days.</p>
      </div>
    </div>
  );
}
