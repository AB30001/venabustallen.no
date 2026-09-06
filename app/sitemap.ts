import { getAllPosts, getAllCategories, getAllAuthorsSlugs } from "@/lib/sanity/client";
import { absoluteUrl } from "@/lib/seo";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, authors] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllAuthorsSlugs()
  ]);

  const postEntries: MetadataRoute.Sitemap = (posts || [])
    .filter(post => post?.slug?.current)
    .map(post => ({
      url: absoluteUrl(`/post/${post.slug.current}`),
      lastModified: new Date(
        post._updatedAt || post.publishedAt || post._createdAt
      ),
      changeFrequency: "weekly",
      priority: 0.8
    }));

  const categoryEntries: MetadataRoute.Sitemap = (categories || [])
    .map(entry => {
      const slug =
        typeof entry === "string"
          ? entry
          : entry?.category || entry?.slug?.current;
      return slug
        ? {
            url: absoluteUrl(`/category/${slug}`),
            lastModified: new Date(entry._updatedAt || Date.now()),
            changeFrequency: "weekly" as const,
            priority: 0.7
          }
        : null;
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  const authorEntries: MetadataRoute.Sitemap = (authors || [])
    .map(entry => {
      const slug =
        typeof entry === "string" ? entry : entry?.author || entry?.slug;
      return slug
        ? {
            url: absoluteUrl(`/author/${slug}`),
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.5
          }
        : null;
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: absoluteUrl("/archive"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];

  return [
    ...staticRoutes,
    ...categoryEntries,
    ...authorEntries,
    ...postEntries
  ];
}
