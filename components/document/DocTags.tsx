import { Pressable, StyleSheet, Text, View } from "react-native";

const TAGS = ["All", "ID", "Bills", "Notes", "Others"];

export function DocTags({
  active,
  onChange,
}: {
  active: string;
  onChange: (tag: string) => void;
}) {
  return (
    <View style={styles.row}>
      {TAGS.map((tag) => (
        <Pressable
          key={tag}
          onPress={() => onChange(tag)}
          style={[styles.tag, active === tag && styles.active]}
        >
          <Text style={[styles.text, active === tag && styles.activeText]}>
            {tag}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  active: {
    backgroundColor: "#2563eb",
  },
  text: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
});
