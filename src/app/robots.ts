import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

// Preview-deploys niet indexeren, alleen productie.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: process.env.VERCEL_ENV === "production" ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
