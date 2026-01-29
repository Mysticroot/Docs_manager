import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DocFile } from "../../Services/document/documentService";

export function DocumentItem({
  item,
  selected,
  onPress,
  onLongPress,
}: {
  item: DocFile;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.file, selected && styles.selected]}
    >
      <View style={styles.textWrap}>
        <Text style={styles.person}>{item.person}</Text>
        <Text style={styles.filename}>{item.name}</Text>
      </View>

      <Image source={{ uri: item.uri }} style={styles.thumb} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  file: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  selected: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  textWrap: {
    flex: 1,
    marginRight: 10,
  },
  person: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
  },
  filename: {
    fontSize: 14,
    color: "#111",
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#000",
  },
});
