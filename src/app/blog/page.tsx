import { Header } from "@/sections/Header";
import { Footer } from "@/sections/Footer";
import { EndCta } from "@/sections/HomeSections";
import { visiblePosts } from "@/lib/md";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/dates";

// ISR: nieuwe posts verschijnen op hun publicatiedatum vanzelf, zonder nieuwe deploy.
export const revalidate = 3600;

export const metadata = pageMeta({
  path: "/blog",
  title: "Blog over WhatsApp voor ondernemers | Appmaatje",
  description: "Praktische artikelen over WhatsApp voor je bedrijf: kosten, herinneringen, toestemming en de keuze tussen de gratis app en een koppeling.",
});

export default function BlogIndex() {
  const posts = visiblePosts();
  return (
    <>
      <Header />
      <main>
        <section className="pb-16 pt-36 text-center md:pb-20 md:pt-44">
          <div className="container">
            <p className="eyebrow">Blog</p>
            <h1 className="h2 mx-auto mt-5 max-w-5xl !text-[56px] md:!text-[96px]">WhatsApp voor ondernemers.</h1>
            <p className="lead mx-auto mt-5 max-w-2xl">Praktische uitleg over kosten, herinneringen en toestemming. In gewone taal.</p>
          </div>
        </section>
        <section className="pb-24 md:pb-32">
          <div className="container">
            {posts.length === 0 ? (
              <p className="text-center text-[18px] text-body/80">Binnenkort verschijnt hier het eerste artikel.</p>
            ) : (
              <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <a href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-[28px] border-2 border-ink bg-white p-7 transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0E1110] md:p-8">
                      <time dateTime={p.date} className="font-ui text-[12px] font-bold uppercase text-ink/60">{formatDate(p.date)}</time>
                      <h2 className="mt-3 text-[24px] font-bold leading-[1.15] tracking-[-0.015em] text-ink md:text-[28px]">{p.heading}</h2>
                      <p className="mt-3 flex-1 text-[17px] text-body/80">{p.description}</p>
                      <span className="mt-6 font-ui text-[13px] font-bold uppercase text-ink">Lees verder <span className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <EndCta />
      </main>
      <Footer />
    </>
  );
}
