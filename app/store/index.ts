/*
Redux 스토어를 생성하고 설정
여러 Reducer를 하나로 합치고, 
최종 스토어를 만들어 내보냅니다.
*/

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import listingReducer from "./listings";
import conversationReducer from "./conversation"; 

// 1. 여러 slice 리듀서를 하나로 합침
const reducers = combineReducers({
  auth: authReducer,
  listing: listingReducer,
  conversation: conversationReducer,
});

// 2. Redux 스토어 생성
const store = configureStore({ reducer: reducers });

// 3. 전체 state 타입 추출 (타입스크립트용)
export type RootState = ReturnType<typeof store.getState>;

// 4. store를 export → 앱 전체에서 사용
export default store;