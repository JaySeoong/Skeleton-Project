<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 네비게이션 바 -->

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
