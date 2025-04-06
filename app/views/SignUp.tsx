import { NavigationProp, useNavigation } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { StyleSheet, View } from "react-native";

export default function SignUp() {

    const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />

                <View style={styles.formContainer}>
                    <FormInput placeholder="Name" />
                    <FormInput
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <FormInput placeholder="Password" secureTextEntry />

                    <AppButton title="Sign Up" />

                    <FormDivider />

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
