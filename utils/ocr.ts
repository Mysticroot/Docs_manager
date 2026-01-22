// utils/ocr.ts
export function cleanOCRText(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) => l.length > 2 && !/(http|www|google|pdf|eng|in|px|dpi)/i.test(l),
    )
    .join("\n");
}
