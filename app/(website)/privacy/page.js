import Container from "@/components/container";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  absoluteUrl,
  buildWebPageJsonLd,
  buildBreadcrumbJsonLd
} from "@/lib/seo";

export const metadata = {
  title: "Personvern",
  description: `Personvernerklæring for ${SITE_NAME} — rideturer og rideferier på Venabygdsfjellet.`,
  alternates: {
    canonical: absoluteUrl("/privacy")
  }
};

export default function PrivacyPage() {
  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: "Personvern", path: "/privacy", current: true }
  ];

  return (
    <Container>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Personvern",
          description: `Personvernerklæring for ${SITE_NAME}`,
          path: "/privacy"
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="prose-venabu mx-auto max-w-screen-md">
        <h1>Personvernerklæring</h1>
        <p>Sist oppdatert: september 2026</p>

        <h2>Hvem vi er</h2>
        <p>
          {SITE_NAME} ({absoluteUrl("/")}) er en blogg og informasjonsnettsted
          om rideturer, rideferier og stalliv på Venabygdsfjellet. Vi krever
          ikke registrering. Personopplysninger behandles kun som beskrevet
          nedenfor.
        </p>

        <h2>Kontaktskjema</h2>
        <p>
          Når du sender kontaktskjemaet, går navn, e-post og melding direkte til
          oss via{" "}
          <a
            href="https://web3forms.com"
            target="_blank"
            rel="noopener noreferrer">
            Web3Forms
          </a>
          . Opplysningene brukes kun for å svare på henvendelsen og deles ikke
          for markedsføring.
        </p>

        <h2>Informasjonskapsler</h2>
        <p>
          Vi bruker nødvendige informasjonskapsler for drift av nettstedet
          (for eksempel tema/preferanser). Eventuelle ikke-nødvendige
          informasjonskapsler (analyse, innebygde tredjepartsskript) lastes
          først etter at du har gitt samtykke via informasjonskapsel-banneret.
          Du kan endre valget via lenken «Informasjonskapsler» i bunnteksten.
        </p>
        <p>
          {SITE_DESCRIPTION}
        </p>

        <h2>Dine rettigheter (GDPR)</h2>
        <p>
          Etter GDPR har du rett til innsyn, retting og sletting av
          personopplysninger vi behandler om deg. Ta kontakt via{" "}
          <a href="/contact">kontaktsiden</a>.
        </p>

        <h2>Endringer</h2>
        <p>
          Vi kan oppdatere denne erklæringen. Endringer publiseres på denne
          siden.
        </p>
      </div>
    </Container>
  );
}
