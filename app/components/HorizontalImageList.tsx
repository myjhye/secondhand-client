/*
이미지 배열을 가로 스크롤 리스트로 표시
클릭 및 롱프레스 이벤트를 지원하는 컴포넌트
*/

import { FlatList, Image, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface Props {
    images: string[];
    onPress?(item: string): void;
    onLongPress?(item: string): void;
    style?: StyleProp<ViewStyle>;
}


export default function HorizontalImageList({ images, style, onPress, onLongPress }: Props) {
    return (
        <FlatList
            data={images}

            renderItem={({ item }) => {
                return (
                    <Pressable
                        onPress={() => onPress && onPress(item)}
                        onLongPress={() => onLongPress && onLongPress(item)}
                        style={styles.listItem}
                    >
                        <Image style={styles.image} source={{ uri: item }} />
                    </Pressable>
                )
            }}

            contentContainerStyle={style}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
        />
    )
}


const styles = StyleSheet.create({
    listItem: {
        width: 70,
        height: 70,
        borderRadius: 7,
        marginLeft: 5,
        overflow: "hidden",
    },
    image: {
        flex: 1,
    },
});