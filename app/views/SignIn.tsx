import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { View, StyleSheet } from "react-native";

export default function SignIn() {
    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>
                    <FormInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none" // 첫 글자 자동 대문자 변환 막기
                    />
                    <FormInput 
                        placeholder="Password" 
                        secureTextEntry // 입력값 숨기기
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