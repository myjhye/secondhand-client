/*
Redux 상태와 AsyncStorage 기반으로 액세스 토큰을 자동 갱신하며, 인증된 Axios 요청을 처리하는 커스텀 훅
(로그인된 사용자 토큰을 자동으로 헤더에 넣고, 만료되면 리프레시 토큰으로 갱신까지 처리)
*/
import { baseURL } from "app/api/client";
import { getAuthState, updateAuthState } from "app/store/auth";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import asyncStorage, { Keys } from "@utils/asyncStorage";

// 1. 인증 요청용 Axios 인스턴스 생성
const authClient = axios.create({ baseURL });

// 2. 액세스/리프레시 토큰 응답 타입 정의
export type TokenResponse = {
  tokens: {
    refresh: string;
    access: string;
  };
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
};

// 3. 사용자 인증 클라이언트 훅 정의
const useClient = () => {

    // 4. Redux 상태에서 현재 인증 상태 가져오기
    const authState = useSelector(getAuthState);
    const dispatch = useDispatch();

    // 5. 현재 엑세스 토큰 추출
    const token = authState.profile?.accessToken;
    
    // 6. Axios 요청 인터셉터 설정 (요청 보낼 때 헤더에 Authorization 추가)
    authClient.interceptors.request.use(
        (config) => {
            // headers가 undefined인 경우 기본 객체로 초기화
            if (!config.headers) {
                config.headers = {};
            }

            if (!config.headers.Authorization) {
                config.headers.Authorization = "Bearer " + token;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error); // 요청 에러 처리
        }
    );

    // 7. 액세스 토큰 만료 시 실행될 토큰 갱신 로직 정의
    const refreshAuthLogic = async (failedRequest: any) => {

        // 7-1. AsyncStorage에서 리프레시 토큰 가져오기
        const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);

        // 7-2. 리프레시 토큰으로 새 토큰 요청
        const options = {
            method: "POST",
            data: { refreshToken },
            url: `${baseURL}/auth/refresh-token`,
        };

        const res = await runAxiosAsync<TokenResponse>(axios(options));

        // 7-3. 응답에 새 토큰이 있다면
        if (res?.tokens) {
            // 7-4. 실패한 요청에 새 액세스 토큰으로 Authorization 헤더 갱신
            failedRequest.response.config.headers.Authorization = "Bearer " + res.tokens.access;

            // 7-5. 로그아웃 요청인 경우, 새 리프레시 토큰도 함께 전송
            if (failedRequest.response.config.url === "/auth/sign-out") {
                failedRequest.response.config.data = {
                    refreshToken: res.tokens.refresh,
                };
            }

            // 7-6. 새 토큰들을 AsyncStorage에 저장
            await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
            await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);

            // 7-7. Redux 상태 새로운 토큰으로 갱신
            dispatch(
                updateAuthState({
                    profile: { 
                        ...authState.profile!, 
                        accessToken: res.tokens.access 
                    },
                    pending: false,
                })
            );

            // 7-8. 갱신 성공 처리
            return Promise.resolve();
        }
    };

    // 8. 액세스 토큰 만료 시 위의 refreshAuthLogic 실행하도록 인터셉터 등록
    createAuthRefreshInterceptor(authClient, refreshAuthLogic);
    
    // 9. 인증용 Axios 인스턴스 반환
    return { authClient };

}

export default useClient;