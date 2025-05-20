import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";

// 이미지 선택 함수 (사용자의 갤러리에서 하나 이상의 이미지를 선택하고, 선택된 이미지의 URI를 반환)
export const selectImages = async (options?: ImagePicker.ImagePickerOptions) => {

    // 1. 선택된 이미지 URI 담는 배열 초기화
    let result: string[] = [];

    try {
        // 2. 이미지 라이브러리 실행
        const { assets } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false, // 편집 불가
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // 이미지 타입만
            quality: 0.3, // 퀄리티 조정
            allowsMultipleSelection: true, // 다중 선택 허용
            ...options, // 외부에서 전달된 옵션 병합
        });


        // 3. 이미지가 선택된 경우, 각 이미지의 uri만 추출해 result 배열에 저장
        if (assets) {
            result = assets.map(({ uri }) => uri);
        }
    }
    catch (error) {
        showMessage({ message: (error as any).message, type: "danger" });
    }

    return result;
}


export const debounce = <T extends (...args: any[]) => void>(func: T, timeout: number) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, timeout);
  };
};