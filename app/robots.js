const BASE_URL = "https://haworthia-lab.vercel.app";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/login", "/account", "/reset-password"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
