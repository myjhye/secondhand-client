import { Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View, Keyboard, Image } from "react-native";
import SearchBar from "./SearchBar";
import colors from "@utils/colors";
import size from "@utils/size";
import { useEffect, useMemo, useState } from "react";
import EmptyView from "@ui/EmptyView";
import LottieView from "lottie-react-native";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "hooks/useClient";
import { debounce } from "@utils/helper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "app/navigator/AppNavigator";

interface Props {
    visible: boolean;
    onClose(visible: boolean): void;
    onSelectProduct(id: string): void;
}

type SearchResult = {
    id: string;
    name: string;
    thumbnail?: string;
}

export default function SearchModal({ visible, onClose, onSelectProduct }: Props) {
    const [keyboardHeight, setKeyboardHeight] = useState(0); // 키보드 여백 조절용
    const [busy, setBusy] = useState(false); // 로딩 상태
    const [query, setQuery] = useState(''); // 검색어
    const [results, setResults] = useState<SearchResult[]>([]); // 검색 결과 목록

    const { authClient } = useClient();
    const { navigate } = useNavigation<NavigationProp<AppStackParamList>>();

    // 모달 닫기
    const handleClose = () => {
        onClose(!visible)
    }

    // 검색 API 호출
    const searchProduct = async (query: string) => {
        if (query.trim().length >= 3) {
            const res = await runAxiosAsync<{ results: SearchResult[] }>(
                authClient.get("/product/search?name=" + query)
            );

            if (res?.results) {
                setResults(res.results); // 검색 결과 갱신
            }
        }
    };

    // debounce 처리된 검색 함수 (1초 대기 후 호출)
    const searchDebounce = useMemo(() => debounce(searchProduct, 1000), [authClient]);

    // 검색어 변경 핸들러
    const handleChange = (value: string) => {
        setQuery(value);
        searchDebounce(value);
    };

    // 키보드 높이에 따라 하단 여백 조정
    useEffect(() => {
        // 플랫폼에 따라 키보드 이벤트 타입 설정
        const keyShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
        const keyHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

        // 키보드 열릴 때: 키보드 높이 + 여유 여백을 상태에 저장
        const keyShowListener = Keyboard.addListener(keyShowEvent, (evt) => {
            setKeyboardHeight(evt.endCoordinates.height + 50)
        })

        // 키보드 닫힐 때: 높이 0으로 초기화
        const keyHideListener = Keyboard.addListener(keyHideEvent, (evt) => {
            setKeyboardHeight(0)
        })

        // cleanup: 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            keyShowListener.remove();
            keyHideListener.remove();
        }
    })

    useEffect(() => {
        if (visible) {
            setBusy(true); // 모달 열릴 때 로딩 시작

            // 예시로 1초 후 로딩 끝 처리
            const timeout = setTimeout(() => {
                setBusy(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [visible]);


    return (
        <Modal animationType="fade" onRequestClose={handleClose} visible={visible}>
            <SafeAreaView style={styles.container}>

                {/* 상단 영역: 뒤로가기 버튼 + 검색바 */}
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <Pressable onPress={handleClose}>
                            <Ionicons name="arrow-back-outline" size={24} color={colors.primary} />
                        </Pressable>

                        <View style={styles.searchBar}>
                            <SearchBar 
                                onChange={handleChange}
                                value={query}
                            />
                        </View>
                    </View>
                </View>

                {/* 로딩 애니메이션 */}
                {busy ? (
                    <View style={styles.busyIconContainer}>
                        <View style={styles.busyAnimationSize}>
                            <LottieView
                                style={styles.flex1}
                                autoPlay
                                loop
                                source={require("../../assets/loading_2.json")}
                            />
                        </View>
                    </View>
                ) : null}

                {/* 하단 추천 리스트 - 키보드가 올라오면 자동으로 여백 확보 */}
                <View style={{ paddingBottom: keyboardHeight }}>
                    <FlatList
                        data={results}
                        renderItem={({ item }) => (
                            <Pressable 
                                onPress={() => { 
                                    onSelectProduct(item.id);
                                }} 
                                style={styles.searchResultItem}
                            >
                                <Image source={{ uri: item.thumbnail || undefined }} style={styles.thumbnail} />
                                <Text style={styles.suggestionListItem}>
                                    {item.name}
                                </Text>
                            </Pressable>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.suggestionList}
                        ListEmptyComponent={<EmptyView title="There is no results..." />}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: size.padding,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        marginLeft: size.padding,
    },
    innerContainer: {
        padding: size.padding,
    },
    suggestionList: {
        paddingHorizontal: size.padding,
    },
    suggestionListItem: {
        color: colors.primary,
        fontWeight: '600',
        paddingVertical: 7,
        fontSize: 18,
    },
    busyIconContainer: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    busyAnimationSize: {
        height: 100,
        width: 100,
    },
    flex1: {
        flex: 1,
    },
    thumbnail: {
        width: 60,
        height: 40,
    },
    searchResultItem: {
        flexDirection: "row",
    }
})