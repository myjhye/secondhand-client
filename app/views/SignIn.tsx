import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { signInSchema, yupValidate } from "@utils/validator";
import useAuth from "app/hooks/useAuth";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

export default function SignIn() {

    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });

    const { signIn } = useAuth();

    const handleSubmit = async () => {
        console.log("submit clicked");
        const { values, error } = await yupValidate(signInSchema, userInfo);
        console.log("validation result:", values, error);

        if (error) return showMessage({ message: error, type: "danger" });
        if (values) {
            const success = await signIn(values); // ✅ 결과값 받기
            if (success) {
                showMessage({ message: "Login successful!", type: "success" });
            } else {
                showMessage({ message: "Invalid email or password", type: "danger" }); // ❌ 실패 알림
            }
        }
    }

    const handleChange = (name: string) => (text: string) => {
        setUserInfo({ 
            ...userInfo, 
            [name]: text 
        });
    };

    const { email, password } = userInfo;

    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>
                    <FormInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none" // 첫 글자 자동 대문자 변환 막기
                        value={email}
                        onChangeText={handleChange("email")}
                    />
                    <FormInput 
                        placeholder="Password" 
                        secureTextEntry // 입력값 숨기기
                        value={password}
                        onChangeText={handleChange("password")}
                    />

                    <AppButton title="Sign In" onPress={handleSubmit} />

                    <FormDivider />
                    
                    <FormNavigator
                        onLeftPress={() => navigate("ForgetPassword")}
                        onRightPress={() => navigate("SignUp")}
                        leftTitle="Forget Password" 
                        rightTitle="Sign Up"
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