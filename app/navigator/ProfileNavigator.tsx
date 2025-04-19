import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    )
}