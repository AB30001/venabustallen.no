import { MetadataRoute } from "next";
import { SITE_URL, siteHost } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/studio/*", "/api/"]
    },
    sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
    host: siteHost()
  };
}
