import { View, StyleSheet, Text } from "react-native";

export default function Home() {

    return (
        <View style={styles.container}>
            <Text>Home</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // ← 이거 반드시 필요!
    },
});