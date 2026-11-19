import fs from "node:fs";
import path from "node:path";

/**
 * Markdown-content uit /content (blog en branchepagina's).
 * Bovenaan elk bestand staat frontmatter tussen twee regels '---' met simpele `sleutel: waarde`-regels.
 */
const ROOT = path.join(process.cwd(), "content");

type Fields = Record<string, string>;

function parse(raw: string): { fields: Fields; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fields: {}, body: raw };
  const fields: Fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = JSON.parse(v);
    fields[line.slice(0, i).trim()] = v;
  }
  return { fields, body: m[2] };
}

function readDir(dir: string) {
  const full = path.join(ROOT, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => parse(fs.readFileSync(path.join(full, f), "utf8")));
}

/* ---------- Datum ---------- */

/** Vandaag in Europe/Amsterdam als YYYY-MM-DD. BLOG_TODAY (YYYY-MM-DD) is alleen voor lokaal testen. */
export function today(): string {
  const override = process.env.BLOG_TODAY;
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return override;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/* ---------- Blog ---------- */

export type Post = {
  slug: string;
  title: string; // SEO-titel (<title>, og:title)
  description: string;
  date: string; // YYYY-MM-DD, publicatiedatum
  draft: boolean;
  heading: string; // H1 uit de tekst
  body: string; // markdown zonder H1
};

function toPost({ fields, body }: { fields: Fields; body: string }): Post {
  const h1 = body.match(/^#\s+(.+)\s*$/m);
  return {
    slug: fields.slug,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    draft: fields.draft !== "false",
    heading: h1 ? h1[1].trim() : fields.title,
    body: h1 ? body.replace(h1[0], "").trim() : body.trim(),
  };
}

export const allPosts = (): Post[] => readDir("blog").map(toPost);

/** Zichtbaar = geen draft én publicatiedatum <= vandaag (Amsterdam). */
export const isVisible = (p: Post, now = today()) => !p.draft && !!p.date && p.date <= now;

export const visiblePosts = (): Post[] => {
  const now = today();
  return allPosts()
    .filter((p) => isVisible(p, now))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const getVisiblePost = (slug: string) => visiblePosts().find((p) => p.slug === slug);

/** Slugs van zichtbare posts, om interne links naar nog niet gepubliceerde posts als tekst te tonen. */
export const visibleSlugs = () => new Set(visiblePosts().map((p) => p.slug));

/* ---------- Branchepagina's (subpagina's onder /oplossingen) ---------- */

export type SubPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  name: string;
  parent: string; // SectorKey van de groepspagina
  card: string; // tekst voor het kaartje op de groepspagina
  draft: boolean;
  body: string;
};

const toSub = ({ fields, body }: { fields: Fields; body: string }): SubPage => ({
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  h1: fields.h1,
  name: fields.name,
  parent: fields.parent,
  card: fields.card,
  draft: fields.draft !== "false",
  body: body.trim(),
});

/** Alleen gepubliceerde subpagina's (draft: true, zoals fysiotherapie, is nergens bereikbaar). */
export const subPages = (): SubPage[] => readDir("oplossingen").map(toSub).filter((s) => !s.draft);
