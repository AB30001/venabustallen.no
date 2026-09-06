/**
 * Prefer images mirrored under /public/img so pages do not render remote CDNs.
 * Files are produced by scripts/localize-images.mjs.
 */
export function getPostImage(post) {
  const slug = post?.slug?.current;
  if (!slug) return null;
  return {
    src: `/img/posts/${slug}.jpg`,
    width: 1600,
    height: 1200
  };
}

export function getAuthorImage(author) {
  const slug = author?.slug?.current;
  if (!slug) return null;
  return {
    src: `/img/authors/${slug}.jpg`,
    width: 400,
    height: 400
  };
}

export function getAboutImage() {
  return {
    src: "/img/about.jpg",
    width: 1200,
    height: 900
  };
}
