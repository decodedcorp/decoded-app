"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string | null;
};

/**
 * Renders markdown content with magazine-style typography
 */
export function ArticleContent({ content }: Props) {
  if (!content) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <article className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-p:font-serif prose-p:leading-relaxed mx-auto">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>

      <div className="mt-12 mb-8 border-b border-border/50" />
    </div>
  );
}
