"use client";

import Container from "@/components/container";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export default function Footer(props) {
  return (
    <footer className="mt-20 bg-charcoal text-white">
      <Container className="section-y !py-16">
        <p className="mx-auto max-w-2xl text-center font-serif text-lg italic leading-relaxed text-white/85 md:text-xl">
          {SITE_TAGLINE}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 font-display text-[11px] font-semibold uppercase tracking-brand text-white/80">
          <Link href="/privacy" className="hover:text-accent-soft">
            Personvern
          </Link>
          <span aria-hidden="true" className="text-white/40">
            |
          </span>
          <button
            type="button"
            data-cookie-settings
            className="hover:text-accent-soft"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-cookie-settings"));
              }
            }}>
            Informasjonskapsler
          </button>
          <span aria-hidden="true" className="text-white/40">
            |
          </span>
          <Link href="/contact" className="hover:text-accent-soft">
            Kontakt
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-white/55">
          Copyright © {new Date().getFullYear()}{" "}
          {props?.copyright || SITE_NAME}. Alle rettigheter forbeholdt.
        </div>
      </Container>
    </footer>
  );
}
