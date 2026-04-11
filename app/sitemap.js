import { species } from "./zukan/data";
import { columns } from "./column/data";

const BASE_URL = "https://haworthia-lab.vercel.app";

export default function sitemap() {
  const staticPages = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/zukan`, priority: 0.9 },
    { url: `${BASE_URL}/column`, priority: 0.9 },
    { url: `${BASE_URL}/akinator`, priority: 0.8 },
    { url: `${BASE_URL}/gallery`, priority: 0.7 },
    { url: `${BASE_URL}/board`, priority: 0.7 },
    { url: `${BASE_URL}/terms`, priority: 0.4 },
    { url: `${BASE_URL}/privacy`, priority: 0.4 },
    { url: `${BASE_URL}/contact`, priority: 0.5 },
  ].map((p) => ({ ...p, lastModified: new Date(), changeFrequency: "monthly" }));

  const zukanPages = species.map((s) => ({
    url: `${BASE_URL}/zukan/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const columnPages = columns.map((c) => ({
    url: `${BASE_URL}/column/${c.slug}`,
    lastModified: new Date(c.date),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticPages, ...zukanPages, ...columnPages];
}
