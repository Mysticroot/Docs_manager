import { CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

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

// ---------------- TYPES ----------------
type ScannedDoc = {
  uri: string;
  name: string;
  docType: string;
  dob?: string | null;
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);
  const currentDoc = useRef<ScannedDoc | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [capturedDocs, setCapturedDocs] = useState<ScannedDoc[]>([]);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <Pressable onPress={requestPermission}>
          <Text style={styles.link}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // ---------------- TAKE PHOTO ----------------
  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady) {
      Alert.alert("Camera not ready");
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });

      if (!TEMP_DIR.exists) {
        await TEMP_DIR.create({ intermediates: true });
      }

      const tempFile = new File(TEMP_DIR, `scan_${Date.now()}.jpg`);
      await new File(photo.uri).move(tempFile);

      setPhotoUri(tempFile.uri);

      if (MlkitOcr) {
        const result = await MlkitOcr.recognizeText(tempFile.uri);
        console.log(result);

        const cleaned = cleanOCRText(result.text);
        setRecognizedText(cleaned);
        console.log(cleaned);

        const name = extractName(cleaned) ?? "Unknown";
        const docType = detectDocumentType(cleaned) ?? "other";
        console.log(docType);

        const dob = extractDOB(cleaned);

        currentDoc.current = {
          uri: tempFile.uri,
          name,
          docType,
          dob,
        };
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to capture image");
    }
  };

  // ---------------- DISCARD ----------------
  const discardPhoto = async () => {
    if (photoUri) {
      const f = new File(photoUri);
      if (f.exists) await f.delete();
    }
    currentDoc.current = null;
    setPhotoUri(null);
    setRecognizedText("");
  };

  // ---------------- CONTINUE ----------------
  const continueScan = () => {
    const doc = currentDoc.current;
    if (!doc) return;

    setCapturedDocs((prev) => [...prev, doc]);

    currentDoc.current = null;
    setPhotoUri(null);
    setRecognizedText("");
  };

  // ---------------- DONE (FINAL SAVE) ----------------
  const doneScanning = async () => {
    try {
      if (!BASE_DIR.exists) {
        await BASE_DIR.create({ intermediates: true });
      }

      for (const doc of capturedDocs) {
        // 🧠 PERSON FOLDER (FIRST NAME)
        const personName = doc.name?.trim()
          ? doc.name
              .trim()
              .split(/\s+/)[0]
              .replace(/[^a-zA-Z]/g, "")
          : "Unknown";

        const personFolder = new Directory(BASE_DIR, personName);

        // ✅ Create only if not exists
        if (!personFolder.exists) {
          await personFolder.create({ intermediates: true });
        }

        // 🧾 FILE NAME (DOC TYPE BASED)
        const year = doc.dob?.split("/")?.[2] ?? "NA";
        const docType = doc.docType || "Other";

        const finalName = `${docType}_${personName}_${year}_${Date.now()}.jpg`;

        const finalFile = new File(personFolder, finalName);
        const tempFile = new File(doc.uri);

        if (tempFile.exists) {
          await tempFile.move(finalFile);
        }
      }

      Alert.alert(
        "Saved",
        `${capturedDocs.length} document(s) saved under person folders`,
      );

      // 🧹 RESET STATE
      setCapturedDocs([]);
      setPhotoUri(null);
      setRecognizedText("");
      currentDoc.current = null;

      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save documents");
    }
  };
  

  // ---------------- PREVIEW ----------------
  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.preview} />

        <View style={styles.actions}>
          <Pressable style={styles.reject} onPress={discardPhoto}>
            <Text style={styles.actionText}>Discard</Text>
          </Pressable>

          <Pressable style={styles.accept} onPress={continueScan}>
            <Text style={styles.actionText}>Continue</Text>
          </Pressable>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View>
      </View>
    );
  }

  // ---------------- CAMERA ----------------
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.captureContainer}>
        <Pressable style={styles.captureButton} onPress={takePhoto} />
      </View>

      {capturedDocs.length > 0 && (
        <Image
          source={{ uri: capturedDocs[capturedDocs.length - 1].uri }}
          style={styles.thumbnail}
        />
      )}

      {capturedDocs.length > 0 && (
        <Pressable style={styles.doneButton} onPress={doneScanning}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
  },
  previewContainer: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, resizeMode: "contain" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#111",
  },
  reject: { padding: 14, backgroundColor: "#dc2626", borderRadius: 8 },
  accept: { padding: 14, backgroundColor: "#2563eb", borderRadius: 8 },
  actionText: { color: "#fff", fontWeight: "600" },
  thumbnail: {
    position: "absolute",
    bottom: 40,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  doneButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  doneText: { color: "#fff", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  link: { color: "#2563eb", marginTop: 10, fontWeight: "600" },
  textContainer: { padding: 20, backgroundColor: "#000" },
  recognizedText: { color: "#fff", fontSize: 16 },
});
