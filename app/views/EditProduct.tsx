/*
상품 수정
*/

import AppHeader from "@components/AppHeader";
import CategoryOptions from "@components/CategoryOptions";
import HorizontalImageList from "@components/HorizontalImageList";
import { FontAwesome5 } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppButton from "@ui/AppButton";
import BackButton from "@ui/BackButton";
import DatePicker from "@ui/DatePicker";
import FormInput from "@ui/FormInput";
import colors from "@utils/colors";
import { selectImages } from "@utils/helper";
import size from "@utils/size";
import { ProfileNavigatorParamList } from "app/navigator/ProfileNavigator";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import deepEqual from "deep-equal";
import { newProductSchema, yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import useClient from "hooks/useClient";
import LoadingSpinner from "@ui/LoadingSpinner";
import OptionModal from "@components/OptionModal";

type Props = NativeStackScreenProps<ProfileNavigatorParamList, "EditProduct">;

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
};

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

export default function EditProduct({ route }: Props) {

    // 전달 받은 기존 상품 정보 / 데이터 포맷 가공(그냥 받은 데이터를 바로 쓰면 입력창에서 깨지거나, 제대로 작동 안함)
    const productInfoToUpdate = {
        ...route.params.product, // EditProduct 화면으로 넘어올 때 navigate("EditProduct", { product })로 받은 product 데이터 전체를 펼치는 것 (즉, product.id, product.name, product.price, product.date, 등 모든 값을 복사해오는 것.)
        price: route.params.product.price.toString(), // price를 string으로 다루기 위해 숫자를 문자열로 바꾸기
        date: new Date(route.params.product.date), // 넘어온 날짜 문자열을 Date 객체로 변환 (예: "2025-05-11T09:00:00Z" → new Date("2025-05-11T09:00:00Z"))
    };

    const [product, setProduct] = useState({ ...productInfoToUpdate });
    const [selectedImage, setSelectedImage] = useState("");
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [busy, setBusy] = useState(false);

    const isFormChanged = deepEqual(productInfoToUpdate, product);
    
    const { authClient } = useClient();

    // 이미지 위에서 길게 누르면, 해당 이미지를 선택 상태로 만들고 옵션 메뉴(예: 삭제, 썸네일 지정 등) 표시
    const onLongPress = (image: string) => {
        setSelectedImage(image);
        setShowImageOptions(true);
    };


    // 새 이미지를 선택 시, 기존 이미지 목록에 새 이미지를 추가해서 상품 상태 업데이트
    const handleOnImageSelect = async () => {
         // 1. 이미지 선택 다이얼로그 실행 (예: 갤러리에서 선택)
        const newImages = await selectImages();
        // 2. 기존 이미지 배열 불러오기 (없으면 빈 배열)
        const oldImages = product.image || [];
        // 3. 기존 이미지 + 새 이미지 → 하나의 배열로 합치기
        const images = oldImages.concat(newImages);

        // 4. 상태 업데이트: 이미지 배열을 새로 설정
        setProduct({ 
            ...product, 
            image: [...images] 
        });
    }


    // 썸네일 설정
    const makeSelectedImageAsThumbnail = () => {
        // 1. 선택한 이미지가 클라우디너리에 있는지 확인
        if (selectedImage.startsWith("https://res.cloudinary.com")) {

            // 2. 상품 상태에서 thumbnail을 선택한 이미지로 설정
            setProduct({ 
                ...product, 
                thumbnail: selectedImage 
            });
        }
    };


    // 선택한 사진 삭제
    const removeSelectedImage = async () => {

        // 1. 선택한 이미지가 클라우디너리 URL인지 확인 (이미 업로드된 이미지인지)
        const notLocalImage = selectedImage.startsWith(
            "https://res.cloudinary.com"
        );

        // 2. 현재 이미지 배열에서 선택한 이미지를 제외한 새 배열 생성
        const images = product.image;
        const newImages = images?.filter((img) => img !== selectedImage);

        // 3. 상태 업데이트: 상품 정보에서 이미지 배열을 새 배열로 교체
        setProduct({ 
            ...product, 
            image: newImages 
        });

        // 4. 만약 클라우디너리 이미지였다면 → 서버에도 삭제 요청
        if (notLocalImage) {
            // 4-1. URL에서 이미지 ID 추출 (예: .../image_0.jpg → image_0)
            const splittedItems = selectedImage.split("/");
            const imageId = splittedItems[splittedItems.length - 1].split(".")[0];

            // 4-2. 서버에 DELETE 요청 (상품 ID + 이미지 ID)
            await runAxiosAsync(
                authClient.delete(`/product/image/${product.id}/${imageId}`)
            );
        }
    }


    // 상품 정보 수정 제출
    const handleOnSubmit = async () => {

        // 1. 서버에 보낼 수정용 데이터 구성
        const dataToUpdate: ProductInfo = {
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            purchasingDate: product.date,
        };

        // 2. 유효성 검사 실행 (스키마 기반)
        const { error } = await yupValidate(newProductSchema, dataToUpdate);

        // 3. 유효성 실패 시 에러 메시지 표시 후 종료
        if (error) return showMessage({ message: error, type: "danger" });

        // 4. 서버로 전송할 FormData 객체 생성
        const formData = new FormData();

        // 5. 썸네일 이미지가 있다면 FormData에 추가
        if (product.thumbnail) {
            formData.append("thumbnail", product.thumbnail);
        }

        // 6. 각 필드를 FormData에 추가 (Date는 문자열로 변환해서)
        type productInfoKeys = keyof typeof dataToUpdate;
        for (let key in dataToUpdate) {
            const value = dataToUpdate[key as productInfoKeys];
            if (value instanceof Date) {
                formData.append(key, value.toISOString()); // 날짜는 ISO 문자열로 변환
            }
            else {
                formData.append(key, value); // 나머지는 그대로 추가
            }
        }

        // 7. 이미지 배열 중 이미 업로드된 이미지가 아닌 경우에만 FormData에 추가
        product.image?.forEach((img, index) => {
            if (!img.startsWith("https://res.cloudinary.com")) {
                formData.append("images", {
                    uri: img,
                    name: "image_" + index,
                    type: mime.getType(img) || "image/jpg",
                } as any);
            }
        });

        // 8. API 호출 전 busy 상태 true로 설정
        setBusy(true);

        // 9. 서버에 PATCH 요청으로 수정 데이터 전송
        const res = await runAxiosAsync<{ message: string }>(
            authClient.patch("/product/" + product.id, formData)
        );

        // 10. 요청 후 busy 상태 해제
        setBusy(false);

        // 11. 응답 메시지가 있다면 성공 메시지 표시
        if (res) {
            showMessage({ message: res.message, type: "success" });
        }
    }

    return (
        <>
            <AppHeader backButton={<BackButton />} />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // iOS에서 헤더 높이만큼 올리기
            >
                <Text style={styles.header}>Edit My Products</Text>
                <ScrollView
                    keyboardShouldPersistTaps="handled" // ✅ 키보드 닫힘 제어
                >
                    <Text style={styles.title}>Images</Text>
                    {/* 선택된 이미지 목록 */}
                    <HorizontalImageList
                        images={product.image || []}
                        onLongPress={onLongPress}
                        thumbnail={product.thumbnail}
                    />
                    {/* 이미지 추가 버튼 (갤러리에서 이미지 선택) */}
                    <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
                        <FontAwesome5 name="images" size={30} color={colors.primary} />
                    </Pressable>
                    {/* 상품명 입력 필드 */}
                    <FormInput
                        placeholder="Product name"
                        value={product.name}
                        onChangeText={(name) => setProduct({ ...product, name })}
                    />
                    {/* 가격 입력 필드 (숫자만 허용) */}
                    <FormInput
                        placeholder="Price"
                        keyboardType="numeric"
                        value={product.price.toString()}
                        onChangeText={(price) => setProduct({ ...product, price })}
                    />
                    {/* 구매 날짜 선택 */}
                     <DatePicker
                        value={product.date}
                        title="Purchasing Date: "
                        onChange={(date) => setProduct({ ...product, date })}
                     />
                     {/* 카테고리 선택 */}
                     <CategoryOptions 
                        onSelect={(category) => setProduct({ ...product, category })}
                        title={product.category || "Category"}
                     />
                     {/* 상품 설명 입력 필드 */}
                     <FormInput
                        placeholder="Description"
                        value={product.description}
                        onChangeText={(description) =>
                            setProduct({ ...product, description })
                        }
                        multiline // ✅ 줄바꿈 허용
                        numberOfLines={4} // 입력창의 높이를 어느 정도 확보
                     />
                     {/* 상품 설명 입력 필드 */}
                     {!isFormChanged && (
                        <AppButton title="Update Product" onPress={handleOnSubmit} />
                     )}
                </ScrollView>
             </KeyboardAvoidingView>

            {/* 이미지 길게 누르면 나타나는 옵션 모달 (썸네일 설정, 삭제) */}
            <OptionModal 
                options={imageOptions}
                visible={showImageOptions}
                onRequestClose={setShowImageOptions}
                renderItem={(option) => {
                    return (
                        <Text style={styles.option}>
                            {option.value}
                        </Text>
                    );
                }}
                onPress={({ id }) => {
                    if (id === "thumb") makeSelectedImageAsThumbnail();
                    if (id === "remove") removeSelectedImage();
                }}
            />
            {/* API 요청 중일 때 로딩 스피너 표시 */}
            <LoadingSpinner visible={busy} />
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});