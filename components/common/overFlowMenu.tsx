import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function OverflowMenu({
  visible,
  onClose,
  onRename,
  onDelete,
  anchorTop = 50,
  anchorRight = 16,
}: {
  visible: boolean;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
  anchorTop?: number;
  anchorRight?: number;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      {/* BACKDROP */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* MENU */}
      <View style={[styles.menu, { top: anchorTop, right: anchorRight }]}>
        <Pressable style={styles.item} onPress={onRename}>
          <Text style={styles.text}>Rename</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={onDelete}>
          <Text style={[styles.text, styles.delete]}>Delete</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    minWidth: 140,
    overflow: "hidden",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: "#111",
  },
  delete: {
    color: "#dc2626",
  },
});
