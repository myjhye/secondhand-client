import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AskAi from "@views/AskAi";
import Chats from "@views/Chats";
import Home from "@views/Home";
import ProductList from "@views/ProductList";
import SingleProduct from "@views/SingleProduct";
import { Product } from "app/store/listings";

export type AppStackParamList = {
  Home: undefined;
  Chats: undefined;
  ProductList: { 
    category: string 
  };
  SingleProduct: { 
    product?: Product; 
    id?: string 
  };
  AskAi: {
      title: string;
      price: number;
      description: string;
      thumbnail: string;
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="SingleProduct" component={SingleProduct} />
            <Stack.Screen name="AskAi" component={AskAi} />
        </Stack.Navigator>
    )
}