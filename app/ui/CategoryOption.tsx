/*
 카테고리 리스트 항목 하나
*/

import colors from "@utils/colors";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    icon: JSX.Element;
    name: string;
}

export default function CategoryOption({ icon, name }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>{icon}</View> {/* 왼쪽 아이콘 */}
            <Text style={styles.category}>{name}</Text>{/* 오른쪽 텍스트 */}
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