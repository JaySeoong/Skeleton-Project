// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';

export const useAuthStore = defineStore('auth', () => {
  //  전역으로 관리할 상태
  const user = ref(null); // 로그인한 사용자 정보
  const isLoggedIn = ref(false); // 로그인 여부

  //  로그인
  const login = async (id, password) => {
    try {
      const res = await axios.get(`http://localhost:3000/users?id=${id}`);
      if (res.data.length === 0) return false;

      const foundUser = res.data[0];
      const hash = CryptoJS.SHA256(foundUser.salt + password).toString();

      if (hash === foundUser.password) {
        user.value = foundUser;
        isLoggedIn.value = true;
        localStorage.setItem('user', JSON.stringify(foundUser)); // 로그인 상태 저장
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      return false;
    }
  };

  //  회원가입
  const register = async (newUser) => {
    try {
      const res = await axios.post('http://localhost:3000/users', newUser);
      user.value = res.data;
      isLoggedIn.value = true;
      localStorage.setItem('user', JSON.stringify(res.data)); // 로그인 상태 저장
      return true;
    } catch (err) {
      console.error('회원가입 에러:', err);
      return false;
    }
  };

  //  사용자 정보 수정
  const updateUser = async (updatedUser) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/users/${updatedUser.id}`,
        updatedUser
      );
      user.value = res.data;
      localStorage.setItem('user', JSON.stringify(res.data));
      return true;
    } catch (err) {
      console.error('수정 에러:', err);
      return false;
    }
  };

  //  로그아웃
  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;
    localStorage.removeItem('user');
  };

  //  회원 탈퇴
  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${user.value.id}`);
      logout(); // 상태 초기화
    } catch (err) {
      console.error('회원 탈퇴 에러:', err);
    }
  };

  return {
    user,
    isLoggedIn,
    login,
    register,
    updateUser,
    logout,
    deleteUser,
  };
});
