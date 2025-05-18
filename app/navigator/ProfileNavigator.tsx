import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatWindow from "@views/ChatWindow";
import EditProduct from "@views/EditProduct";
import Listings from "@views/Listings";
import Profile from "@views/Profile";
import SingleProduct from "@views/SingleProduct";
import { Product } from "app/store/listings";

export type ProfileNavigatorParamList = {
    Profile: undefined;
    Chats: undefined;
    Listings: undefined;
    SingleProduct: { 
        product?: Product; 
        id?: string 
    };
    EditProduct: { 
        product: Product; 
    };
    ChatWindow: {
        conversationId: string;
        peerProfile: { 
            id: string; 
            name: string; 
            avatar?: string; 
        };
    };
};


// createNativeStackNavigator에 위에서 정의한 타입 리스트를 제네릭으로 넘기기
const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

export default function ProfileNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Listings" component={Listings} />
            <Stack.Screen name="SingleProduct" component={SingleProduct} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="ChatWindow" component={ChatWindow} />
        </Stack.Navigator>
    )
}