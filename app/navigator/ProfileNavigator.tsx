import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@views/Profile";
import { Product } from "app/store/listings";

export type ProfileNavigatorParamList = {
    Profile: undefined;
    Chats: undefined;
    Listings: undefined;
    SingleProduct: { product?: Product };
    EditProduct: { product: Product };
    ChatWindow: undefined;
};


// createNativeStackNavigator에 위에서 정의한 타입 리스트를 제네릭으로 넘기기
const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
    )
}