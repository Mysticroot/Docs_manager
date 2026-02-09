import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { pickAndSaveDocument } from "../../Services/document/pickDocument";

export function FloatingScanButton() {
  return (
    <View style={styles.fab}>
      {/* SCAN */}
      <Pressable
        style={[styles.action, styles.left]}
        onPress={() => router.push("/add")}
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
      >
        <Ionicons name="camera" size={24} color="#fff" />
      </Pressable>

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* UPLOAD */}
      <Pressable
        style={[styles.action, styles.right]}
        onPress={pickAndSaveDocument}
        android_ripple={{ color: "rgba(255,255,255,0.15)" }}
      >
        <Ionicons name="image" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#ea580c",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    elevation: 6,
    overflow: "hidden", // 🔥 needed for ripple clipping
  },

  action: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  left: {
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
  },

  right: {
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },

  divider: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});
