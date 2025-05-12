import { View, StyleSheet, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";

export default function SearchBar() {
    return (
        <View style={styles.container}>
            <AntDesign name="search1" size={20} color={colors.primary} />
            <TextInput placeholder="Search here..." style={styles.textInput} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
  },
  textInput: {
    paddingLeft: 10,
    flex: 1,
    color: colors.primary,
    fontSize: 18,
  },
});