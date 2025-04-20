/*
전달받은 리스트(options)를 모달로 띄우고,
각 항목을 renderItem으로 렌더링하며 
선택 시 onPress로 값을 전달
*/

import colors from "@utils/colors";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";

interface Props<T> {
    visible: boolean; // 모달 표시 여부
    onRequestClose(state: boolean): void; // 모달 닫기 요청 (터치로 닫을 때)
    options: T[]; // 항목 목록 (예: categories)
    renderItem(item: T): JSX.Element; // 각 항목을 어떻게 렌더링할지 정의하는 함수
    onPress(item: T): void; // 항목 선택 시 실행되는 콜백
}

export default function OptionModal<T extends unknown>({
    visible,
    options,
    renderItem,
    onPress,
    onRequestClose,
  }: Props<T>) {

    // 모달 닫기 핸들러: visible 상태 반전시켜 모달 닫기
    const handleClose = () => onRequestClose(!visible);

    return (
        // transparent 모달 (배경 비침)
        <Modal transparent visible={visible} onRequestClose={handleClose}>
            {/* 모달 외부 터치 시 닫기 */}
            <Pressable onPress={handleClose} style={styles.container}>
                <View style={styles.innerContainer}>
                    <ScrollView>
                        {/* 리스트 항목들 렌더링 */}
                        {options.map((item, index) => {
                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        onPress(item); // 항목 선택 처리
                                        handleClose();  // 선택 후 모달 닫기
                                    }}
                                >
                                    {renderItem(item)}  {/* 항목을 렌더링하는 방식 */}
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // 모달 바깥 배경 (터치 시 닫히게 함)
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        backgroundColor: colors.backDrop, // 반투명 어두운 배경
    },
     // 실제 모달 박스 내부
    innerContainer: {
        width: "100%",
        backgroundColor: colors.deActive, // 밝은 회색 배경
        padding: 10,
        borderRadius: 7,
        maxHeight: 200, // 리스트 높이 제한
    },
});