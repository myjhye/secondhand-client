/*
선택한 카테고리의 상품 목록을 불러와 그리드 형태로 표시
*/

import AppHeader from "@components/AppHeader";
import { LatestProduct } from "@components/LatestProductList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import BackButton from "@ui/BackButton";
import EmptyView from "@ui/EmptyView";
import ProductCard from "@ui/ProductCard";
import colors from "@utils/colors";
import size from "@utils/size";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { AppStackParamList } from "app/navigator/AppNavigator";
import useClient from "hooks/useClient";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

// 내비게이션을 통해 전달받은 route와 navigation을 Props 타입으로 지정
type Props = NativeStackScreenProps<AppStackParamList, "ProductList">;

const col = 2; // 그리드 형태로 상품을 나열할 때 열 개수 설정

export default function ProductList({ route, navigation }: Props) {

    const [products, setProducts] = useState<LatestProduct[]>([]);
    const { authClient } = useClient();
    const { category } = route.params; // Home에서 넘긴 category param 추출

    const isOdd = products.length % col !== 0; // 상품 개수가 홀수인지 여부 → 그리드 레이아웃 보정용

    // 카테고리별 상품 목록 API 호출
    const fetchProducts = async (category: string) => {
      const res = await runAxiosAsync<{ products: LatestProduct[] }>(
          authClient.get("/product/by-category/" + category)
      );

      if (res) {
        setProducts(res.products);
      }
    }

    useEffect(() => {
      fetchProducts(category);
    }, [category]);

    if (!products.length) {
      return (
        <View style={styles.container}>
            <AppHeader
              backButton={<BackButton />}
              center={<Text style={styles.title}>{category}</Text>}
            />

            <EmptyView title="There is no product in this category!" />
        </View>
      )
    }

    // 상품이 있을 때 FlatList로 출력
    return (
        <View style={styles.container}>
          <AppHeader
            backButton={<BackButton />}
            center={<Text style={styles.title}>{category}</Text>}
          />
          <FlatList
            numColumns={col}
            data={products}
            renderItem={({ item, index }) => (
              <View
                // 마지막 아이템이 홀수일 경우 여백 균형 맞추기
                style={{
                  flex: isOdd && index === products.length - 1 ? 1 / col : 1,
                }}
              >
                <ProductCard
                  product={item}
                  // 상품 클릭 시 상세 화면으로 이동
                  onPress={({ id }) => navigation.navigate("SingleProduct", { id })}
                />
              </View>
            )}
          />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    color: colors.primary,
    paddingBottom: 5,
    fontSize: 18,
  },
});