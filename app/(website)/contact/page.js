import { getSettings } from "@/lib/sanity/client";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import Contact from "./contact";
import {
  absoluteUrl,
  baseOpenGraph,
  buildWebPageJsonLd,
  buildBreadcrumbJsonLd,
  SITE_NAME
} from "@/lib/seo";

export async function generateMetadata() {
  const canonical = absoluteUrl("/contact");
  const description = `Kontakt ${SITE_NAME} — spørsmål om rideturer og rideferier på Venabygdsfjellet.`;
  return {
    title: "Kontakt",
    description,
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title: `Kontakt ${SITE_NAME}`,
      description,
      url: canonical
    })
  };
}

export default async function ContactPage() {
  const settings = await getSettings();
  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: "Kontakt", path: "/contact", current: true }
  ];

  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Kontakt",
          description: `Kontakt ${SITE_NAME}`,
          path: "/contact"
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <div className="mx-auto max-w-screen-md px-4 pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <Contact settings={settings} />
    </>
  );
}
