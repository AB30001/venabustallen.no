"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "venabustallen-cookie-consent";
const GOATCOUNTER_URL = "https://venabustallenno.goatcounter.com/count";

/**
 * Privacy-friendly pageview tracking via GoatCounter.
 * Loads only after cookie consent is accepted (matches privacy policy).
 */
export default function GoatCounter() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const skipNextPathCount = useRef(true);

  useEffect(() => {
    const read = () => {
      try {
        return localStorage.getItem(STORAGE_KEY) === "accepted";
      } catch {
        return false;
      }
    };
    setEnabled(read());

    const onChange = e => {
      if (e.detail === "accepted") {
        skipNextPathCount.current = true;
        setEnabled(true);
      } else {
        setEnabled(false);
      }
    };
    window.addEventListener("cookie-consent-changed", onChange);
    return () => window.removeEventListener("cookie-consent-changed", onChange);
  }, []);

  // Client-side navigations (script handles the initial pageview)
  useEffect(() => {
    if (!enabled) return;
    if (skipNextPathCount.current) {
      skipNextPathCount.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.goatcounter?.count) {
      window.goatcounter.count({
        path: location.pathname + location.search + location.hash
      });
    }
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
      data-goatcounter={GOATCOUNTER_URL}
    />
  );
}
