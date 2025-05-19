import { View, StyleSheet, TextInput, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "@utils/colors";

interface Props {
  asButton?: boolean;
  onPress?(): void;
}

export default function SearchBar({ asButton, onPress }: Props) {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <AntDesign name="search1" size={20} color={colors.primary} />
            {asButton ? (
              <View>
                <Text style={styles.fakePlaceholder}>Search here</Text>
              </View>
            ) : (
              <TextInput
                autoFocus 
                placeholder="Search here..." 
                style={[styles.textInput, styles.textInputText]} 
              />
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
  },
  textInputText: {
    color: colors.primary,
    fontSize: 18,
  },
  fakePlaceholder: {
    color: colors.primary,
    fontSize: 18,
    opacity: 0.5,
  },
});