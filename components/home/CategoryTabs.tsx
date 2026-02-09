import { Pressable, StyleSheet, Text, View } from "react-native";

const TABS = ["All Docs", "Work", "Tax"];

export function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.row}>
      {TABS.map((t) => (
        <Pressable
          key={t}
          onPress={() => onChange(t)}
          style={[styles.tab, active === t && styles.active]}
        >
          <Text style={[styles.text, active === t && styles.activeText]}>
            {t}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  tab: {
    marginRight: 16,
    paddingBottom: 6,
  },
  active: {
    borderBottomWidth: 2,
    borderColor: "#2563eb",
  },
  text: {
    color: "#6b7280",
    fontWeight: "600",
  },
  activeText: {
    color: "#111",
  },
});
