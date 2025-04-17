import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@views/Home";

export type AuthStackParamList = {
    Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AppNavigator() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}