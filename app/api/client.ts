/*
API 클라이언트 설정 파일(서버와 통신하기 위한 기본 설정을 담은 파일)
*/

import axios from "axios";

// 1. 서버 주소
const baseURL = "http://192.168.35.198:8000";
// 2. axios 전역 인스턴스
const client = axios.create({ baseURL });

export default client;