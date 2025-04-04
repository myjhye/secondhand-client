import colors from "@utils/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    leftTitle: string; // 왼쪽 버튼에 표시할 텍스트
    rightTitle: string; // 오른쪽 버튼에 표시할 텍스트
    onLeftPress(): void; // 왼쪽 버튼 클릭 시 실행할 함수
    onRightPress(): void; // 오른쪽 버튼 클릭 시 실행할 함수
}
  
export default function FormNavigator({
    leftTitle,
    rightTitle,
    onLeftPress,
    onRightPress,
}: Props) {
    return (
        <View style={styles.container}>
            {/* 왼쪽 텍스트 버튼 */}
            <Pressable onPress={onLeftPress}>
                <Text style={styles.title}>
                    {leftTitle}
                </Text>
            </Pressable>

            {/* 오른쪽 텍스트 버튼 */}
            <Pressable onPress={onRightPress}>
                <Text style={styles.title}>
                    {rightTitle}
                </Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        width: "100%", // 가로 전체 폭 사용
        flexDirection: "row", // 수평 정렬
        justifyContent: "space-between", // 양쪽 끝으로 버튼 정렬
    },
    title: {
        color: colors.primary,
    },
});