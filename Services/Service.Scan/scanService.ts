import { Directory, File, Paths } from "expo-file-system";
import { cleanOCRText } from "../../utils/ocr";
import {
  detectDocumentType,
  extractDOB,
  extractName,
} from "../../utils/extract";

// OCR
let MlkitOcr: any = null;
try {
  MlkitOcr = require("rn-mlkit-ocr").default;
} catch {}

export const TEMP_DIR = new Directory(Paths.cache, "temp");
export const BASE_DIR = new Directory(Paths.document, "DocsManager");

export type ScannedDoc = {
  uri: string;
  name: string;
  docType: string;
  dob?: string | null;
};

export async function captureAndProcess(uri: string) {
  if (!TEMP_DIR.exists) {
    await TEMP_DIR.create({ intermediates: true });
  }

  const tempFile = new File(TEMP_DIR, `scan_${Date.now()}.jpg`);
  await new File(uri).move(tempFile);

  let doc: ScannedDoc = {
    uri: tempFile.uri,
    name: "Unknown",
    docType: "Other",
    dob: null,
  };

  let text = "";

  if (MlkitOcr) {
    const result = await MlkitOcr.recognizeText(tempFile.uri);
    text = cleanOCRText(result.text);

    doc.name = extractName(text) ?? "Unknown";
    doc.docType = detectDocumentType(text) ?? "Other";
    doc.dob = extractDOB(text);
  }

  return { doc, text };
}

export async function saveDocs(docs: ScannedDoc[]) {
  if (!BASE_DIR.exists) {
    await BASE_DIR.create({ intermediates: true });
  }

  for (const doc of docs) {
    const person =
      doc.name
        ?.trim()
        ?.split(/\s+/)[0]
        ?.replace(/[^a-zA-Z]/g, "") || "Unknown";

    const personDir = new Directory(BASE_DIR, person);
    if (!personDir.exists) {
      await personDir.create({ intermediates: true });
    }

    const year = doc.dob?.split("/")?.[2] ?? "NA";
    const name = `${doc.docType}_${person}_${year}_${Date.now()}.jpg`;

    await new File(doc.uri).move(new File(personDir, name));
  }
}
