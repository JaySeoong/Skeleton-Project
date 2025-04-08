<template>
  <!-- 로그인 전체 래퍼 -->
  <div
    class="container d-flex flex-column align-items-center justify-content-center border shadow loginWrapper"
    style="max-width: 414px; max-height: 896px; background-color: #fff"
  >
    <!-- 타이틀 -->
    <h1 class="mb-4 fw-bold" style="font-size: 24px; color: burlywood">
      <span class="d-block mt-3 text-warning" style="font-size: 16px"
        >**뱅크</span
      >
      <span> 24시 간편한 자산관리</span>
    </h1>

    <!-- 아이디 입력창 -->
    <div class="mt-5 mb-3 w-100">
      <input
        type="text"
        class="form-control"
        placeholder="아이디를 입력하세요"
        v-model="username"
      />
    </div>

    <!-- 비밀번호 입력창 -->
    <div class="mb-3 w-100">
      <input
        type="password"
        class="form-control"
        placeholder="비밀번호를 입력하세요"
        v-model="password"
      />
    </div>

    <!-- 로그인 버튼 -->
    <button class="btn w-100 mb-3 mt-5 bg-warning" @click="login">
      로그인
    </button>

    <div
      class="d-flex justify-content-center w-100 mb-4"
      style="font-size: 14px"
    >
      <router-link
        to="/terms"
        class="text-decoration-none text-secondary"
        style="cursor: pointer"
      >
        회원가입
      </router-link>
    </div>
  </div>
</template>

<script>
// 로그인 로직 (아이디/비밀번호 확인)
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  data() {
    return {
      username: '', // 아이디
      password: '', // 비밀번호
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

        // 해시 처리된 비밀번호 비교
        const inputHash = CryptoJS.SHA256(user.salt + this.password).toString();
        const isMatch = inputHash === user.password;

        if (isMatch) {
          alert(`${user.name}님, 로그인 성공!`);
          // 여기서 토큰 저장 또는 홈으로 이동 등 처리 가능
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

<style scoped>
.loginWrapper {
  width: 414px;
  height: 896px;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid black;
}
</style>
