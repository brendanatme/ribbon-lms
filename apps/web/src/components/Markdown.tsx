import { Fragment, type ReactNode } from 'react';

/**
 * A small, dependency-free Markdown renderer scoped to what lesson content and
 * quiz prompts actually use: headings, paragraphs, bullet/ordered lists, blockquotes,
 * **bold**, inline `code`, and fenced ```code blocks``` with light PHP syntax
 * highlighting. It is intentionally not a full CommonMark implementation — just
 * enough to render authored teaching material cleanly.
 */
export function Markdown({ content, className = '' }: { content: string; className?: string }) {
  return <div className={`prose-lesson ${className}`}>{renderBlocks(content)}</div>;
}

/** Inline-only variant for tight spots (quiz prompts/options) — no top margins. */
export function MarkdownInline({ content }: { content: string }) {
  return <div className="prose-lesson prose-lesson--tight">{renderBlocks(content)}</div>;
}

/* -------------------------------------------------------------------------- */
/* Block-level parsing                                                         */
/* -------------------------------------------------------------------------- */

function renderBlocks(src: string): ReactNode[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // Fenced code block: ```lang
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i] ?? '')) {
        body.push(lines[i] ?? '');
        i++;
      }
      i++; // skip closing fence
      out.push(<CodeBlock key={key++} code={body.join('\n')} lang={lang} />);
      continue;
    }

    // Blank line
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Headings
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = (heading[1] ?? '#').length;
      const text = heading[2] ?? '';
      const cls =
        ['', 'mt-2 text-2xl', 'mt-5 text-xl', 'mt-4 text-lg', 'mt-3 text-base'][level] ??
        'text-base';
      const Tag = `h${Math.min(level + 1, 6)}` as 'h2';
      out.push(
        <Tag key={key++} className={`font-display font-semibold text-ink ${cls}`}>
          {renderInline(text)}
        </Tag>,
      );
      i++;
      continue;
    }

    // Blockquote (used for callouts/notes)
    if (/^>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i] ?? '')) {
        body.push((lines[i] ?? '').replace(/^>\s?/, ''));
        i++;
      }
      out.push(
        <blockquote
          key={key++}
          className="my-3 border-l-4 border-ribbon/40 bg-ribbon-light/50 py-2 pl-4 pr-3 text-ink/80"
        >
          {renderInline(body.join(' '))}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      out.push(
        <ul key={key++} className="my-3 list-disc space-y-1 pl-6 text-ink/80">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      out.push(
        <ol key={key++} className="my-3 list-decimal space-y-1 pl-6 text-ink/80">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Table: a `| … |` header row immediately followed by a `|---|---|` separator.
    if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) {
      const splitRow = (r: string) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((c) => c.trim());
      const header = splitRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i] ?? '')) {
        rows.push(splitRow(lines[i] ?? ''));
        i++;
      }
      out.push(
        <div key={key++} className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink/15 text-left">
                {header.map((cell, idx) => (
                  <th key={idx} className="py-2 pr-4 font-semibold text-ink">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-ink/10">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2 pr-4 align-top text-ink/80">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Paragraph: gather until blank line or a block starter
    const para: string[] = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i] ?? '') &&
      !/^```/.test(lines[i] ?? '') &&
      !/^#{1,4}\s/.test(lines[i] ?? '') &&
      !/^>\s?/.test(lines[i] ?? '') &&
      !/^\s*[-*]\s+/.test(lines[i] ?? '') &&
      !/^\s*\d+\.\s+/.test(lines[i] ?? '') &&
      !/^\s*\|/.test(lines[i] ?? '')
    ) {
      para.push(lines[i] ?? '');
      i++;
    }
    out.push(
      <p key={key++} className="my-3 leading-relaxed text-ink/80">
        {renderInline(para.join(' '))}
      </p>,
    );
  }

  return out;
}

/* -------------------------------------------------------------------------- */
/* Inline parsing: `code`, **bold**, *italic*                                   */
/* -------------------------------------------------------------------------- */

function renderInline(text: string): ReactNode {
  // Split on `code`, **bold**, then *italic*, preserving the delimiters' content.
  // Bold is matched before italic so `**x**` isn't mistaken for two `*x*` runs.
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-ribbon"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/* -------------------------------------------------------------------------- */
/* Fenced code block with light PHP syntax highlighting                         */
/* -------------------------------------------------------------------------- */

export function CodeBlock({ code, lang = 'text' }: { code: string; lang?: string }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg bg-ink px-4 py-3 text-[0.85rem] leading-relaxed">
      <code className="font-mono text-sand/95">{lang === 'php' ? highlightPhp(code) : code}</code>
    </pre>
  );
}

const PHP_KEYWORDS =
  'abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|true|false|null|void|self|parent';

// One master tokenizer: comments | strings | php tags | variables | keywords | numbers.
// Ordered so greedy constructs (comments, strings) win before bare words.
const PHP_TOKEN = new RegExp(
  [
    '(/\\*[\\s\\S]*?\\*/|//[^\\n]*|#[^\\n]*)', // 1 comment
    '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 2 string
    '(<\\?php|<\\?=|\\?>)', // 3 php tag
    '(\\$[A-Za-z_]\\w*)', // 4 variable
    `\\b(${PHP_KEYWORDS})\\b`, // 5 keyword
    '(\\b\\d+(?:\\.\\d+)?\\b)', // 6 number
  ].join('|'),
  'g',
);

const TOKEN_COLOR: Record<string, string> = {
  comment: '#8a93a6',
  string: '#9ece9a',
  tag: '#c9a3e0',
  variable: '#7fb6e8',
  keyword: '#e58fb0',
  number: '#e0b07f',
};

function highlightPhp(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  PHP_TOKEN.lastIndex = 0;
  while ((m = PHP_TOKEN.exec(code)) !== null) {
    const full = m[0] ?? '';
    if (full === '') break; // guard against zero-width matches
    if (m.index > last) nodes.push(<Fragment key={key++}>{code.slice(last, m.index)}</Fragment>);
    const kind = m[1]
      ? 'comment'
      : m[2]
        ? 'string'
        : m[3]
          ? 'tag'
          : m[4]
            ? 'variable'
            : m[5]
              ? 'keyword'
              : 'number';
    nodes.push(
      <span key={key++} style={{ color: TOKEN_COLOR[kind] }}>
        {full}
      </span>,
    );
    last = m.index + full.length;
  }
  if (last < code.length) nodes.push(<Fragment key={key++}>{code.slice(last)}</Fragment>);
  return nodes;
}
