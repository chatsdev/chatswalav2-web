/* eslint-disable @typescript-eslint/no-explicit-any */
import TurndownService from "turndown";

const createTurndownService = () => {
  const turndown = new TurndownService({
    emDelimiter: "_",
    bulletListMarker: "-",
  });

  turndown.escape = (text) => text;

  turndown.addRule("bold", {
    filter: ["strong", "b"],
    replacement: (content) => (content.trim() ? `*${content}*` : ""),
  });

  turndown.addRule("strikethrough", {
    filter: ["s", "del"],
    replacement: (content) => (content.trim() ? `~${content}~` : ""),
  });

  turndown.addRule("underline", {
    filter: ["u"],
    replacement: (content) => content,
  });

  turndown.addRule("paragraph", {
    filter: "p",
    replacement: (content) => {
      const trimmed = content.trim();
      return trimmed ? `${trimmed}\n` : "";
    },
  });

  return turndown;
};

const turndownService = createTurndownService();

/**
 * Converts HTML (e.g. from CKEditor) to WhatsApp Markdown format (*bold*, _italic_, ~strike~).
 */
export const htmlToWhatsApp = (html: string): string => {
  if (!html) return "";
  const processed = html.replace(/&nbsp;/g, " ");

  if (!/<[a-z][\s\S]*>/i.test(processed)) {
    return processed.replace(/\*\*([^\*\n]+)\*\*/g, "*$1*").trim();
  }

  let result = turndownService.turndown(processed);
  result = result.replace(/\*\*([^\*\n]+)\*\*/g, "*$1*");
  return result.trim();
};

/**
 * Converts WhatsApp Markdown format (*bold*, _italic_, ~strike~, ```code```) or plain text to clean HTML.
 */
export const whatsAppToHtml = (text: string): string => {
  if (!text) return "";

  let content = text;
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  // Normalize legacy double-asterisks **bold** to *bold*
  content = content.replace(/\*\*([^\*\n]+)\*\*/g, "*$1*");

  // Convert WhatsApp markdown symbols to HTML tags
  // Bold: *text* -> <strong>text</strong>
  content = content.replace(/\*([^\*\n]+)\*/g, "<strong>$1</strong>");
  // Italic: _text_ -> <em>text</em>
  content = content.replace(/_([^_\n]+)_/g, "<em>$1</em>");
  // Strikethrough: ~text~ -> <s>text</s>
  content = content.replace(/~([^~\n]+)~/g, "<s>$1</s>");
  // Monospace: ```text``` -> <code>text</code>
  content = content.replace(/```([^`]+)```/g, "<code>$1</code>");

  if (isHtml) {
    return content;
  }

  // Format line breaks for plain text/markdown input into HTML paragraphs/breaks
  const paragraphs = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => (line ? `<p>${line}</p>` : "<p><br></p>"))
    .join("");

  return paragraphs || `<p>${content}</p>`;
};

export const resolveTemplateVariables = (
  text: string,
  variables_example?: { key: string; example: string }[]
): string => {
  if (!text) return "";
  let result = text;

  if (Array.isArray(variables_example)) {
    variables_example.forEach((v: any) => {
      if (v?.key !== undefined) {
        const escapedKey = String(v.key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(
          new RegExp(`\\{\\{${escapedKey}\\}\\}`, "g"),
          v.example || `{{${v.key}}}`
        );
      }
    });
  }

  return result;
};

/**
 * Formats template body for rich live preview, supporting HTML from CKEditor as well as WhatsApp markdown.
 */
export const formatTemplateBodyHtml = (
  messageBody: string,
  variables_example: { key: string; example: string }[] = []
): string => {
  if (!messageBody) return "Type your message here...";

  // 1. Substitute variables
  const text = resolveTemplateVariables(messageBody, variables_example);

  // 2. Convert to HTML
  const html = whatsAppToHtml(text);

  return html.trim() || "Type your message here...";
};

/**
 * Clean text summary for template list cards.
 */
export const formatTemplateCardSummary = (
  messageBody?: string,
  variables_example?: { key: string; example: string }[]
): string => {
  if (!messageBody) return "";

  const text = resolveTemplateVariables(messageBody, variables_example);
  return whatsAppToHtml(text);
};

