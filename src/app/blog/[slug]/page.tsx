import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { EndCta } from "@/sections/HomeSections";
import { Markdown } from "@/components/Markdown";
import { getVisiblePost, visiblePosts, visibleSlugs } from "@/lib/md";
import { ORG_ID, jsonLd, pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/dates";
import { SITE } from "@/lib/config";

// ISR: elk uur opnieuw bekijken, zodat een post op zijn datum vanzelf verschijnt.
// Drafts en posts met een datum in de toekomst geven een 404.
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return visiblePosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getVisiblePost(params.slug);
  if (!p) return {};
  return pageMeta({ path: `/blog/${p.slug}`, title: p.title, description: p.description, type: "article", publishedTime: p.date });
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const p = getVisiblePost(params.slug);
  if (!p) notFound();
  const url = `${SITE.url}/blog/${p.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.heading,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    inLanguage: "nl-NL",
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${SITE.url}/opengraph-image`,
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/mascot.png` } },
  };
  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
        <article className="pb-24 pt-36 md:pb-32 md:pt-44">
          <div className="container">
            <div className="mx-auto max-w-[720px]">
              <a href="/blog" className="font-ui text-[13px] font-bold uppercase text-ink/70 hover:text-ink">← Alle artikelen</a>
              <p className="mt-6"><time dateTime={p.date} className="eyebrow">{formatDate(p.date)}</time></p>
              <h1 className="mt-5 font-display text-[44px] uppercase leading-[0.95] tracking-[-0.005em] text-ink md:text-[72px]">{p.heading}</h1>
              <div className="mt-10">
                <Markdown liveBlogSlugs={visibleSlugs()}>{p.body}</Markdown>
              </div>
            </div>
          </div>
        </article>
        <EndCta />
      </main>
      <Footer />
    </>
  );
}
