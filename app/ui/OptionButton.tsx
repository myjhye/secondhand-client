import { Ionicons } from "@expo/vector-icons";
import colors from "@utils/colors";
import { Pressable } from "react-native";

interface Props {
  visible?: boolean;
  onPress?(): void;
}

export default function OptionButton({ visible, onPress }: Props){
    if (!visible) return null;

    return (
        <Pressable onPress={onPress}>
            <Ionicons
                name="ellipsis-vertical-sharp"
                color={colors.primary}
                size={20}
            />
        </Pressable>
    )
}