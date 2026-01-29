import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import {
  loadDocuments,
  deleteDocuments,
  renameDocument,
  DocFile,
} from "../Services/document/documentService";

import { SelectionHeader } from "../components/document/SelectionHeader";
import { DocumentItem } from "../components/document/DocumentItem";
import { DocumentPreview } from "../components/document/DocumentPreview";
import { RenameModal } from "../components/document/RenameModal";

export default function SearchScreen() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [preview, setPreview] = useState<DocFile | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Rename modal
  const [renameVisible, setRenameVisible] = useState(false);
  const [renameUri, setRenameUri] = useState<string | null>(null);

  /* ---------- DERIVED STATE ---------- */

  const selectionMode = selected.size > 0;
  const allSelected = files.length > 0 && selected.size === files.length;

  /* ---------- LOAD ---------- */

  const refresh = async () => {
    setFiles(await loadDocuments());
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  /* ---------- SELECTION ---------- */

  const toggleSelect = (uri: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(uri) ? next.delete(uri) : next.add(uri);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(files.map((f) => f.uri)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  /* ---------- ACTIONS ---------- */

  const deleteSelected = () => {
    Alert.alert("Delete documents?", `Delete ${selected.size} document(s)?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDocuments(selected);
          clearSelection();
          refresh();
        },
      },
    ]);
  };

  const openRename = () => {
    const uri = Array.from(selected)[0];
    setRenameUri(uri);
    setRenameVisible(true);
  };

  const submitRename = async (newName: string) => {
    if (!renameUri) return;

    await renameDocument(renameUri, newName);
    setRenameVisible(false);
    setRenameUri(null);
    clearSelection();
    refresh();
  };

  /* ---------- PREVIEW ---------- */

  if (preview) {
    return <DocumentPreview doc={preview} onClose={() => setPreview(null)} />;
  }

  return (
    <View style={styles.container}>
      <SelectionHeader
        selectionMode={selectionMode}
        selectedCount={selected.size}
        totalCount={files.length}
        allSelected={allSelected}
        onToggleSelectAll={toggleSelectAll}
        onDelete={deleteSelected}
        onRename={openRename}
      />

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <DocumentItem
            item={item}
            selected={selected.has(item.uri)}
            onLongPress={() => {
              setSelected(new Set([item.uri]));
            }}
            onPress={() => {
              if (selectionMode) {
                toggleSelect(item.uri);
              } else {
                setPreview(item);
              }
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No documents found</Text>
        }
      />

      {/* RENAME MODAL */}
      <RenameModal
        visible={renameVisible}
        initialName={renameUri ? (renameUri.split("/").pop() ?? "") : ""}
        onCancel={() => {
          setRenameVisible(false);
          setRenameUri(null);
        }}
        onSubmit={submitRename}
      />
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
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
});
