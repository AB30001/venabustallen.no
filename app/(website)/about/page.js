import { getAbout } from "@/lib/sanity/client";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import About from "./about";
import {
  absoluteUrl,
  baseOpenGraph,
  buildWebPageJsonLd,
  buildBreadcrumbJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME
} from "@/lib/seo";

export async function generateMetadata() {
  const canonical = absoluteUrl("/about");
  return {
    title: "Om oss",
    description: `Om ${SITE_NAME} — ${SITE_DESCRIPTION}`,
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title: `Om ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      url: canonical
    })
  };
}

export default async function AboutPage() {
  const about = await getAbout();
  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: "Om oss", path: "/about", current: true }
  ];

  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Om oss",
          description: SITE_DESCRIPTION,
          path: "/about"
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <div className="mx-auto max-w-screen-md px-4 pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <About about={about} />
    </>
  );
}
