import Container from "@/components/container";
import PostList from "@/components/postlist";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import { notFound } from "next/navigation";
import {
  getAllCategories,
  getPostsByCategory
} from "@/lib/sanity/client";
import {
  absoluteUrl,
  baseOpenGraph,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  SITE_DESCRIPTION
} from "@/lib/seo";

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(({ category }) => ({ slug: category }));
}

export async function generateMetadata({ params }) {
  const posts = await getPostsByCategory(params.slug);
  const categoryTitle =
    posts?.[0]?.categories?.find(c => c.slug?.current === params.slug)
      ?.title || params.slug.replace(/-/g, " ");
  const canonical = absoluteUrl(`/category/${params.slug}`);
  const description = `Innlegg i kategorien ${categoryTitle} på Venabustallen.`;

  return {
    title: categoryTitle,
    description,
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title: categoryTitle,
      description,
      url: canonical,
      type: "website"
    }),
    twitter: {
      card: "summary_large_image",
      title: categoryTitle,
      description
    }
  };
}

export default async function CategoryPage({ params }) {
  const posts = await getPostsByCategory(params.slug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const categoryTitle =
    posts[0]?.categories?.find(c => c.slug?.current === params.slug)
      ?.title || params.slug.replace(/-/g, " ");

  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: categoryTitle, path: `/category/${params.slug}`, current: true }
  ];

  return (
    <Container>
      <JsonLd
        data={buildCollectionPageJsonLd({
          name: categoryTitle,
          description: SITE_DESCRIPTION,
          path: `/category/${params.slug}`
        })}
      />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <h1 className="heading-display mb-3 text-center">
        {categoryTitle}
      </h1>
      <p className="mb-12 text-center font-serif italic text-muted">
        {posts.length} {posts.length === 1 ? "innlegg" : "innlegg"}
      </p>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-14 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>
    </Container>
  );
}
