<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import CryptoJS from 'crypto-js';

const username = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  if (!username.value || !password.value) {
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  const success = await authStore.login(username.value, password.value);
  if (success) {
    alert(`${authStore.user.name}님, 로그인 성공 🎉`);
    router.push('/home');
  } else {
    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
  }
};
</script>

<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow bg-white"
      style="width: 414px; height: 896px; display: flex; flex-direction: column"
    >
      <div
        class="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4"
      >
        <h1 class="fw-bold mb-5" style="font-size: 24px; color: burlywood">
          <span class="d-block" style="font-size: 18px; color: #5e4b3c"
            >** 뱅크</span
          >
          <span class="text-warning">24시 간편한 자산관리</span>
        </h1>

        <!-- ✅ 폼으로 감싸기 -->
        <form class="w-100" @submit.prevent="login">
          <div class="mt-5 mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="아이디"
              v-model="username"
            />
          </div>
          <div class="mb-5">
            <input
              type="password"
              class="form-control"
              placeholder="비밀번호"
              v-model="password"
            />
          </div>

          <button
            type="submit"
            class="btn text-warning fw-bold w-100 mb-2"
            style="background-color: #5e4b3c"
          >
            로그인
          </button>
        </form>

        <div class="text-center mt-2" style="font-size: 14px">
          <router-link to="/terms" class="text-secondary text-decoration-none">
            회원가입
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
