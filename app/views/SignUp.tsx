import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { newUserSchema, yupValidate } from "@utils/validator";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { showMessage } from "react-native-flash-message";

export default function SignUp() {

    // 1. 사용자 입력 정보 (이름, 이메일, 비밀번호)
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    // 2. 폼 제출 중 로딩 상태
    const [busy, setBusy] = useState(false);
    // 3. 네비게이션 함수 가져오기 (타입 지정으로 타입 안정성 보장)
    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    // 4. 입력 필드 값 변경 처리 함수
    const handleChange = (name: string) => (text: string) => {
        setUserInfo({ 
            ...userInfo, 
            [name]: text  // 해당 필드만 업데이트
        });
    };

    // 5. 폼 제출 처리 함수
    const handleSubmit = async () => {
        // 5-1. 클라이언트 측 유효성 검사 실행
        const { values, error } = await yupValidate(newUserSchema, userInfo);

        // 5-2. 오류가 있으면 에러 메시지 표시 후 함수 종료
        if (error) return showMessage({ message: error, type: "danger" });

        // 5-3. 로딩 상태 활성화
        setBusy(true);

        // 5-4. 서버 API 호출 (회원가입 요청)
        // 타입 매개변수로 응답 데이터 형식 지정 (타입 안전성)
        const res = await runAxiosAsync<{ message: string }>(
            client.post("/auth/sign-up", values)
        );

        // 5-5. 로딩 상태 비활성화 (API 호출 완료 후)
        setBusy(false);

        // 5-6. 성공 시 처리 (응답이 있는 경우)
        if (res) {
            // 성공 메시지 표시
            showMessage({ 
                message: res.message || "Sign up successful!", 
                type: "success" 
            });
            
            // 로그인 화면으로 이동
            navigate("SignIn");
        }
    }

    // 6. 상태에서 필드 값 추출 (구조 분해 할당)
    const { email, name, password } = userInfo;

    return (
        // 키보드가 UI를 가리지 않도록 하는 커스텀 컴포넌트
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>

                {/* 환영 헤더 표시 */}
                <WelcomeHeader />

                <View style={styles.formContainer}>

                    {/* 이름 입력 필드 */}
                    <FormInput 
                        placeholder="Name"
                        value={name}
                        onChangeText={handleChange("name")} 
                    />
                    
                    {/* 이메일 입력 필드 (키보드 타입 및 자동 대문자 설정) */}
                    <FormInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={handleChange("email")}
                    />

                    {/* 비밀번호 입력 필드 (보안 텍스트 설정) */}
                    <FormInput 
                        placeholder="Password" 
                        secureTextEntry
                        value={password}
                        onChangeText={handleChange("password")} 
                    />

                    {/* 회원가입 버튼 (busy 상태에 따라 활성화/비활성화) */}
                    <AppButton 
                        active={!busy}
                        title="Sign Up"
                        onPress={handleSubmit} 
                    />

                    {/* 폼 구분선 */}
                    <FormDivider />

                    {/* 비밀번호 찾기와 로그인으로 이동할 수 있는 네비게이션 */}
                    <FormNavigator
                        onLeftPress={() => navigate("ForgetPassword")}
                        onRightPress={() => navigate("SignIn")}
                        leftTitle="Forget Password"
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
