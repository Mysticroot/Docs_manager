import  {Directory,File,Paths} from "expo-file-system";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";


const TEMP_DIR = new Directory(Paths.cache, "temp");


export default function HomeScreen() {


 const ensureTempDir = () => {
   if (!TEMP_DIR.exists) {
     TEMP_DIR.create({
       intermediates: true,
     });
   }
 };


   const pickDocument = async () => {
     try {
       const result = await DocumentPicker.getDocumentAsync({
         type: ["application/pdf", "image/*"],
         copyToCacheDirectory: true,
       });

       if (result.canceled) return;

       const file = result.assets[0];

       await ensureTempDir();

       const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
       const tempPath = `${TEMP_DIR}${Date.now()}_${safeName}`;

         const sourceFile = new File(file.uri);

        await sourceFile.copy(TEMP_DIR);


       Alert.alert("Saved to Temp", "Document is ready for processing");
       console.log("TEMP FILE:", tempPath);
     } catch (err: any) {
       console.error("TEMP SAVE ERROR:", err);
       Alert.alert("Error", err.message || "Failed to save temp file");
     }
   };


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Docs Manager</Text>
      <Text style={styles.subtitle}>
        Store and organize your documents securely on your device
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Upload */}
        <Pressable style={styles.card} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={34} color="#2563eb" />
          <Text style={styles.cardTitle}>Upload Document</Text>
          <Text style={styles.cardSubtitle}>Choose a file from your phone</Text>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push("/add")}>
          <Ionicons name="scan-outline" size={34} color="#16a34a" />
          <Text style={styles.cardTitle}>Scan Document</Text>
          <Text style={styles.cardSubtitle}>Scan using your camera</Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 48,
  },

  actions: {
    gap: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
});
