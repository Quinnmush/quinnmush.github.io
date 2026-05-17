export function stripMarkdown(md: string): string {
  let text = md;

  // 1. Fenced code blocks (must be first — multiline)
  text = text.replace(/```[\s\S]*?```/g, ' ');

  // 2. Inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // 3. Images (keep alt text)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 4. Links (keep text)
  text = text.replace(/\[([^\]]*)\]\([^)]+\)/g, '$1');

  // 5. HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // 6. Headings
  text = text.replace(/^#{1,6}\s+/gm, '');

  // 7. Horizontal rules (before bold/italic — *** conflicts)
  text = text.replace(/^[-*_]{3,}$/gm, ' ');

  // 8. Blockquotes
  text = text.replace(/^>\s?/gm, '');

  // 9. List markers
  text = text.replace(/^[\s]*[-*+]\s/gm, '');
  text = text.replace(/^\d+\.\s/gm, '');

  // 10. Bold / italic / strikethrough
  text = text.replace(/\*{1,3}([^*]+?)\*{1,3}/g, '$1');
  text = text.replace(/_{1,3}([^_]+?)_{1,3}/g, '$1');
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // 11. Collapse whitespace
  text = text.replace(/\n\s*\n/g, ' ');
  text = text.replace(/\s+/g, ' ');

  return text.trim();
}
