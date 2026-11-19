import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/**
 * Rendert markdown (server-side) in de huisstijl, zie `.prose-am` in globals.css.
 * `liveBlogSlugs`: links naar /blog/<slug> die nog niet zichtbaar zijn, worden gewone tekst (geen dode links).
 */
export const Markdown = ({ children, liveBlogSlugs }: { children: string; liveBlogSlugs?: Set<string> }) => (
  <div className="prose-am">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ href = "", children }) => {
          if (href.startsWith("/blog/")) {
            const slug = href.replace(/^\/blog\//, "").replace(/[/?#].*$/, "");
            if (liveBlogSlugs && !liveBlogSlugs.has(slug)) return <span>{children}</span>;
          }
          const external = /^https?:\/\//.test(href);
          return (
            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {children}
            </a>
          );
        },
        table: ({ children }) => (
          <div className="table-wrap">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  </div>
);
