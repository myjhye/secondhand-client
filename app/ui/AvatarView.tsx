import { FontAwesome } from "@expo/vector-icons";
import colors from "@utils/colors";
import { View, StyleSheet, Image, Pressable } from "react-native";

interface Props {
  uri?: string;
  size?: number;
  onPress?(): void;
}

const iconContainerFactor = 0.7;
const iconSizeFactor = 0.8;

export default function AvatarView({ size = 50, uri, onPress }: Props) {
    const iconContainerSize = size * iconContainerFactor;
    const iconSize = size * iconSizeFactor;

    // uri가 존재하고 빈 문자열이 아닌지 확인
    const hasValidUri = Boolean(uri && uri.trim && uri.trim().length > 0);

    return (
        <Pressable
            onPress={onPress}
            style={[
                { 
                    width: size, 
                    height: size, 
                    borderRadius: size / 2 
                },
                styles.container,
                !hasValidUri && styles.profileIcon,
            ]}
        >
            {hasValidUri ? (
                <Image 
                    source={{ uri }} 
                    style={styles.flex1} 
                />
            ) : (
                <View
                    style={[
                        {
                            width: iconContainerSize,
                            height: iconContainerSize,
                            borderRadius: iconContainerSize / 2,
                        },
                        styles.iconContainer,
                    ]}
                >
                    <FontAwesome 
                        name="user" 
                        size={iconSize} 
                        color={colors.white} 
                    />
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  flex1: {
    flex: 1,
  },
  profileIcon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});