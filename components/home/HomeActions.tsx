import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { pickAndSaveDocument } from "../../Services/document/pickDocument";

export function HomeActions() {
  return (
    <View style={styles.actions}>
      {/* Upload */}
      <Pressable style={styles.card} onPress={pickAndSaveDocument}>
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
  );
}

const styles = StyleSheet.create({
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
