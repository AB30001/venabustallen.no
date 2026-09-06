import { Suspense } from "react";
import Container from "@/components/container";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import Archive from "./archive";
import Loading from "@/components/loading";
import {
  absoluteUrl,
  baseOpenGraph,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  SITE_DESCRIPTION
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const page = Number(searchParams?.page || 1);
  const canonical =
    page > 1
      ? absoluteUrl(`/archive`) + `?page=${page}`
      : absoluteUrl("/archive");

  return {
    title: page > 1 ? `Arkiv — side ${page}` : "Arkiv",
    description: "Alle innlegg fra Venabustallen.",
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title: "Arkiv",
      description: SITE_DESCRIPTION,
      url: canonical
    })
  };
}

export default async function ArchivePage({ searchParams }) {
  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: "Arkiv", path: "/archive", current: true }
  ];

  return (
    <>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: "Arkiv",
          description: SITE_DESCRIPTION,
          path: "/archive"
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <Container className="relative">
        <Breadcrumbs items={crumbs} />
        <h1 className="heading-display text-center">
          Arkiv
        </h1>
        <div className="text-center">
          <p className="mt-4 font-serif text-lg italic text-muted">
            Alle innlegg vi har publisert.
          </p>
        </div>
        <Suspense
          key={searchParams.page || "1"}
          fallback={<Loading />}>
          <Archive searchParams={searchParams} />
        </Suspense>
      </Container>
    </>
  );
}
