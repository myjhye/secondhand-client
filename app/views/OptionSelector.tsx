/*
선택된 값을 보여주고, 누르면 모달을 여는 역할의 드롭다운 버튼 컴포넌트
*/

import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
    onPress?(): void;
    title: string;
}
  
export default function OptionSelector({ title, onPress }: Props) {
    return (
        // 터치 가능한 선택 버튼 (모달 오픈 트리거 역할)
        <Pressable style={styles.categorySelector} onPress={onPress}>
            {/* 선택된 텍스트 */}
            <Text style={styles.categoryTitle}>
                {title}
            </Text>

            {/* 우측 드롭다운 아이콘 (시각적으로 선택 UI라는 걸 강조) */}
            <AntDesign name="caretdown" color={colors.primary} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    categorySelector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.deActive,
        borderRadius: 5,
    },
    categoryTitle: {
        color: colors.primary,
    },
});