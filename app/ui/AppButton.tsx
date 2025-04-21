/*
활성 상태에 따라 스타일이 바뀌는 커스텀 버튼
*/

import colors from "@utils/colors";
import { StyleSheet, Pressable, Text } from "react-native";

interface Props {
    title: string;
    active?: boolean;
    onPress?(): void;
}

export default function AppButton({ title, active = true, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.button,
                active ? styles.btnActive : styles.btnDeActive
            ]}
        >
            <Text style={styles.title}>
                {title}
            </Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    btnActive: {
        backgroundColor: colors.primary,
    },
    btnDeActive: {
        backgroundColor: colors.deActive,
    },
    title: {
        color: colors.white,
        fontWeight: "700",
        letterSpacing: 1,
    },
});