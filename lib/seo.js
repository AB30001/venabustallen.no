/**
 * Shared SEO constants and JSON-LD builders for venabustallen.no
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://venabustallen.no";
export const SITE_NAME = "Venabustallen";
export const SITE_TAGLINE =
  "Rideturer og rideferier på Venabygdsfjellet — stødige dølahester for alle nivå.";
export const SITE_DESCRIPTION =
  "Rideturer, rideferier og stallhistorier fra Venabygdsfjellet. Dølahester, fjellridning og opplevelser ved Rondane.";
export const SITE_KEYWORDS = [
  "Venabustallen",
  "fjellridning",
  "Venabygdsfjellet",
  "rideferie",
  "dølahest",
  "Rondane",
  "horseback riding Norway",
  "Venabu",
  "rideturer",
  "rideweekend"
];
export const SITE_LANG = "nb-NO";

/** Brand palette — see README */
export const BRAND = {
  primary: "#1E3A32",
  accent: "#C4782A",
  dark: "#0F1915",
  light: "#F2F5F3"
};

export function absoluteUrl(path = "/") {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.replace(/\/$/, "")}`;
}

export function siteHost() {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "venabustallen.no";
  }
}

function orgLogo() {
  return {
    "@type": "ImageObject",
    url: absoluteUrl("/img/logo-square.png"),
    width: 512,
    height: 512
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANG,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: orgLogo()
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/archive") + "?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: orgLogo(),
    description: SITE_DESCRIPTION
  };
}

export function buildArticleJsonLd(post, imageUrl) {
  const canonical = absoluteUrl(`/post/${post.slug?.current}`);
  const headline = (post.title || "").slice(0, 110);
  const category =
    post.categories?.[0]?.title || post.categories?.[0]?.slug?.current;
  const authorSlug = post.author?.slug?.current;
  const authorUrl = authorSlug
    ? absoluteUrl(`/author/${authorSlug}`)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description: post.excerpt || "",
    image: imageUrl || absoluteUrl("/opengraph-image"),
    datePublished: post.publishedAt || post._createdAt,
    dateModified: post._updatedAt || post.publishedAt || post._createdAt,
    inLanguage: SITE_LANG,
    keywords: Array.isArray(post.categories)
      ? post.categories.map(c => c.title).filter(Boolean).join(", ")
      : undefined,
    articleSection: category,
    author: {
      "@type": "Person",
      name: post.author?.name || SITE_NAME,
      ...(authorUrl ? { url: authorUrl } : {})
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: orgLogo()
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical
    },
    url: canonical
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {})
    }))
  };
}

export function buildCollectionPageJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: description || SITE_DESCRIPTION,
    url: absoluteUrl(path),
    inLanguage: SITE_LANG,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL
    }
  };
}

export function buildWebPageJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description: description || SITE_DESCRIPTION,
    url: absoluteUrl(path),
    inLanguage: SITE_LANG,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL
    }
  };
}

export function buildPersonJsonLd(author) {
  const slug = author?.slug?.current;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author?.name || SITE_NAME,
    ...(slug ? { url: absoluteUrl(`/author/${slug}`) } : {}),
    ...(author?.bio ? { description: author.bio } : {})
  };
}

export function baseOpenGraph(overrides = {}) {
  return {
    type: "website",
    siteName: SITE_NAME,
    locale: "nb_NO",
    url: SITE_URL,
    ...overrides
  };
}

export function googleVerification() {
  return process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
}
