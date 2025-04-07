import axios from 'axios';

// axios 인스턴스 생성(기본 설정 공통 적용)
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
