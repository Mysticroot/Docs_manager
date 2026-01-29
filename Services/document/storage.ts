import { Directory, Paths } from "expo-file-system";

export const TEMP_DIR = new Directory(Paths.cache, "temp");
export const BASE_DIR = new Directory(Paths.document, "DocsManager");

export async function ensureDir(dir: Directory) {
  if (!dir.exists) {
    await dir.create({ intermediates: true });
  }
}
