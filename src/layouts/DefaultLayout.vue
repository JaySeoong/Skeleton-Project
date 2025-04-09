<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 네비게이션 바 -->
    <nav class="bg-white shadow-md p-4 flex gap-4">
      <RouterLink to="/home" class="font-semibold hover:text-blue-600"
        >🏠 홈</RouterLink
      >
      <RouterLink to="/transactions" class="font-semibold hover:text-blue-600"
        >💰거래내역</RouterLink
      >
      <RouterLink to="/dashboard" class="font-semibold hover:text-blue-600"
        >📊 통계</RouterLink
      >
      <RouterLink to="/profile" class="font-semibold hover:text-blue-600"
        >👤프로필설정</RouterLink
      >
    </nav>

    <!-- 실제 페이지 내용 -->
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.min-h-screen {
  max-width: 500px;
  margin: 0 auto;
}
</style>
