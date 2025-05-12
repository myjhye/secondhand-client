import { LatestProduct } from "@components/LatestProductList";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@utils/colors";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";

interface Props {
  product: LatestProduct;
  onPress(item: LatestProduct): void;
}

export default function ProductCard({ product, onPress }: Props) {
    return (
        <Pressable 
            onPress={() => onPress(product)} 
            style={styles.productContainer}
        >
            {product.thumbnail ? (
                <Image 
                    source={{ uri: product.thumbnail }} 
                    style={styles.thumbnail} 
                />
            ) : (
                <View style={[styles.thumbnail, styles.noImageView]}>
                    <MaterialCommunityIcons
                        name="image-off"
                        size={35}
                        color={colors.primary}
                    />
                </View>
            )}
            <Text style={styles.price}>₩ {product.price.toLocaleString()}</Text>
            <Text style={styles.name}>{product.name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  productContainer: {
    padding: 7,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
    paddingTop: 5,
  },
});