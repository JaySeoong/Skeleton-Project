<template>
  <!-- 인트로 화면(로그인 직전 3초간 작동) -->
  <div
    class="mx-auto loginWrapper"
    style="max-width: 414px; max-height: 896px; border: 1px solid black"
  >
    <div
      class="d-flex flex-column justify-content-center align-items-center vh-100 py-4"
      style="background-color: white"
    >
      <!-- 메인 콘텐츠 -->
      <div class="text-center mt-auto">
        <p class="text-warning fw-bold mb-2 fs-3">세상을 바꾸는 금융</p>
        <div class="bg-secondary text-white px-4 py-2 fw-bold rounded mb-4">
          <div class="text-white p-2 fs-1">**뱅크</div>
        </div>
      </div>

      <!-- 로딩 텍스트 -->
      <div class="text-secondary mb-auto mt-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- 하단 문구 -->
      <div class="text-center small text-dark fw-semibold mb-5">
        고객의 행복과 더 나은 세상을 만들어 갑니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push('/login'); // 3초 뒤 로그인 페이지로 이동
  }, 3000);
});
</script>

<style scoped>
.loginWrapper {
  width: 414px;
  height: 896px; /* 높이 고정 */
  /* overflow-y: auto; */
  box-sizing: border-box;
  border: 1px solid black;
}
</style>
