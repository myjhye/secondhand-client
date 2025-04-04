/*
인증 관련 화면(로그인/회원가입/비밀번호 찾기) 관리 Stack Navigator
*/

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "@views/SignIn";
import { StyleSheet } from "react-native";

export type AuthStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="SignIn" // 시작 화면
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {},
});