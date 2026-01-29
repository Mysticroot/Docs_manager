import { CameraView } from "expo-camera";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  cameraRef: any;
  onReady: () => void;
  onCapture: () => void;

  /** optional UI helpers */
  lastThumbnailUri?: string | null;
  showDone?: boolean;
  onDone?: () => void;
};

export function ScanCamera({
  cameraRef,
  onReady,
  onCapture,
  lastThumbnailUri = null,
  showDone = false,
  onDone,
}: Props) {
  return (
    <View style={styles.container}>
      {/* CAMERA */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        onCameraReady={onReady}
      />

      {/* CAPTURE BUTTON */}
      <View style={styles.captureContainer}>
        <Pressable style={styles.captureButton} onPress={onCapture} />
      </View>

      {/* LAST CAPTURE THUMBNAIL */}
      {lastThumbnailUri ? (
        <Image source={{ uri: lastThumbnailUri }} style={styles.thumbnail} />
      ) : null}

      {/* DONE BUTTON */}
      {showDone && onDone ? (
        <View style={styles.doneContainer}>
          <Pressable style={styles.doneButton} onPress={onDone}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },

  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
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
    zIndex: 10,
  },

  doneContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 20, // VERY IMPORTANT
  },

  doneButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  doneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
