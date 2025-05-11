import AppHeader from "@components/AppHeader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import BackButton from "@ui/BackButton";
import ProductImage from "@ui/ProductImage";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { ProfileNavigatorParamList } from "app/navigator/ProfileNavigator";
import { getListings, Product, updateListings } from "app/store/listings";
import useClient from "hooks/useClient";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type ListingResponse = {
  products: Product[];
};

export default function Listings() {
  const { navigate } = useNavigation<NavigationProp<ProfileNavigatorParamList>>();
  const { authClient } = useClient();

  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const [fetching, setFetching] = useState(false);

  const fetchListings = async () => {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    setFetching(false);
    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <Text style={styles.title}>My Products</Text>
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
          data={listings}
          contentContainerStyle={listings.length === 0 ? styles.emptyList : styles.flatList}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>You haven't listed any products yet.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigate("SingleProduct", { product: item })}
              style={styles.listItem}
            >
              <ProductImage uri={item.thumbnail} />
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>₩ {item.price.toLocaleString()}</Text>
            </Pressable>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  flatList: {
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    paddingBottom: size.padding,
  },
  productName: {
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color: "#666",
    paddingTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
