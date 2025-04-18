import colors from "@utils/colors";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";

interface Props {
    visible: boolean;
}

export default function LoadingSpinner({ visible }: Props) {

    if (!visible) return null;

    // visible이 true일 경우, 전체화면 Modal로 로딩 애니메이션 표시
    return (
        <Modal animationType="fade" transparent>
            <View style={styles.container}>
                <LottieView
                    source={require("../../assets/loading.json")} // Lottie 애니메이션 JSON 파일
                    autoPlay // 자동 재생(이 컴포넌트가 화면에 보이자마자 애니메이션이 시작)
                    loop // 반복 재생
                    style={{ width: 150, height: 150 }} // 애니메이션 크기 조정
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backDrop, // 전체 화면 반투명 배경 (ex. 검은색 반투명)
        justifyContent: "center",
        alignItems: "center",
    },
});