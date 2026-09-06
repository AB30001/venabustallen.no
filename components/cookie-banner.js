"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "venabustallen-cookie-consent";

/**
 * GDPR cookie banner — Accept / Decline only.
 * Footer "Informasjonskapsler" dispatches `open-cookie-settings` to reopen.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const reopen = () => setVisible(true);
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  const choose = value => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* private mode */
    }
    window.dispatchEvent(
      new CustomEvent("cookie-consent-changed", { detail: value })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-paper p-4 shadow-[0_-8px_30px_rgba(61,54,48,0.12)] md:p-6">
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <h2
            id="cookie-banner-title"
            className="font-display text-sm font-semibold uppercase tracking-brand text-charcoal">
            Informasjonskapsler
          </h2>
          <p
            id="cookie-banner-desc"
            className="mt-2 text-sm leading-relaxed text-muted">
            Vi bruker nødvendige informasjonskapsler for at nettstedet skal
            fungere. Valgfrie kapsler (for eksempel analyse) lastes kun hvis du
            godtar. Les mer i{" "}
            <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
              personvernerklæringen
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-3">
          <button
            type="button"
            className="btn-pill"
            onClick={() => choose("declined")}>
            Avslå
          </button>
          <button
            type="button"
            className="btn-pill-accent"
            onClick={() => choose("accepted")}>
            Godta
          </button>
        </div>
      </div>
    </div>
  );
}
