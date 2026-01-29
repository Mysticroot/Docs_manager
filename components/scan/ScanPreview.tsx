import { Image, StyleSheet, Text, View } from "react-native";
import { ScanFooter } from "./ScanFooter";

export function ScanPreview({
  uri,
  text,
  onDiscard,
  onContinue,
}: {
  uri: string;
  text: string;
  onDiscard: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.preview} />
      <ScanFooter onDiscard={onDiscard} onContinue={onContinue} />
      <View style={styles.textBox}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, resizeMode: "contain" },
  textBox: { padding: 20 },
  text: { color: "#fff" },
});
