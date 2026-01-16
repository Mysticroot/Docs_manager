import { CameraView, useCameraPermissions } from "expo-camera";
import { Directory, File, Paths } from "expo-file-system";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

const TEMP_DIR = new Directory(Paths.cache, "temp");

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

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

  // 📸 Take photo
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
        TEMP_DIR.create({
          intermediates: true,
        });
      }

      const tempFile = new File(TEMP_DIR, `scan_${Date.now()}.jpg`);
      const sourceFile = new File(photo.uri);
      
      await sourceFile.move(tempFile);

      setPhotoUri(tempFile.uri);
    } catch (err) {
      console.error("Capture failed:", err);
      Alert.alert("Error", "Failed to capture image");
    }
  };

  // ❌ Discard → delete temp → back to camera
  const discardPhoto = async () => {
    if (photoUri) {
      const file = new File(photoUri);
      if (file.exists) {
        await file.delete();
      }
    }
    setPhotoUri(null);
  };

  // ➕ Continue → save temp → back to camera
  const continueScan = () => {
    if (!photoUri) return;

    setCapturedImages((prev) => [...prev, photoUri]);
    setPhotoUri(null);
  };

  // ✅ Done → alert count → reset session
  const doneScanning = () => {
    Alert.alert(
      "Done",
      `${capturedImages.length} document(s) ready for processing`
    );

    // Reset scan session (camera ready for next time)
    setCapturedImages([]);
    setPhotoUri(null);

    router.replace("/");
  };

  // 🖼 PREVIEW MODE — ALWAYS for any capture
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
      </View>
    );
  }

  // 📷 CAMERA MODE
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onCameraReady={() => setCameraReady(true)}
      />

      {/* Capture button */}
      <View style={styles.captureContainer}>
        <Pressable style={styles.captureButton} onPress={takePhoto} />
      </View>

      {/* Thumbnail preview (last accepted scan) */}
      {capturedImages.length > 0 && (
        <Image
          source={{ uri: capturedImages[capturedImages.length - 1] }}
          style={styles.thumbnail}
        />
      )}

      {/* Done button (enabled after ≥1 Continue) */}
      {capturedImages.length > 0 && (
        <Pressable style={styles.doneButton} onPress={doneScanning}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

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

  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  preview: {
    flex: 1,
    resizeMode: "contain",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#111",
  },

  reject: {
    padding: 14,
    backgroundColor: "#dc2626",
    borderRadius: 8,
  },

  accept: {
    padding: 14,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
  },

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

  doneText: {
    color: "#fff",
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  link: {
    color: "#2563eb",
    marginTop: 10,
    fontWeight: "600",
  },
});
