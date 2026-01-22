import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";

const BASE_DIR = FileSystem.documentDirectory + "DocsManager/";

type DocFile = {
  uri: string;
  name: string;
  person: string;
};

export default function SearchScreen() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [preview, setPreview] = useState<DocFile | null>(null);

  // 📂 Load documents
  const loadDocuments = async () => {
    const baseInfo = await FileSystem.getInfoAsync(BASE_DIR);
    if (!baseInfo.exists) {
      setFiles([]);
      return;
    }

    const persons = await FileSystem.readDirectoryAsync(BASE_DIR);
    const collected: DocFile[] = [];

    for (const person of persons) {
      const personPath = BASE_DIR + person + "/";
      const docs = await FileSystem.readDirectoryAsync(personPath);

      for (const doc of docs) {
        collected.push({
          uri: personPath + doc,
          name: doc,
          person,
        });
      }
    }

    setFiles(collected);
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // 🧹 Clear all documents
  const clearAllDocuments = () => {
    Alert.alert(
      "Clear all documents?",
      "This will permanently delete all saved documents.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const baseInfo = await FileSystem.getInfoAsync(BASE_DIR);
              if (baseInfo.exists) {
                await FileSystem.deleteAsync(BASE_DIR, {
                  idempotent: true,
                });
              }

              setFiles([]);
              setPreview(null);
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to clear documents");
            }
          },
        },
      ],
    );
  };

  // 📄 Render list item
  const renderItem = ({ item }: { item: DocFile }) => (
    <Pressable style={styles.file} onPress={() => setPreview(item)}>
      <Text style={styles.person}>{item.person}</Text>
      <Text style={styles.filename}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Documents</Text>

        {!preview && files.length > 0 && (
          <Pressable onPress={clearAllDocuments}>
            <Text style={styles.clear}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* 📃 LIST */}
      {!preview && (
        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No documents found</Text>
          }
        />
      )}

      {/* 👁️ INLINE PREVIEW */}
      {preview && (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {preview.person} / {preview.name}
            </Text>

            <Pressable onPress={() => setPreview(null)}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {/* Image preview only (Expo Go safe) */}
          {preview.uri.toLowerCase().endsWith(".pdf") ? (
            <View style={styles.pdfFallback}>
              <Text style={styles.pdfText}>PDF preview not supported here</Text>
              <Text style={styles.pdfTextSmall}>
                Use Expo Dev Client to enable PDF preview
              </Text>
            </View>
          ) : (
            <Image source={{ uri: preview.uri }} style={styles.previewImage} />
          )}
        </View>
      )}
    </View>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 48, // ✅ FIX: pushes content below status bar
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  clear: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 8, // ✅ better touch area
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

 

  file: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  person: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
  },

  filename: {
    fontSize: 14,
    color: "#111",
    marginTop: 2,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },

  /* PREVIEW */

  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },

  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#111",
  },

  previewTitle: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },

  close: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "700",
  },

  previewImage: {
    flex: 1,
    resizeMode: "contain",
    backgroundColor: "#000",
  },

  pdfFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  pdfText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },

  pdfTextSmall: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
  },
});
