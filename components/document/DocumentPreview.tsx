import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { DocFile } from "../../Services/document/documentService";

export function DocumentPreview({
  doc,
  onClose,
}: {
  doc: DocFile;
  onClose: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.title}>
          {doc.person} / {doc.name}
        </Text>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <Image source={{ uri: doc.uri }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 48,
  },

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

  close: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "700",
  },

  image: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: "#000",
  },
});
