/* ═══════════════════════════════════════════════════════════════════
   CuraSense — MarkdownText
   ───────────────────────────────────────────────────────────────────
   Tiny inline markdown renderer for AI-generated diagnostic output.
   Mistral / Groq / etc. return text peppered with **bold** markers,
   numbered lists, dashes, and section headers. Rendering them as a
   plain <p> shows raw asterisks — that's why the symptoms / scans /
   reports panels looked "raw".

   Supports the only patterns the models actually emit:
     **bold**           → <strong>
     *italic*           → <em>     (only if not part of **)
     ## Heading         → <h4>
     - item / * item    → <ul><li>
     1. item            → <ol><li>
     blank line         → paragraph break
     single newline     → space (paragraphs reflow naturally)

   Why not pull in react-markdown:
     ~80kB minified for what amounts to one regex per pattern.
     This file is ~120 lines and zero deps.
   ═══════════════════════════════════════════════════════════════════ */

import React from 'react';

interface MarkdownTextProps {
  children?: string | null;
  style?: React.CSSProperties;
  className?: string;
}

/* Inline parser — handles **bold** and *italic* within a line of text */
function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let buf = text;
  let key = 0;

  // Greedy handle **bold** first (so single * doesn't eat the inner text)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const boldParts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = boldRegex.exec(buf)) !== null) {
    if (match.index > lastIndex) {
      boldParts.push(buf.slice(lastIndex, match.index));
    }
    boldParts.push(
      <strong key={`${keyPrefix}-b-${key++}`} style={{ fontWeight: 700 }}>
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < buf.length) boldParts.push(buf.slice(lastIndex));

  // Then handle *italic* in the leftover string segments
  for (const part of boldParts) {
    if (typeof part !== 'string') {
      out.push(part);
      continue;
    }
    const italicRegex = /\*([^*]+)\*/g;
    let li = 0;
    let im: RegExpExecArray | null;
    while ((im = italicRegex.exec(part)) !== null) {
      if (im.index > li) out.push(part.slice(li, im.index));
      out.push(
        <em key={`${keyPrefix}-i-${key++}`} style={{ fontStyle: 'italic' }}>
          {im[1]}
        </em>
      );
      li = italicRegex.lastIndex;
    }
    if (li < part.length) out.push(part.slice(li));
  }
  return out;
}

export default function MarkdownText({
  children,
  style,
  className,
}: MarkdownTextProps) {
  if (!children) return null;

  const lines = children.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentList:
    | { type: 'ul' | 'ol'; items: string[] }
    | null = null;
  let currentParagraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (currentParagraph.length) {
      const text = currentParagraph.join(' ');
      blocks.push(
        <p
          key={`p-${key++}`}
          style={{ margin: '0.5em 0', lineHeight: 1.65 }}
        >
          {parseInline(text, `p${key}`)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (!currentList) return;
    const Tag = currentList.type;
    const items = currentList.items;
    blocks.push(
      <Tag
        key={`l-${key++}`}
        style={{ margin: '0.5em 0', paddingLeft: '1.4em', lineHeight: 1.6 }}
      >
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '0.3em' }}>
            {parseInline(item, `li${key}-${i}`)}
          </li>
        ))}
      </Tag>
    );
    currentList = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Blank line → flush whatever's open
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Header (## Foo or ### Foo)
    const headerMatch = /^#{2,4}\s+(.*)$/.exec(line);
    if (headerMatch) {
      flushParagraph();
      flushList();
      blocks.push(
        <h4
          key={`h-${key++}`}
          style={{
            margin: '0.9em 0 0.4em',
            fontWeight: 700,
            fontSize: '1em',
            letterSpacing: '0.01em',
          }}
        >
          {parseInline(headerMatch[1], `h${key}`)}
        </h4>
      );
      continue;
    }

    // Bullet list  ( - foo  /  * foo )
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }

    // Numbered list  ( 1. foo  /  2) foo )
    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(line.replace(/^\d+[.)]\s+/, ''));
      continue;
    }

    // Plain text — accumulate into current paragraph
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return (
    <div style={style} className={className}>
      {blocks}
    </div>
  );
}
