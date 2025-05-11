/*
이미지 배열을 가로 스크롤 리스트로 표시
클릭 및 롱프레스 이벤트를 지원하고,
썸네일 이미지에는 흐림 오버레이 + 텍스트를 표시하는 컴포넌트
*/

import { FlatList, Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
    images: string[];
    onPress?(item: string): void;
    onLongPress?(item: string): void;
    style?: StyleProp<ViewStyle>;
    thumbnail?: string;
}


export default function HorizontalImageList({ images, style, onPress, onLongPress, thumbnail }: Props) {

    return (
        <FlatList
            data={images}
            renderItem={({ item }) => {
                const isThumbnail = item === thumbnail; // 현재 이미지가 썸네일인지 여부 확인
                return (
                    <Pressable
                        onPress={() => onPress && onPress(item)}
                        onLongPress={() => onLongPress && onLongPress(item)}
                        style={styles.listItem}
                    >
                        {/* 이미지 표시 */}
                        <Image style={styles.image} source={{ uri: item }} />

                        {/* 썸네일 이미지인 경우 오버레이 표시 */}
                        {isThumbnail && (
                            <View style={styles.thumbnailOverlay}>
                                <Text style={styles.thumbnailLabel}>
                                    Thumbnail
                                </Text>
                            </View>
                        )}
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
        position: "relative", // 오버레이 포지셔닝을 위해 필요
    },
    image: {
        flex: 1,
    },
    thumbnailOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)", // 반투명 오버레이
        justifyContent: "center",
        alignItems: "center",
    },
    thumbnailLabel: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});