import { CopyCodeBlock } from "@/components/CopyCodeBlock";
import type { ReactNode } from "react";

/**
 * Lightweight markdown renderer for KB articles and kapa.ai answers.
 * Supports headings, fenced code, lists, hr, and inline bold / code / links.
 */
export function MarkdownBody({
  content,
  className = "prose-article",
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseBlocks(content.trim());
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === "h2")
          return (
            <h2 key={i} id={slugify(block.text!)}>
              {renderInline(block.text!)}
            </h2>
          );
        if (block.type === "h3")
          return (
            <h3 key={i} id={slugify(block.text!)}>
              {renderInline(block.text!)}
            </h3>
          );
        if (block.type === "code") return <CopyCodeBlock key={i} code={block.text ?? ""} language={block.lang} />;
        if (block.type === "hr") return <hr key={i} className="my-4 border-neutral-200" />;
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items!.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        if (block.type === "ol")
          return (
            <ol key={i}>
              {block.items!.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        return <p key={i}>{renderInline(block.text!)}</p>;
      })}
    </div>
  );
}

interface Block {
  type: "h2" | "h3" | "p" | "ul" | "ol" | "code" | "hr";
  text?: string;
  items?: string[];
  lang?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Inline: [text](url), **bold**, `code` */
function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) {
      nodes.push(
        <a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" className="text-accent-600 underline underline-offset-2">
          {match[2]}
        </a>,
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={key++} className="font-semibold text-neutral-900">
          {match[5]}
        </strong>,
      );
    } else if (match[6]) {
      nodes.push(
        <code key={key++} className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.85em] text-accent-800 dark:bg-neutral-200/10 dark:text-accent-300">
          {match[7]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length === 1 ? nodes[0] : nodes;
}

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", text: codeLines.join("\n"), lang });
      i++;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }
  return blocks;
}
