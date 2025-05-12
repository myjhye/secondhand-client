import AppHeader from "@components/AppHeader";
import BackButton from "@ui/BackButton";
import { View, StyleSheet } from "react-native";

export default function Chats() {
    return (
        <View style={styles.container}>
            <AppHeader backButton={<BackButton />} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {},
});