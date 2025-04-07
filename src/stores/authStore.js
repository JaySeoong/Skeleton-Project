// 로그인 상태, 사용자 정보 저장 및 갱신
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isLoggedIn = ref(false);

  const login = (userInfo: any) => {
    user.value = userInfo;
    isLoggedIn.value = true;
  };

  const logout = () => {
    user.value = null;
    isLoggedIn.value = false;
  };

  return { user, isLoggedIn, login, logout };
});
