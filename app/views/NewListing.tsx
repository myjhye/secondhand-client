/*
상품 등록
*/

import HorizontalImageList from "@components/HorizontalImageList";
import { FontAwesome5 } from "@expo/vector-icons";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormInput from "@ui/FormInput";
import colors from "@utils/colors";
import { selectImages } from "@utils/helper";
import { newProductSchema, yupValidate } from "@utils/validator";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "hooks/useClient";
import DatePicker from "@ui/DatePicker";
import CategoryOptions from "@components/CategoryOptions";
import OptionModal from "@components/OptionModal";
import LoadingSpinner from "@ui/LoadingSpinner";

const imageOptions = [{ value: "Remove Image", id: "remove" }];

export default function NewListing() {

    // 1. 초기 상태
    const [productInfo, setProductInfo] = useState({ 
        name: "",
        description: "",
        category: "",
        price: "",
        purchasingDate: new Date(),
    });
    const [busy, setBusy] = useState(false); // 로딩 중 표시용
    const [images, setImages] = useState<string[]>([]); // 업로드된 이미지들
    const [selectedImage, setSelectedImage] = useState(""); // 선택된 이미지 (옵션용)
    const [showImageOptions, setShowImageOptions] = useState(false); // 이미지 옵션 모달 표시 여부

    // 2. 인증된 Axios 클라이언트 가져오기
    const { authClient } = useClient();

    const { category, description, name, price, purchasingDate } = productInfo;

    // 3. 폼 입력 값 변경 핸들러
    const handleChange = (name: string) => (text: string) => {
        setProductInfo({ 
            ...productInfo, 
            [name]: text 
        });
    };

    // 4. 이미지 선택 처리 함수 (사용자가 이미지 선택 시 실행)
    const handleOnImageSelection = async () => {
        const newImages = await selectImages(); // ✅ 사용자가 새로 고른 이미지들
        setImages([
            ...images, 
            ...newImages
        ]);
    }


    // 5. 상품 등록 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {

        // 5-1. 입력값 유효성 검사
        const { error } = await yupValidate(newProductSchema, productInfo);
        if (error) return showMessage({ message: error, type: "danger" });

        setBusy(true);  // 로딩 시작

        const formData = new FormData();

        // 5-2. productInfo 값을 FormData에 추가
        type productInfoKeys = keyof typeof productInfo;
        for (let key in productInfo) {
            const value = productInfo[key as productInfoKeys];
        
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            }
            else {
                formData.append(key, value);
            }
        }

        // 5-3. 이미지 파일들을 FormData에 추가
        const newImages = images.map((img, index) => ({
            name: "image_" + index,
            type: mime.getType(img),
            uri: img,
        }));

        for (let img of newImages) {
            formData.append("images", img as any);
        }

        // 5-4. 서버에 등록 요청 전송
        const res = await runAxiosAsync<{ message: string }>(
            authClient.post("/product/list", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        );
        setBusy(false); // 로딩 종료
    
        // 5-5. 등록 성공 시 입력값 초기화 및 메시지 출력
        if (res) {
            showMessage({ message: res.message, type: "success" });
            setProductInfo({
                name: "",
                description: "",
                category: "",
                price: "",
                purchasingDate: new Date(),
            });
            setImages([]);
        }
    }


    return (
        <CustomKeyAvoidingView>
            <View style={styles.container}>
                {/* 6-1. 이미지 선택 버튼 */}
                <View style={styles.imageContainer}>
                    <Pressable
                        onPress={handleOnImageSelection}
                        style={styles.fileSelector}
                    >
                        <View style={styles.iconContainer}>
                            <FontAwesome5 name="images" size={24} color="black" />
                        </View>
                    </Pressable>

                    {/* 6-2. 이미지 리스트 표시 */}
                    <HorizontalImageList
                        images={images}
                        onLongPress={(img) => {
                            setSelectedImage(img);
                            setShowImageOptions(true);
                        }}
                    />
                </View>

                {/* 6-3. 상품명 입력 */}
                <FormInput
                    value={name}
                    placeholder="Product name"
                    onChangeText={handleChange("name")}
                />

                {/* 6-4. 가격 입력 */}
                <FormInput
                    value={price}
                    placeholder="Price"
                    onChangeText={handleChange("price")}
                    keyboardType="numeric"
                />

                {/* 6-5. 구매일 선택 */}
                <DatePicker
                    title="Purchasing Date: "
                    value={purchasingDate}
                    onChange={(purchasingDate) =>
                        setProductInfo({ 
                            ...productInfo, 
                            purchasingDate 
                        })
                    }
                />

                {/* 6-6. 카테고리 선택 */}
                <CategoryOptions
                    title={category || "Category"}
                    onSelect={handleChange("category")}
                />

                {/* 6-7. 설명 입력 */}
                <FormInput
                    value={description}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                    onChangeText={handleChange("description")}
                />

                {/* 6-8. 상품 등록 버튼 */}
                <AppButton title="List Product" onPress={handleSubmit} />

                {/* 6-9. 이미지 옵션 모달 (삭제 등) */}
                <OptionModal
                    visible={showImageOptions}
                    onRequestClose={setShowImageOptions}
                    options={imageOptions}
                    renderItem={(item) => {
                        return (
                            <Text style={styles.imageOption}>{item.value}</Text>
                        );
                    }}
                    onPress={(option) => {
                        if (option.id === "remove") {
                            const newImages = images.filter((img) => img !== selectedImage);
                            setImages([...newImages]);
                        }
                    }}
                />
            </View>

            {/* 6-10. 로딩 스피너 표시 */}
            <LoadingSpinner visible={busy} />
        </CustomKeyAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    imageContainer: { flexDirection: "row" },
        btnTitle: {
        color: colors.primary,
        marginTop: 5,
    },
    fileSelector: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        alignSelf: "flex-start",
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 7,
    },
    selectedImage: {
        width: 70,
        height: 70,
        borderRadius: 7,
        marginLeft: 5,
    },
    imageOption: {
        fontWeight: "600",
        fontSize: 18,
        color: colors.primary,
        padding: 10,
    },
});