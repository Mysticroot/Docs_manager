import * as FileSystem from "expo-file-system/legacy";

const BASE_DIR = FileSystem.documentDirectory + "DocsManager/";

export type DocFile = {
  uri: string;
  name: string;
  person: string;
  modified: number;
};

export async function loadDocuments(): Promise<DocFile[]> {
  const baseInfo = await FileSystem.getInfoAsync(BASE_DIR);
  if (!baseInfo.exists) return [];

  const persons = await FileSystem.readDirectoryAsync(BASE_DIR);
  const collected: DocFile[] = [];

  for (const person of persons) {
    const personPath = BASE_DIR + person + "/";
    const docs = await FileSystem.readDirectoryAsync(personPath);

    for (const doc of docs) {
      const uri = personPath + doc;
      const info = await FileSystem.getInfoAsync(uri);

      collected.push({
        uri,
        name: doc,
        person,
        modified: (info as any).mtime ?? 0,
      });
    }
  }

  // 🔥 latest first
  return collected.sort((a, b) => b.modified - a.modified);
}

export async function deleteDocuments(uris: Set<string>) {
  for (const uri of uris) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export async function renameDocument(uri: string, newName: string) {
  const parts = uri.split("/");
  parts.pop();
  const dir = parts.join("/") + "/";
  const newUri = dir + newName;

  await FileSystem.moveAsync({ from: uri, to: newUri });
}
