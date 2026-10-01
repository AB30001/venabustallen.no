import { urlForImage } from "@/lib/sanity/image";

/**
 * Resolve post/author/about images from Sanity CDN.
 * (Kept as named helpers so call sites stay stable.)
 */
export function getPostImage(post) {
  return urlForImage(post?.mainImage || post?.image) || null;
}

export function getAuthorImage(author) {
  return urlForImage(author?.image) || null;
}

export function getAboutImage(about) {
  return urlForImage(about?.image) || null;
}
