import { StyleSheet, Text, View } from "react-native";

export function HomeTopBar() {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>Docs Manager</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
});
