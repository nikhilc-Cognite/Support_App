import { CopyCodeBlock } from "@/components/CopyCodeBlock";

/**
 * Minimal markdown-like renderer for mock KB/Docs content.
 * Supports: ## / ### headings, ``` fenced code blocks, - bullet lists,
 * 1. numbered lists, and paragraphs. Intentionally not a full markdown
 * parser — swap for a real one (e.g. react-markdown) when article bodies
 * come from Zendesk Guide's HTML rather than mock strings.
 */
export function MarkdownBody({ content }: { content: string }) {
  const blocks = parseBlocks(content.trim());
  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        if (block.type === "h2") return <h2 key={i} id={slugify(block.text!)}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={i} id={slugify(block.text!)}>{block.text}</h3>;
        if (block.type === "code") return <CopyCodeBlock key={i} code={block.text ?? ""} language={block.lang} />;
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items!.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        if (block.type === "ol")
          return (
            <ol key={i}>
              {block.items!.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ol>
          );
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}

interface Block {
  type: "h2" | "h3" | "p" | "ul" | "ol" | "code";
  text?: string;
  items?: string[];
  lang?: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
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
    // paragraph: consume until blank line
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].startsWith("- ")) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: paraLines.join(" ") });
  }
  return blocks;
}
