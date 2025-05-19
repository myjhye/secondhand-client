import CategoryList from "@components/CategoryList";
import LatestProductList, { LatestProduct } from "@components/LatestProductList";
import SearchBar from "@components/SearchBar";
import SearchModal from "@components/SearchModal";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AppStackParamList } from "app/navigator/AppNavigator";
import useClient from "hooks/useClient";
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

export default function Home() {

    const [products, setProducts] = useState<LatestProduct[]>([]);
    const [showSearchModal, setShowSearchModal] = useState(false);

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
            <ScrollView style={styles.container}>
                <SearchBar 
                    asButton
                    onPress={() => setShowSearchModal(true)} 
                />
                <CategoryList
                    onPress={(category) => navigate("ProductList", { category })}
                />
                <LatestProductList
                    data={products}
                    onPress={({ id }) => navigate("SingleProduct", { id })}

                />
            </ScrollView>

            <SearchModal 
                visible={showSearchModal}
                onClose={setShowSearchModal}
            />
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
});