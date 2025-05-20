import { StyleSheet, Text, View } from "react-native";
import AvatarView from "./AvatarView";
import colors from "@utils/colors";

interface Props {
  name: string;
  avatar?: string;
}

export default function PeerProfile({ name, avatar }: Props) {
    return (
        <View style={styles.container}>
            <AvatarView size={35} uri={avatar} />
            <Text style={styles.name}>{name}</Text>
        </View>
        )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: colors.primary,
    paddingLeft: 5,
    fontWeight: "600",
  },
});