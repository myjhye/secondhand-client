import colors from "@utils/colors";
import { View, StyleSheet, DimensionValue, ColorValue } from "react-native";

interface Props {
    width?: DimensionValue;
    height?: DimensionValue;
    backgroundColor?: ColorValue;
}

export default function FormDivider({
    width = "50%", // 기본 값
    height = 2,
    backgroundColor = colors.deActive,
}: Props) {
    return (
        <View 
            style={[
                styles.container,
                { width, height, backgroundColor } // 동적으로 스타일 적용
            ]}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        marginVertical: 30,
    },
});