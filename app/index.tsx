import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

import { CategoryTabs } from "../components/home/CategoryTabs";
import { FloatingScanButton } from "../components/home/FloatingScanButton";
import { HomeTopBar } from "../components/home/HomeTopBar";

import { DocumentItem } from "../components/document/DocumentItem";
import { DocumentPreview } from "../components/document/DocumentPreview";
import { SelectionHeader } from "../components/document/SelectionHeader";

import {
  deleteDocuments,
  DocFile,
  loadDocuments,
  renameDocument,
} from "../Services/document/documentService";
import { RenameModal } from "@/components/document/RenameModal";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const [files, setFiles] = useState<DocFile[]>([]);
  const [preview, setPreview] = useState<DocFile | null>(null);

  const [renameVisible, setRenameVisible] = useState(false);
  const [renameUri, setRenameUri] = useState<string | null>(null);


  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectionMode = selected.size > 0;

  const refresh = async () => {
    const all = await loadDocuments();
    setFiles(all.reverse().slice(0, 8)); // 🔥 latest 7 only
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );


  /* ---------- selection ---------- */

  const toggleSelect = (uri: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(uri) ? next.delete(uri) : next.add(uri);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(
      selected.size === files.length
        ? new Set()
        : new Set(files.map((f) => f.uri)),
    );
  };

  const clearSelection = () => setSelected(new Set());

  /* ---------- actions ---------- */

  const deleteSelected = () => {
    Alert.alert("Delete?", "Delete selected documents?", [
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

  /* ---------- preview ---------- */

  if (preview) {
    return <DocumentPreview doc={preview} onClose={() => setPreview(null)} />;
  }

  return (
    <View style={styles.container}>
      <HomeTopBar />

      <CategoryTabs active="All Docs" onChange={() => {}} />

      <SelectionHeader
        allSelected={selected.size === files.length && files.length > 0}
        selectedCount={selected.size}
        totalCount={files.length}
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
            onLongPress={() => setSelected(new Set([item.uri]))}
            onPress={() =>
              selectionMode ? toggleSelect(item.uri) : setPreview(item)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No recent documents</Text>
        }
      />

      <FloatingScanButton />

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
    backgroundColor: "#eeeeee",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },
});
