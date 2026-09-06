import { getSettings, getTopCategories } from "@/lib/sanity/client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import CookieBanner from "@/components/cookie-banner";
import JsonLd from "@/components/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  absoluteUrl,
  baseOpenGraph,
  buildWebsiteJsonLd,
  buildOrganizationJsonLd,
  googleVerification
} from "@/lib/seo";

async function sharedMetaData() {
  const settings = await getSettings();
  const ogImage = absoluteUrl("/opengraph-image");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings?.title || SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description: settings?.description || SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    openGraph: baseOpenGraph({
      title: settings?.title || SITE_NAME,
      description: settings?.description || SITE_DESCRIPTION,
      url: SITE_URL,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME
        }
      ]
    }),
    twitter: {
      card: "summary_large_image",
      title: settings?.title || SITE_NAME,
      description: settings?.description || SITE_DESCRIPTION,
      images: [ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    verification: {
      google: googleVerification()
    }
  };
}

export async function generateMetadata() {
  return await sharedMetaData();
}

export default async function Layout({ children }) {
  const settings = await getSettings();
  const categories = await getTopCategories();
  return (
    <>
      <JsonLd data={buildWebsiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <Navbar {...settings} categories={categories} />

      <div>{children}</div>

      <Footer {...settings} />
      <CookieBanner />
    </>
  );
}

export const revalidate = false;
