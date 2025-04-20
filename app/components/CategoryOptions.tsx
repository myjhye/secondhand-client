/*
카테고리 선택을 위한 UI
→ 버튼을 누르면 모달이 뜨고,
→ 사용자가 선택한 항목을 부모 컴포넌트로 전달
*/

import OptionSelector from "@views/OptionSelector";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import OptionModal from "./OptionModal";
import categories from "@utils/categories";
import CategoryOption from "@ui/CategoryOption";

interface Props {
    title: string;
    onSelect(category: string): void;
}

export default function CategoryOptions({ title, onSelect }: Props) {

    // 1. 모달 열림/닫힘 여부
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    return (
        <View style={styles.container}>
            {/* 2. 사용자가 누르는 선택 버튼 */}
            <OptionSelector
                title={title}
                onPress={() => setShowCategoryModal(true)} // 버튼 누르면 모달 오픈
            />

            {/* 3. 카테고리 리스트를 담은 모달 */}
            <OptionModal
                visible={showCategoryModal} // 상태에 따라 모달 열림
                onRequestClose={setShowCategoryModal} // 바깥 눌렀을 때 닫힘 처리
                options={categories} // 카테고리 목록 데이터
                renderItem={(item) => {
                    return <CategoryOption {...item} />; // 각 항목을 어떻게 렌더링할지 정의
                }}
                onPress={(item) => onSelect(item.name)} // 항목 누르면 선택값(item.name)을 부모 컴포넌트(NewListing)로 전달
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
});