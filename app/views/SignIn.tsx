import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
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

                    <AppButton title="Sign in" />

                    <FormDivider />
                    
                    <FormNavigator
                        leftTitle="Forget Password" 
                        rightTitle="Sign Up"
                        onLeftPress={() => console.log("Forget Password pressed")}
                        onRightPress={() => console.log("Sign Up pressed")} 
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