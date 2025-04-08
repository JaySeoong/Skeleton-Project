import api from './api';

// 로그인 요청 처리
export const loginUser = (credentials) => {
  return api.post('/users/login', credentials);
};

export const registerUser = (newUser) => {
  return api.post('/users', newUser);
};
