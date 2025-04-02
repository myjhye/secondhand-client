import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import WelcomeHeader from "@ui/WelcomeHeader";
import { View, StyleSheet } from "react-native";

export default function SignIn() {
    return (
        <CustomKeyAvoidingView>
            <View style={styles.innerContainer}>
                <WelcomeHeader />
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