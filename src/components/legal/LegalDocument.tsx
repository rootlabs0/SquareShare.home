import Link from "next/link";
import type { ReactNode } from "react";

/* ============================================================
   Content model: legal pages are authored as structured data
   (see src/content/legal/*) and rendered by this component.
   Inline strings support a tiny, safe Markdown subset:
     **bold**  and  [label](url)   (url may be https, mailto, or /internal)
   ============================================================ */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "note"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; tableHeaders: string[]; tableRows: string[][] };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalContent {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  disclaimer?: string;
  intro: LegalBlock[];
  sections: LegalSection[];
}

/* ---- safe inline renderer (no dangerouslySetInnerHTML) ---- */

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

const LINK_CLASS =
  "text-acid underline decoration-acid/40 underline-offset-2 transition-colors hover:decoration-acid";

function renderLink(label: string, url: string, key: string): ReactNode {
  if (url.startsWith("/")) {
    return (
      <Link key={key} href={url} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(url);
  return (
    <a
      key={key}
      href={url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={LINK_CLASS}
    >
      {label}
    </a>
  );
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(renderLink(match[1], match[2], `${keyPrefix}-a${i}`));
    } else if (match[3] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-white">
          {match[3]}
        </strong>
      );
    }
    lastIndex = INLINE.lastIndex;
    i += 1;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function NoteBlock({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-white/70">
      {children}
    </div>
  );
}

function Block({ block, k }: { block: LegalBlock; k: string }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="mt-8 mb-3 text-lg font-bold text-white">
          {renderInline(block.text, k)}
        </h3>
      );
    case "p":
      return (
        <p className="mb-4 leading-relaxed text-white/60">
          {renderInline(block.text, k)}
        </p>
      );
    case "note":
      return <NoteBlock>{renderInline(block.text, k)}</NoteBlock>;
    case "ul":
      return (
        <ul className="mb-4 list-disc space-y-2 pl-5 leading-relaxed text-white/60 marker:text-acid">
          {block.items.map((item, idx) => (
            <li key={`${k}-li${idx}`} className="pl-1">
              {renderInline(item, `${k}-li${idx}`)}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.tableHeaders.map((h, idx) => (
                  <th
                    key={`${k}-th${idx}`}
                    className="border border-white/10 bg-white/[0.04] px-4 py-3 font-semibold text-white"
                  >
                    {renderInline(h, `${k}-th${idx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableRows.map((row, rIdx) => (
                <tr key={`${k}-tr${rIdx}`}>
                  {row.map((cell, cIdx) => (
                    <td
                      key={`${k}-td${rIdx}-${cIdx}`}
                      className="border border-white/10 px-4 py-3 align-top text-white/60"
                    >
                      {renderInline(cell, `${k}-td${rIdx}-${cIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function LegalDocument({ content }: { content: LegalContent }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Heading */}
      <header className="mb-12">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-acid">
          Legal
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          {content.title}
        </h1>
        {content.subtitle && (
          <p className="mt-4 text-lg text-white/50">{content.subtitle}</p>
        )}
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-white/30">
          Last updated: {content.lastUpdated}
        </p>
        {content.disclaimer && (
          <NoteBlock>{renderInline(content.disclaimer, "disclaimer")}</NoteBlock>
        )}
      </header>

      {/* Intro */}
      {content.intro.length > 0 && (
        <div className="mb-12">
          {content.intro.map((block, idx) => (
            <Block key={`intro-${idx}`} block={block} k={`intro-${idx}`} />
          ))}
        </div>
      )}

      {/* Table of contents */}
      {content.sections.length > 1 && (
        <nav
          aria-label="Table of contents"
          className="mb-14 bg-white/[0.03] px-6 py-6"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/40">
            Contents
          </p>
          <ol className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {content.sections.map((section) => (
              <li key={section.id} className="text-sm">
                <a
                  href={`#${section.id}`}
                  className="text-white/55 transition-colors hover:text-acid"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Sections */}
      {content.sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-12 scroll-mt-28">
          <h2 className="mb-5 text-2xl font-black tracking-tight text-white">
            {section.heading}
          </h2>
          {section.blocks.map((block, bIdx) => (
            <Block
              key={`${section.id}-${bIdx}`}
              block={block}
              k={`${section.id}-${bIdx}`}
            />
          ))}
        </section>
      ))}
    </article>
  );
}
