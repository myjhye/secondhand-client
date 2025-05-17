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
import socket from "app/socket";
import useAuth from "app/hooks/useAuth";

export default function Home() {

    const [products, setProducts] = useState<LatestProduct[]>([]);

    const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();
    const { authClient } = useClient();
    const { authState } = useAuth();

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

    // 화면 진입 시 소켓 연결
    useEffect(() => {
        console.log("accessToken: ", authState.profile?.accessToken);

        // 1. connect_error 먼저 등록
        socket.on("connect_error", (err) => {
        console.log("connect_error:", err.message);
        });

        // 2. 연결 성공 이벤트
        socket.on("connect", () => {
        console.log("connected:", socket.connected); // ✅ 연결 성공
        });

        // 3. 연결 해제 이벤트
        socket.on("disconnect", () => {
        console.log("disconnected:", socket.connected);
        });

        // 4. 토큰 설정 + 연결 시도
        socket.auth = {
        token: authState.profile?.accessToken,
        };

        socket.connect();

        return () => {
        socket.disconnect();
        };
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