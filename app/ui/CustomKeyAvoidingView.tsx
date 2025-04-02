/*
키보드가 화면을 가리지 않게 자동으로 피하는 뷰
*/

import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";

interface Props {
    children: ReactNode;
}

export default function CustomKeyAvoidingView({ children }: Props ) {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={50} // 키보드가 올라올 때 기준 위치 보정 (iOS에서 주로 사용)
        >
            {/* 키보드가 올라와도 내부 내용이 스크롤 가능하도록 ScrollView로 감쌈 */}
            <ScrollView>
                {children}
            </ScrollView> 
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,  // 전체 화면 채우기
    },
});