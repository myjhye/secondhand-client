import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { emailRegex } from "@utils/validator";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";

export default function ForgetPassword() {

    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false); // 로딩 중 여부

    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    // 1. 제출 버튼 클릭 함수
    const handleSubmit = async () => {

        // 1-1. 이메일 형식 유효성 검사
        if (!emailRegex.test(email)) {
            return showMessage({ message: "Invalid email address!", type: "danger" });
        }

        // 1-2. 로딩 상태 true 설정
        setBusy(true);

        // 1-3. 서버에 비밀번호 재설정 요청 전송
        const res = await runAxiosAsync<{ message: string }>(
            client.post("/auth/forget-pass", { email })
        );

        // 1-4. 로딩 상태 해제
        setBusy(false);

        // 1-5. 응답 메시지 표시 (성공 시)
        if (res) {
            showMessage({ message: res.message, type: "success" });
        }
    };

    return (
        <CustomKeyAvoidingView> {/* 키보드 겹침 방지용 컨테이너 */}
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>
                    <FormInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <AppButton
                        active={!busy}
                        title={busy ? "Please wait.." : "Request Link"}
                        onPress={handleSubmit}
                    />

                    <FormDivider />

                    <FormNavigator
                        onLeftPress={() => navigate("SignUp")}
                        onRightPress={() => navigate("SignIn")}
                        leftTitle="Sign Up"
                        rightTitle="Sign In"
                    />
                </View>
            </View>
        </CustomKeyAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        padding: 15,
        flex: 1,
    },
    formContainer: {
        marginTop: 30,
    },
});