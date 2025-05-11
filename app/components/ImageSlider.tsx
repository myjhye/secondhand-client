import ProductImage from "@ui/ProductImage";
import colors from "@utils/colors";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View, ViewToken } from "react-native";

interface Props {
  images?: string[];
}

export default function ImageSlider({ images }: Props) {

    // 1. 
    const [activeIndex, setActiveIndex] = useState(0); // 현재 보고 있는 이미지 인덱스
    const viewableConfig = useRef({ itemVisiblePercentThreshold: 50 }); // 화면에 일정 비율 이상 보여진 아이템을 감지할 기준값 설정 (50%)

    // 2. 보여지는 이미지가 바뀌면 실행되는 함수 → 지금 화면에 보이는 첫 번째 이미지의 번호(인덱스)를 저장함(현재 몇 번째 이미지를 보고 있는지 화면에 보여주기 위해서)
    const onViewableItemsChanged = useRef(
        (info: { 
            viewableItems: ViewToken[]; 
            changed: ViewToken[] 
        }) => {
            setActiveIndex(info.viewableItems[0].index || 0);
        }
    );

    // 3. 이미지 배열이 없거나 비어 있으면 아무것도 렌더링하지 않음
    if (!images?.length) return null;

    return (
        <View style={styles.container}>
            {/* 이미지 리스트 조회: 수평 방향으로 스와이프 가능, 한 장씩 넘김 */}
            <FlatList 
                contentContainerStyle={styles.flatList}
                data={images}
                renderItem={({ item }) => <ProductImage uri={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                viewabilityConfig={viewableConfig.current}
                onViewableItemsChanged={onViewableItemsChanged.current}
            />

            {/* 현재 이미지 인덱스 표시 (예: 1 / 5) */}
            <View style={styles.indicator}>
                <Text style={styles.indicatorText}>
                    {activeIndex + 1} / {images?.length}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {},
  flatList: { position: "relative" },
  indicatorText: { color: colors.white, fontWeight: "600" },
  indicator: {
    position: "absolute",
    width: 35,
    height: 25,
    backgroundColor: colors.backDropDark,
    bottom: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});