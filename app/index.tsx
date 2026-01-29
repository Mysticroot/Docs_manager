import { StyleSheet, View } from "react-native";
import { HomeHeader } from "../components/home/HomeHeader";
import { HomeActions } from "../components/home/HomeActions";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeHeader />
      <HomeActions />
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
});
