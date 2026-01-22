import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { cleanOCRText } from "../utils/ocr";
import { detectDocumentType, extractName, extractDOB } from "../utils/extract";

// ---------------- OCR ----------------
let MlkitOcr: any = null;
try {
  MlkitOcr = require("rn-mlkit-ocr").default;
} catch {
  console.warn("OCR disabled. Build with expo-dev-client.");
}

// ---------------- DIRECTORIES ----------------
const TEMP_DIR = new Directory(Paths.cache, "temp");
const BASE_DIR = new Directory(Paths.document, "DocsManager");

export default function HomeScreen() {
  const ensureDir = async (dir: Directory) => {
    if (!dir.exists) {
      await dir.create({ intermediates: true });
    }
  };

  // ---------------- PICK DOCUMENT ----------------
  const pickDocument = async () => {
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

      // ---------------- OCR (IMAGES ONLY) ----------------
      let cleanedText = "";
      let name = "Unknown";
      let docType = "Other";
      let dob: string | null = null;

      if (MlkitOcr && file.mimeType?.startsWith("image/")) {
        const result = await MlkitOcr.recognizeText(tempFile.uri);
        cleanedText = cleanOCRText(result.text);

        name = extractName(cleanedText) ?? "Unknown";
        docType = detectDocumentType(cleanedText);
        dob = extractDOB(cleanedText);
      }

      // ---------------- FINAL SAVE ----------------
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
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Docs Manager</Text>
      <Text style={styles.subtitle}>
        Store and organize your documents securely on your device
      </Text>

      <View style={styles.actions}>
        {/* Upload */}
        <Pressable style={styles.card} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={34} color="#2563eb" />
          <Text style={styles.cardTitle}>Upload Document</Text>
          <Text style={styles.cardSubtitle}>Choose a file from your phone</Text>
        </Pressable>

        {/* Scan */}
        <Pressable style={styles.card} onPress={() => router.push("/add")}>
          <Ionicons name="scan-outline" size={34} color="#16a34a" />
          <Text style={styles.cardTitle}>Scan Document</Text>
          <Text style={styles.cardSubtitle}>Scan using your camera</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 48,
  },
  actions: {
    gap: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
});
