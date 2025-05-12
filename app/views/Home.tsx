import CategoryList from "@components/CategoryList";
import LatestProductList, { LatestProduct } from "@components/LatestProductList";
import SearchBar from "@components/SearchBar";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ChatNotification from "@ui/ChatNotification";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AppStackParamList } from "app/navigator/AppNavigator";
import useClient from "hooks/useClient";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";

export default function Home() {

    const [products, setProducts] = useState<LatestProduct[]>([]);

    const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
    const { authClient } = useClient();

    const fetchLatestProduct = async () => {
        const res = await runAxiosAsync<{ products: LatestProduct[] }>(
            authClient.get("/product/latest")
        );
        if (res?.products) {
            setProducts(res.products);
        }
    }

    useEffect(() => {
        fetchLatestProduct();
    }, []);

    return (
        <>
            <ChatNotification onPress={() => navigate("Chats")} />
            <ScrollView style={styles.container}>
                <SearchBar />
                <CategoryList
                    onPress={(category) => navigate("ProductList", { category })}
                />
                <LatestProductList
                    data={products}
                    onPress={({ id }) => navigate("SingleProduct", { id })}

                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
});