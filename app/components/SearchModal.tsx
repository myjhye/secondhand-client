import { Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View, Keyboard } from "react-native";
import SearchBar from "./SearchBar";
import colors from "@utils/colors";
import size from "@utils/size";

interface Props {
    visible: boolean;
    onClose(visible: boolean): void;
}

const searchResults = [
  // Electronics
  { id: 1, name: "Apple iPhone 14 Pro" },
  { id: 2, name: "Samsung Galaxy S23 Ultra" },
  { id: 3, name: "Apple iPad Air (5th Gen)" },
  { id: 4, name: "Sony WF-1000XM5 Wireless Earbuds" },
  { id: 5, name: "Apple Watch Series 9" },
  { id: 6, name: "JBL Flip 6 Bluetooth Speaker" },
  { id: 7, name: "Nintendo Switch OLED" },
  { id: 8, name: "Canon EOS R10 Mirrorless Camera" },
  { id: 9, name: "Seagate 2TB External Hard Drive" },
  { id: 10, name: "Anker PowerCore 10000 Portable Charger" },
  { id: 11, name: "Logitech MX Master 3S Mouse" },
  { id: 12, name: "Keychron K2 Mechanical Keyboard" },
  { id: 13, name: "LG UltraFine 4K Monitor" },
  { id: 14, name: "Meta Quest 3 VR Headset" },
  { id: 15, name: "Samsung 55\" QLED Smart TV" },

  // Fashion
  { id: 16, name: "Nike Air Force 1 Sneakers" },
  { id: 17, name: "Longchamp Le Pliage Tote Bag" },
  { id: 18, name: "Levi's Original Trucker Jacket" },
  { id: 19, name: "Dr. Martens 1460 Leather Boots" },
  { id: 20, name: "Carhartt Acrylic Watch Beanie" },
  { id: 21, name: "Ray-Ban Classic Wayfarer Sunglasses" },
  { id: 22, name: "Daniel Wellington Classic Watch" },
  { id: 23, name: "Uniqlo UT Graphic T-Shirt" },
  { id: 24, name: "Adidas Adizero Running Shorts" },
  { id: 25, name: "Champion Reverse Weave Hoodie" },
  { id: 26, name: "Burberry Kensington Trench Coat" },
  { id: 27, name: "Herschel Little America Backpack" },
  { id: 28, name: "New Era NY Yankees Cap" },
  { id: 29, name: "Zara Slim Fit Stretch Jeans" },
  { id: 30, name: "Acne Studios Canada Wool Scarf" },
];


export default function SearchModal({ visible, onClose }: Props) {
    const handleClose = () => {
        onClose(!visible)
    }

    return (
        <Modal animationType="fade" onRequestClose={handleClose} visible={visible}>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <Pressable onPress={handleClose}>
                            <Ionicons name="arrow-back-outline" size={24} color={colors.primary} />
                        </Pressable>

                        <View style={styles.searchBar}>
                            <SearchBar />
                        </View>
                    </View>
                </View>

                {/* 제안 */}
                <FlatList 
                    data={searchResults}
                    renderItem={({ item }) => (
                        <Pressable>
                            <Text style={styles.suggestionListItem}>
                                {item.name}
                            </Text>
                        </Pressable>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.suggestionList}
                /> 
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        marginLeft: size.padding,
    },
    innerContainer: {
        padding: size.padding,
    },
    suggestionList: {
        paddingHorizontal: size.padding,
    },
    suggestionListItem: {
        color: colors.primary,
        fontWeight: '600',
        paddingVertical: 7,
        fontSize: 18,
    }
})