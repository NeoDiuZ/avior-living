interface RichTextNode {
  type: string;
  value?: string;
  bold?: boolean;
  italic?: boolean;
  listType?: "unordered" | "ordered";
  children?: RichTextNode[];
}

function renderInline(node: RichTextNode, key: number): React.ReactNode {
  if (node.type !== "text") return null;
  let content: React.ReactNode = node.value;
  if (node.bold) content = <strong key={key}>{content}</strong>;
  if (node.italic) content = <em key={key}>{content}</em>;
  return <span key={key}>{content}</span>;
}

function renderBlock(node: RichTextNode, key: number): React.ReactNode {
  switch (node.type) {
    case "root":
      return (
        <div key={key} className="space-y-3">
          {node.children?.map((c, i) => renderBlock(c, i))}
        </div>
      );
    case "paragraph":
      return (
        <p key={key} className="whitespace-pre-line">
          {node.children?.map((c, i) => renderInline(c, i))}
        </p>
      );
    case "list": {
      const Tag = node.listType === "ordered" ? "ol" : "ul";
      return (
        <Tag key={key} className={node.listType === "ordered" ? "list-decimal space-y-1 pl-5" : "list-disc space-y-1 pl-5"}>
          {node.children?.map((c, i) => renderBlock(c, i))}
        </Tag>
      );
    }
    case "list-item":
      return <li key={key}>{node.children?.map((c, i) => renderInline(c, i))}</li>;
    default:
      return null;
  }
}

export function ShopifyRichText({ value }: { value: string }) {
  let parsed: RichTextNode | null = null;
  try {
    parsed = JSON.parse(value);
  } catch {
    return <p className="whitespace-pre-line">{value}</p>;
  }
  if (!parsed) return null;
  return <>{renderBlock(parsed, 0)}</>;
}
