import { TECH_KEYWORDS } from "./tech-keywords";

//creating a cache for the regex
let cachedRegex: RegExp | null = null;

// Create a case-insensitive regex pattern for matching tech keywords
export function createTechRegex(): RegExp {
    if (cachedRegex) return cachedRegex;
    const escapedKeywords = TECH_KEYWORDS.map((keyword) =>
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  // Sort by length descending to match longer phrases first (e.g., "React Native" before "React")
  escapedKeywords.sort((a, b) => b.length - a.length);
  cachedRegex = new RegExp(
    `(?<![A-Za-z0-9_])(${escapedKeywords.join("|")})(?![A-Za-z0-9_])`,
    "gi"
  );
  return cachedRegex;
}

// Parse text and return array of segments (text or bold tech words)
export function parseTextWithTechKeywords(
  text: string
): Array<{ text: string; isTech: boolean }> {
  if (!text) return [];

  const regex = createTechRegex();
  const segments: Array<{ text: string; isTech: boolean }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isTech: false,
      });
    }
    // Add the tech keyword
    segments.push({
      text: match[0],
      isTech: true,
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isTech: false,
    });
  }

  return segments;
}
