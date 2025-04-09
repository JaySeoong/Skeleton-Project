<template>
  <!-- 전체 화면 가운데 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 고정된 로그인 박스 -->
    <div
      class="border shadow bg-white"
      style="width: 414px; height: 896px; display: flex; flex-direction: column"
    >
      <!-- 중앙 영역 -->
      <div
        class="d-flex flex-column justify-content-center align-items-center flex-grow-1 px-4"
      >
        <!-- 타이틀 -->
        <h1 class="fw-bold mb-5" style="font-size: 24px; color: burlywood">
          <span class="d-block" style="font-size: 18px; color: #5e4b3c"
            >** 뱅크</span
          >
          <span class="text-warning">24시 간편한 자산관리</span>
        </h1>

        <!-- 아이디 입력 -->
        <div class="mt-5 mb-3 w-100">
          <input
            type="text"
            class="form-control"
            placeholder="아이디를 입력하세요"
            v-model="username"
            style="background-color: aliceblue"
          />
        </div>

        <!-- 비밀번호 입력 -->
        <div class="mb-5 w-100">
          <input
            type="password"
            class="form-control"
            placeholder="비밀번호를 입력하세요"
            v-model="password"
            style="background-color: aliceblue"
          />
        </div>

        <!-- 로그인 버튼 -->
        <button
          class="btn text-warning fw-bold w-100 mb-2"
          @click="login"
          style="background-color: #5e4b3c"
        >
          로그인
        </button>

        <!-- ✅ 로그인 버튼 아래 회원가입 -->
        <div class="text-center mt-2" style="font-size: 14px">
          <router-link to="/terms" class="text-secondary text-decoration-none">
            회원가입
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        alert('아이디와 비밀번호를 모두 입력해주세요.');
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3000/users?id=${this.username}`
        );
        if (res.data.length === 0) {
          alert('존재하지 않는 아이디입니다.');
          return;
        }

        const user = res.data[0];
        const inputHash = CryptoJS.SHA256(user.salt + this.password).toString();
        const isMatch = inputHash === user.password;

        if (isMatch) {
          alert(`${user.name}님, 로그인 성공 🎉`);
        } else {
          alert('비밀번호가 일치하지 않습니다.');
        }
      } catch (error) {
        alert('로그인 오류: ' + error.message);
      }
    },
  },
};
</script>
