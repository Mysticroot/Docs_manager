import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { OverflowMenu } from "../common/overFlowMenu";

export function SelectionHeader({
  selectedCount,
  totalCount,
  allSelected,
  onToggleSelectAll,
  onDelete,
  onRename,
}: {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onDelete: () => void;
  onRename: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (selectedCount === 0) {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        {/* SELECT ALL */}
        <Pressable onPress={onToggleSelectAll} style={styles.selectAll}>
          <Ionicons
            name={allSelected ? "checkbox" : "square-outline"}
            size={20}
            color="#2563eb"
          />
          <Text style={styles.action}>Select All</Text>
        </Pressable>

        {/* RIGHT ACTION */}
        {selectedCount === 1 ? (
          <Pressable onPress={() => setMenuOpen(true)} hitSlop={16}>
            <Ionicons name="ellipsis-vertical" size={22} color="#111" />
          </Pressable>
        ) : (
          <Pressable onPress={onDelete}>
            <Text style={[styles.action, styles.delete]}>Delete</Text>
          </Pressable>
        )}
      </View>

      {/* OVERFLOW MENU */}
      <OverflowMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRename={() => {
          setMenuOpen(false);
          onRename();
        }}
        onDelete={() => {
          setMenuOpen(false);
          onDelete();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  selectAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  delete: {
    color: "#dc2626",
  },
});
