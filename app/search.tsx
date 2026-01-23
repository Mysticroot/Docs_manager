import {  useState } from "react";
import { useFocusEffect } from "expo-router";
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
import { useLocalSearchParams } from "expo-router";

const BASE_DIR = FileSystem.documentDirectory + "DocsManager/";

type DocFile = {
  uri: string;
  name: string;
  person: string;
};

export default function SearchScreen() {
  const { refresh } = useLocalSearchParams();

  const [files, setFiles] = useState<DocFile[]>([]);
  const [preview, setPreview] = useState<DocFile | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  /* ---------------- LOAD DOCUMENTS ---------------- */

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

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, []),
  );


  /* ---------------- SELECTION HELPERS ---------------- */

  const toggleSelect = (uri: string) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(uri) ? copy.delete(uri) : copy.add(uri);
      return copy;
    });
  };

  const selectAll = () => {
    setSelected(new Set(files.map((f) => f.uri)));
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectionMode(false);
  };

  const deleteSelected = async () => {
    Alert.alert("Delete selected?", `Delete ${selected.size} document(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          for (const uri of selected) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
          }

          clearSelection();
          setPreview(null);
          loadDocuments();
        },
      },
    ]);
  };

  /* ---------------- LIST ITEM ---------------- */

  const renderItem = ({ item }: { item: DocFile }) => {
    const isSelected = selected.has(item.uri);

    return (
      <Pressable
        onLongPress={() => {
          setSelectionMode(true);
          setSelected(new Set([item.uri]));
        }}
        onPress={() => {
          if (selectionMode) {
            toggleSelect(item.uri);
          } else {
            setPreview(item);
          }
        }}
        style={[styles.file, isSelected && styles.selectedFile]}
      >
        <Text style={styles.person}>{item.person}</Text>
        <Text style={styles.filename}>{item.name}</Text>
      </Pressable>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <Pressable onPress={selectAll}>
              <Text style={styles.action}>Select All</Text>
            </Pressable>

            <Pressable onPress={deleteSelected}>
              <Text style={[styles.action, styles.delete]}>Delete</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.title}>Documents</Text>
        )}
      </View>

      {/* LIST */}
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

      {/* PREVIEW */}
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

          {preview.uri.toLowerCase().endsWith(".pdf") ? (
            <View style={styles.pdfFallback}>
              <Text style={styles.pdfText}>PDF preview not available</Text>
            </View>
          ) : (
            <Image source={{ uri: preview.uri }} style={styles.previewImage} />
          )}
        </View>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

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

  action: {
    fontSize: 14,
    fontWeight: "600",
    padding: 8,
    color: "#2563eb",
  },

  delete: {
    color: "#dc2626",
  },

  file: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  selectedFile: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#2563eb",
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
  },

  pdfText: {
    color: "#fff",
    fontSize: 16,
  },
});
