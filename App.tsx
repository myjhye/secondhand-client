import { Platform, SafeAreaView, StatusBar, StyleSheet, Text } from "react-native";
import Navigator from "app/navigator";
import FlashMessage from "react-native-flash-message";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});