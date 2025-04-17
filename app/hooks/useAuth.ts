/*
커스텀 훅(로그인)
*/

import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { getAuthState, updateAuthState } from "app/store/auth";
import { useDispatch, useSelector } from "react-redux";


// 1. 로그인 응답 타입 정의 (서버에서 돌아오는 데이터 구조)
export interface SignInRes {
    profile: {
        id: string;
        email: string;
        name: string;
        verified: boolean;
        avatar?: string;
    };
    tokens: {
        refresh: string;
        access: string;
    };
}


// 2. 사용자 입력 정보 타입 정의 (이메일, 비밀번호)
type UserInfo = {
    email: string;
    password: string;
};


// 3. 커스텀 훅 정의 시작 (useAuth)
export default function useAuth() {

    // 4. Redux의 dispatch, 현재 auth 상태 가져오기
    const dispatch = useDispatch();
    const authState = useSelector(getAuthState);

    // 5. 로그인 함수 정의
    const signIn = async (userInfo: UserInfo) => {

        // 5-1. 로그인 시작 시 로딩 상태 true, 프로필 null로 초기화
        dispatch(updateAuthState({ 
            profile: null, 
            pending: true 
        }));

        // 5-2. 서버에 로그인 요청
        const res = await runAxiosAsync<SignInRes>(
            client.post("/auth/sign-in", userInfo)
        );

        // 5-3. 응답이 있다면 (성공)
        if (res) {
            // 5-3-1. 토큰을 AsyncStorage에 저장
            await AsyncStorage.setItem("access-token", res.tokens.access);
            await AsyncStorage.setItem("refresh-token", res.tokens.refresh);
            
            // 5-3-2. Redux 상태에 사용자 프로필 저장, 로딩 상태 false로 전환
            dispatch(updateAuthState({ 
                profile: res.profile, 
                pending: false 
            }));
        } 

        // 5-4. 실패 시 로딩 false + 프로필 초기화
        else {
            dispatch(updateAuthState({ 
                profile: null, 
                pending: false 
            }));
        }
    }


    // 6. 로그인 여부를 boolean으로 계산
    const loggedIn = authState.profile ? true : false;


    // 7. 외부에서 사용할 함수/상태 리턴
    return { signIn, authState, loggedIn };

}