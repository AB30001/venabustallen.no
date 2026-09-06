import HomePage from "./home";
import { getAllPosts } from "@/lib/sanity/client";
import {
  absoluteUrl,
  baseOpenGraph,
  SITE_NAME,
  SITE_DESCRIPTION
} from "@/lib/seo";

export async function generateMetadata() {
  const canonical = absoluteUrl("/");
  return {
    title: {
      absolute: SITE_NAME
    },
    description: SITE_DESCRIPTION,
    alternates: { canonical },
    openGraph: baseOpenGraph({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: canonical
    })
  };
}

export default async function IndexPage() {
  const posts = await getAllPosts();
  return <HomePage posts={posts} />;
}
