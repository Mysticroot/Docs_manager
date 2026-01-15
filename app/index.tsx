import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Docs Manager</Text>
      <Text style={styles.subtitle}>
        Store and organize your documents securely on your device
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.card}>
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
