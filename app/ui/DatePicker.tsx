import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import colors from "@utils/colors";
import { formatDate } from "@utils/date";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Props {
    title: string;
    value: Date;
    onChange(value: Date): void;
}

// 1. 현재 플랫폼이 iOS인지 확인
const isIOS = Platform.OS === "ios";

export default function DatePicker({ title, value, onChange }: Props) {

    // 2. 안드로이드에서만 DateTimePicker 표시 여부를 위한 상태
    const [showPicker, setShowPicker] = useState(false);

    // 3. iOS는 항상 visible, Android는 showPicker 상태에 따라 표시
    const visible = isIOS ? true : showPicker;

    // 4. Pressable 클릭 시 실행되는 함수 (iOS는 무시, Android만 Picker 열림)
    const onPress = () => {
        if (isIOS) return;
        setShowPicker(true);
    };


    return (
        // Pressable: Android에서 누르면 DateTimePicker 표시
        <Pressable onPress={onPress} style={styles.container}>
            {/* 제목 텍스트 */}
            <Text style={styles.title}>{title}</Text>

            {/* Android에서만 날짜 텍스트 표시 (iOS는 DatePicker 자체가 표시됨) */}
            {!isIOS && (
                <Text style={styles.value}>
                    {formatDate(value.toISOString(), "dd LLL yyyy")}
                </Text>
            )}

            {/* DateTimePicker 표시 조건: iOS는 항상, Android는 showPicker 상태가 true일 때 */}
            {visible ? (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    onChange={(_, date) => {
                        if (date) onChange(date);
                        // Android일 경우 선택 후 Picker 닫기
                        if (!isIOS) setShowPicker(false);
                    }}
                />
            ) : null}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    // 외곽 박스 스타일: iOS는 테두리 없음
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
        padding: isIOS ? 0 : 8,
        borderWidth: isIOS ? 0 : 1,
        borderColor: colors.deActive,
        borderRadius: 5,
    },
    // 제목 텍스트 색상
    title: { color: colors.primary },
    // Android용 날짜 텍스트
    value: { color: colors.primary, paddingLeft: 10 },
});