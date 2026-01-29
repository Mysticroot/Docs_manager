import { StyleSheet, Text } from "react-native";

export function HomeHeader() {
  return (
    <>
      <Text style={styles.title}>Docs Manager</Text>
      <Text style={styles.subtitle}>
        Store and organize your documents securely on your device
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
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
});
