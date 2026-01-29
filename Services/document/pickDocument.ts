import * as DocumentPicker from "expo-document-picker";
import { File, Directory } from "expo-file-system";
import { Alert } from "react-native";

import { cleanOCRText } from "../../utils/ocr";
import {
  detectDocumentType,
  extractDOB,
  extractName,
} from "../../utils/extract";
import { BASE_DIR, TEMP_DIR, ensureDir } from "./storage";

// OCR (optional dev-client)
let MlkitOcr: any = null;
try {
  MlkitOcr = require("rn-mlkit-ocr").default;
} catch {}

export async function pickAndSaveDocument() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    await ensureDir(TEMP_DIR);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const tempFile = new File(TEMP_DIR, `${Date.now()}_${safeName}`);
    await new File(file.uri).copy(tempFile);

    // OCR (images only)
    let name = "Unknown";
    let docType = "Other";
    let dob: string | null = null;

    if (MlkitOcr && file.mimeType?.startsWith("image/")) {
      const result = await MlkitOcr.recognizeText(tempFile.uri);
      const cleaned = cleanOCRText(result.text);

      name = extractName(cleaned) ?? "Unknown";
      docType = detectDocumentType(cleaned);
      dob = extractDOB(cleaned);
    }

    await ensureDir(BASE_DIR);

    const folder = new Directory(BASE_DIR, docType);
    await ensureDir(folder);

    const year = dob?.split("/")?.[2] ?? "NA";
    const safePerson = name.replace(/\s+/g, "_");
    const extension = file.mimeType === "application/pdf" ? "pdf" : "jpg";

    const finalName = `${safePerson}_${docType}_${year}.${extension}`;
    const finalFile = new File(folder, finalName);

    await tempFile.move(finalFile);

    Alert.alert("Saved", `Document saved under\n${docType}/${finalName}`);
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    Alert.alert("Error", err.message || "Failed to save document");
  }
}
