import Image from "next/image";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import { notFound } from "next/navigation";
import {
  getAllAuthorsSlugs,
  getAuthorPostsBySlug
} from "@/lib/sanity/client";
import { getAuthorImage } from "@/lib/local-images";
import {
  absoluteUrl,
  baseOpenGraph,
  buildPersonJsonLd,
  buildBreadcrumbJsonLd
} from "@/lib/seo";

export async function generateStaticParams() {
  return await getAllAuthorsSlugs();
}

export async function generateMetadata({ params }) {
  const data = await getAuthorPostsBySlug(params.slug);
  const author = data?.[0]?.author;
  if (!author) return {};
  const canonical = absoluteUrl(`/author/${params.slug}`);
  const title = `Innlegg av ${author.name}`;
  return {
    title,
    description: author.bio || title,
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title,
      description: author.bio || title,
      url: canonical,
      type: "profile"
    })
  };
}

export default async function AuthorPage({ params }) {
  const posts = await getAuthorPostsBySlug(params.slug);

  if (!posts || posts.length === 0) {
    notFound();
  }

  const author = posts[0].author;
  const imageProps = getAuthorImage(author);
  const crumbs = [
    { name: "Hjem", path: "/" },
    { name: author.name, path: `/author/${params.slug}`, current: true }
  ];

  return (
    <Container>
      <JsonLd data={buildPersonJsonLd(author)} />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="mb-10 flex flex-col items-center">
        {imageProps && (
          <div className="relative mb-4 h-20 w-20">
            <Image
              src={imageProps.src}
              alt={author.name}
              className="rounded-full object-cover"
              fill
              sizes="80px"
            />
          </div>
        )}
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-charcoal">
          {author.name}
        </h1>
        <p className="mt-2 font-serif italic text-muted">
          {posts.length} {posts.length === 1 ? "innlegg" : "innlegg"}
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:gap-14 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>
    </Container>
  );
}
