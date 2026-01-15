import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const APP_DIR = FileSystem.documentDirectory + "DocsManager/";

export default function HomeScreen() {
  const ensureAppDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(APP_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(APP_DIR, {
        intermediates: true,
      });
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      await ensureAppDirExists();

      const newPath = APP_DIR + file.name;

      await FileSystem.copyAsync({
        from: file.uri,
        to: newPath,
      });

      Alert.alert("Saved", `Document saved locally:\n${file.name}`);

      console.log("Saved to:", newPath);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save document");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Docs Manager</Text>
      <Text style={styles.subtitle}>
        Store and organize your documents securely on your device
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.card} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={34} color="#2563eb" />
          <Text style={styles.cardTitle}>Upload Document</Text>
          <Text style={styles.cardSubtitle}>Choose a file from your phone</Text>
        </Pressable>

        <Pressable style={styles.card}>
          <Ionicons name="scan-outline" size={34} color="#16a34a" />
          <Text style={styles.cardTitle}>Scan Document</Text>
          <Text style={styles.cardSubtitle}>Scan using your camera</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
