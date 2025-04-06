/*
Axios 비동기 요청을 실행하고 결과 처리 (모든 HTTP 요청을 처리하는 헬퍼 함수)
*/

import { AxiosResponse, AxiosError } from "axios";
import { showMessage } from "react-native-flash-message";

// 1. 타입 정의 (실행 전 컴파일 타임에 처리)
// 성공 응답
type SuccessResponse<T> = {
    data: T; // 성공 시 데이터 포함
    error: null; // 에러는 null
};

// 에러 응답
type ErrorResponse<E> = {
    data: null; // 에러 시 데이터는 null
    error: E; // 에러 정보 포함
};

export const runAxiosAsync = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T | null> => {

    try {
        // 2. API 호출하고 응답이 올 때까지 대기
        const response = await promise;
        // 3. 성공 시 응답 데이터 반환하고 함수 종료
        return response.data;
    }
    catch (error) {
        // 4. 기본 에러 메시지 설정
        let message = (error as any).message;

        // 5. Axios 에러인 경우 응답에서 에러 메시지 추출
        if (error instanceof AxiosError) {
            const response = error.response;
            if (response) {
                // 6. 서버에서 전송한 에러 메시지가 있으면 사용
                message = response.data.message;
            }
        }

        // 7. 사용자에게 에러 메시지 표시 (토스트 메시지)
        showMessage({ message, type: "danger" });
    }

    // 8. 에러 발생 시 null 반환
    return null;

}