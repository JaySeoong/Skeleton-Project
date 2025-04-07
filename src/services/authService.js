import api from './api';

// 로그인 요청 처리 ('any' 대신 타입 지정 필요)
export const loginUser = (credentials: any) => {
  return api.post('/users/login', credentials);
};

export const registerUser = (newUser: any) => {
  return api.post('/users', newUser);
};
