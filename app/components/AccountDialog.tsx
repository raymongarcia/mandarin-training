"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Database } from "../lib/database.types";
import type { ProgressSyncStatus } from "../lib/useLearningProgress";
import type { SupabaseClient } from "@supabase/supabase-js";

export default function AccountDialog({
  client,
  user,
  syncStatus,
  syncError,
  onClose,
  onSignIn,
  onSignOut,
}: {
  client: SupabaseClient<Database> | null;
  user: User | null;
  syncStatus: ProgressSyncStatus;
  syncError: string;
  onClose: () => void;
  onSignIn: (email: string) => Promise<{ error: string | null }>;
  onSignOut: () => Promise<{ error: string | null }>;
}) {
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const sendSignInLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage("");
    setMessage("");
    const result = await onSignIn(email.trim());
    setBusy(false);
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    setMessage("Check your inbox for your secure sign-in link. Open it on this device to sync your progress.");
  };

  const signOut = async () => {
    setBusy(true);
    setErrorMessage("");
    const result = await onSignOut();
    setBusy(false);
    if (result.error) {
      setErrorMessage(result.error);
      return;
    }
    setMessage("You’ve signed out. Sign in again to sync your course progress.");
  };

  return (
    <div className="account-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <header className="account-dialog-header">
          <span className="brand-mark">文</span>
          <button className="icon-button" aria-label="Close account settings" onClick={onClose}>×</button>
        </header>
        <div className="account-dialog-content">
          <span className="eyebrow">YOUR LEARNING, KEPT SAFE</span>
          <h2 id="account-title">{user ? "Your learning account" : "Save your progress."}</h2>
          <p className="account-intro">Sign in with a secure email link to keep lesson progress and pick up where you left off on any device.</p>

          {!client && (
            <div className="backend-setup" role="status">
              <strong>Progress sync needs a Supabase connection.</strong>
              <p>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in Vercel, then run the included database migration. Redeploy when setup is complete.</p>
            </div>
          )}

          {user ? (
            <div className="signed-in-card">
              <span className="account-avatar">{user.email?.slice(0, 1).toUpperCase() ?? "你"}</span>
              <div><strong>{user.email}</strong><small>{syncStatus === "saved" ? "Progress synced to your account" : syncStatus === "saving" ? "Saving your latest progress…" : syncStatus === "error" ? "Progress sync needs attention" : "Signed in · progress sync enabled"}</small></div>
            </div>
          ) : client ? (
            <form className="signin-form" onSubmit={sendSignInLink}>
              <label htmlFor="account-email">Email address</label>
              <input id="account-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={busy} />
              <button className="primary-button signin-submit" type="submit" disabled={busy}>{busy ? "Sending your link…" : "Email me a sign-in link"} <span>→</span></button>
            </form>
          ) : null}

          {message && <p className="account-message" role="status">{message}</p>}
          {(errorMessage || syncError) && <p className="account-error" role="alert">{errorMessage || syncError}</p>}

          {user && client && <button className="signout-button" onClick={signOut} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>}
          <p className="account-privacy">Your progress is private to your account. We never store passwords—email sign-in uses a one-time secure link.</p>
        </div>
      </section>
    </div>
  );
}
