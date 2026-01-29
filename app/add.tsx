import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { StyleSheet,Pressable } from "react-native";
import { ScanCamera } from "../components/scan/ScanCamera";
import { ScanPreview } from "../components/scan/ScanPreview";
import {
  captureAndProcess,
  saveDocs,
  ScannedDoc,
} from "../Services/Service.Scan/scanService";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [currentDoc, setCurrentDoc] = useState<ScannedDoc | null>(null);
  const [capturedDocs, setCapturedDocs] = useState<ScannedDoc[]>([]);

  if (!permission || !permission.granted) {
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
    if (!cameraRef.current || !cameraReady) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      skipProcessing: true,
    });

    const { doc, text } = await captureAndProcess(photo.uri);
    setPhotoUri(doc.uri);
    setCurrentDoc(doc);
    setRecognizedText(text);
  };

  const discard = () => {
    setPhotoUri(null);
    setCurrentDoc(null);
    setRecognizedText("");
  };

  const continueScan = () => {
    if (!currentDoc) return;
    setCapturedDocs((p) => [...p, currentDoc]);
    discard();
  };

  const done = async () => {
    await saveDocs(capturedDocs);

    Alert.alert("Saved", "Documents saved");

    // 🔥 RESET ALL SCAN STATE
    setCapturedDocs([]);
    setPhotoUri(null);
    setRecognizedText("");
    setCurrentDoc(null);

    // 🔥 OPTIONAL but recommended
    cameraRef.current = null;

    // Navigate AFTER reset
    router.replace("/");
  };


  if (photoUri && currentDoc) {
    return (
      <ScanPreview
        uri={photoUri}
        text={recognizedText}
        onDiscard={discard}
        onContinue={continueScan}
      />
    );
  }

  return (
    <ScanCamera
      cameraRef={cameraRef}
      onReady={() => setCameraReady(true)}
      onCapture={takePhoto}
      lastThumbnailUri={
        capturedDocs.length > 0
          ? capturedDocs[capturedDocs.length - 1].uri
          : null
      }
      showDone={capturedDocs.length > 0}
      onDone={done}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  link: { color: "#2563eb", marginTop: 10, fontWeight: "600" },
});