type PortableTextBlock = {
  _type: string;
  children?: { text?: string }[];
};

/**
 * Sanity's `body` fields (e.g. on `sermon`) are portable text — an array of
 * rich-text blocks, not plain strings. This flattens each block to its
 * plain text for simple paragraph rendering. For genuinely rich formatting
 * (bold, links, lists) later, swap this for `@portabletext/react` instead —
 * this is intentionally the lightweight version for now.
 */
export function blocksToParagraphs(blocks: PortableTextBlock[] | undefined | null): string[] {
  if (!blocks) return [];
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c) => c.text || "").join(""))
    .filter((text) => text.trim().length > 0);
}
