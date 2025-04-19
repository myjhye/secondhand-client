/*
Redux에서 로그인 상태(프로필 정보, 로딩 여부)를 저장하고 업데이트하는 Slice
로그인 상태 업데이트를 위한 액션(updateAuthState)과 상태 조회를 위한 셀렉터(getAuthState)를 제공
*/

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";


// 1. 사용자 프로필 타입 정의 (서버에서 받아오는 유저 정보 형식과 일치)
export type Profile = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatar?: string;
  accessToken: string;
};

// 2. 로그인 관련 상태 구조 정의
interface AuthState {
  profile: null | Profile; // 사용자 정보 (로그인 시 설정됨)
  pending: boolean; // 로딩 중 여부 (로그인 요청 중 true)
}


// 3. 초기 상태 설정: 로그인 안 되어 있고 로딩도 아님
const initialState: AuthState = {
  pending: false,
  profile: null,
};


// 4. createSlice로 auth 상태를 위한 slice 생성
const authSlice = createSlice({
  name: "auth", // slice 이름 (Redux devtools 등에서 사용됨)
  initialState, // 초기 상태 등록
  reducers: {
    // 4-1. 로그인 상태를 업데이트하는 액션 정의
    updateAuthState(authState, { payload }: PayloadAction<AuthState>) {
      authState.pending = payload.pending;
      authState.profile = payload.profile;
    },
  },
});

// 5. 액션 함수 export (useDispatch로 사용 가능)
export const { updateAuthState } = authSlice.actions;

// 6. Redux 상태 트리에서 auth 상태만 선택하는 셀렉터 정의
export const getAuthState = createSelector(
  (state: RootState) => state, // 전체 상태에서
  (state) => state.auth // auth 상태만 추출
);


// 7. 이 slice의 reducer를 기본 내보내기 (store에 등록할 때 사용됨)
export default authSlice.reducer;