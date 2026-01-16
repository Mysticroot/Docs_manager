import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { useState,useRef } from "react";
import { router } from "expo-router";

const TEMP_DIR = FileSystem.cacheDirectory + "temp/";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
const cameraRef = useRef<CameraView | null>(null);
const [cameraReady, setCameraReady] = useState(false);

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

      await FileSystem.makeDirectoryAsync(TEMP_DIR, {
        intermediates: true,
      });

      const tempPath = `${TEMP_DIR}scan_${Date.now()}.jpg`;

      await FileSystem.moveAsync({
        from: photo.uri,
        to: tempPath,
      });

      setPhotoUri(tempPath);
    } catch (err) {
      console.error("Capture failed:", err);
      Alert.alert("Error", "Failed to capture image");
    }
  };


  const discardPhoto = async () => {
    if (photoUri) {
      await FileSystem.deleteAsync(photoUri, { idempotent: true });
    }
    router.back();
  };

  const acceptPhoto = () => {
    Alert.alert("Ready", "Scanned document ready for processing");
    router.back();
  };

  // 🖼 Preview mode
  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.preview} />

        <View style={styles.actions}>
          <Pressable style={styles.reject} onPress={discardPhoto}>
            <Text style={styles.actionText}>Discard</Text>
          </Pressable>

          <Pressable style={styles.accept} onPress={acceptPhoto}>
            <Text style={styles.actionText}>Use Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 📷 Camera mode
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onCameraReady={() => setCameraReady(true)}
      />

      {/* Capture button OVER camera */}
      <View style={styles.captureContainer}>
        <Pressable style={styles.captureButton} onPress={takePhoto} />
      </View>
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
    backgroundColor: "#16a34a",
    borderRadius: 8,
  },
  actionText: {
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
