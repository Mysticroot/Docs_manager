// utils/extract.ts

export function detectDocumentType(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("government of india") && t.match(/\d{4}\s\d{4}\s\d{4}/))
    return "Aadhaar";

  if (t.includes("income tax") || t.includes("permanent account")) return "PAN";

  if (t.includes("electricity") || t.includes("bill")) return "Bill";

  return "Other";
}


export function extractName(text: string): string | null {
  const lines = text.split("\n");
  return lines.find((l) => /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l)) || null;
}

export function extractDOB(text: string): string | null {
  return text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || null;
}

export function extractAadhaar(text: string): string | null {
  return text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || null;
}
