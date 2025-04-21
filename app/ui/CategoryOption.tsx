import colors from "@utils/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    icon: JSX.Element;
    name: string;
}

export default function CategoryOption({ icon, name }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>{icon}</View>
            <Text style={styles.category}>{name || ""}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    icon: { transform: [{ scale: 0.4 }] },
    category: {
        color: colors.primary,
        paddingVertical: 10,
    },
});