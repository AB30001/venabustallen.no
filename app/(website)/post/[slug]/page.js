import PostPage from "./default";
import { getAllPostsSlugs, getPostBySlug } from "@/lib/sanity/client";
import { getPostImage } from "@/lib/local-images";
import JsonLd from "@/components/json-ld";
import Breadcrumbs from "@/components/breadcrumbs";
import {
  absoluteUrl,
  baseOpenGraph,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  SITE_NAME
} from "@/lib/seo";

export async function generateStaticParams() {
  return await getAllPostsSlugs();
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  const local = getPostImage(post);
  const imageUrl = local?.src
    ? absoluteUrl(local.src)
    : absoluteUrl("/opengraph-image");
  const canonical = absoluteUrl(`/post/${post.slug?.current}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical
    },
    openGraph: baseOpenGraph({
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonical,
      publishedTime: post.publishedAt || post._createdAt,
      modifiedTime: post._updatedAt || post.publishedAt || post._createdAt,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }]
    }),
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl]
    }
  };
}

export default async function PostDefault({ params }) {
  const post = await getPostBySlug(params.slug);

  const local = getPostImage(post);
  const imageUrl = local?.src
    ? absoluteUrl(local.src)
    : absoluteUrl("/opengraph-image");

  const category = post.categories?.[0];
  const crumbs = [
    { name: "Hjem", path: "/" },
    ...(category?.slug?.current
      ? [
          {
            name: category.title || category.slug.current,
            path: `/category/${category.slug.current}`
          }
        ]
      : [{ name: "Arkiv", path: "/archive" }]),
    {
      name: post.title,
      path: `/post/${post.slug?.current}`,
      current: true
    }
  ];

  return (
    <>
      <JsonLd data={buildArticleJsonLd(post, imageUrl)} />
      <JsonLd data={buildBreadcrumbJsonLd(crumbs)} />
      <div className="mx-auto max-w-screen-md px-4 pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <PostPage post={post} />
    </>
  );
}
