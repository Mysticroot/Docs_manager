import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";

export function RenameModal({
  visible,
  initialName,
  onCancel,
  onSubmit,
}: {
  visible: boolean;
  initialName: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  const [value, setValue] = useState(initialName);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Rename document</Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            style={styles.input}
            autoFocus
          />

          <View style={styles.actions}>
            <Pressable onPress={onCancel}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (value.trim()) onSubmit(value.trim());
              }}
            >
              <Text style={styles.save}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  cancel: {
    color: "#6b7280",
    fontWeight: "600",
  },
  save: {
    color: "#2563eb",
    fontWeight: "700",
  },
});
