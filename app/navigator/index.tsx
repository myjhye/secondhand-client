/*
앱 전체를 감싸는 Navigation 컨테이너(앱의 전체 내비게이션 흐름을 제어하는 진입 파일)
*/

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import colors from "@utils/colors";
import { StyleSheet } from "react-native";
import AuthNavigator from "./AuthNavigator";
import useAuth from "app/hooks/useAuth";
import AppNavigator from "./AppNavigator";

// 내비게이션의 기본 테마 커스터마이징
const MyTheme = {
    ...DefaultTheme, // 기본 테마 설정 유지
    colors: {
        ...DefaultTheme.colors,
        background: colors.white, // 배경색만 흰색으로 오버라이딩
    },
};

export default function Navigator() {

    const { loggedIn, authState } = useAuth();

    return (
        // 앱 전역 내비게이션 컨테이너
        <NavigationContainer theme={MyTheme}>
            {!loggedIn ? <AuthNavigator /> : <AppNavigator />}
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {},
});