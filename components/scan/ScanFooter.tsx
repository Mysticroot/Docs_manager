import { Pressable, StyleSheet, Text, View } from "react-native";

export function ScanFooter({
  onDiscard,
  onContinue,
}: {
  onDiscard: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.actions}>
      <Pressable style={styles.reject} onPress={onDiscard}>
        <Text style={styles.text}>Discard</Text>
      </Pressable>

      <Pressable style={styles.accept} onPress={onContinue}>
        <Text style={styles.text}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#111",
  },
  reject: { padding: 14, backgroundColor: "#dc2626", borderRadius: 8 },
  accept: { padding: 14, backgroundColor: "#2563eb", borderRadius: 8 },
  text: { color: "#fff", fontWeight: "600" },
});
