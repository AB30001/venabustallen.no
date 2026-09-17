"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const GOATCOUNTER_URL = "https://venabustallenno.goatcounter.com/count";

/**
 * Cookieless, privacy-friendly pageview tracking via GoatCounter.
 */
export default function GoatCounter() {
  const pathname = usePathname();
  const isFirstPath = useRef(true);

  useEffect(() => {
    if (isFirstPath.current) {
      isFirstPath.current = false;
      return;
    }
    if (typeof window !== "undefined" && window.goatcounter?.count) {
      window.goatcounter.count({
        path: location.pathname + location.search + location.hash
      });
    }
  }, [pathname]);

  return (
    <Script
      src="https://gc.zgo.at/count.js"
      strategy="afterInteractive"
      data-goatcounter={GOATCOUNTER_URL}
    />
  );
}
