<template>
  <div class="add-button-container">
    <button class="add-button" @click="goToTransactions">
      + 거래 내역 추가
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 👉 '/transactions' 경로로 이동 (거래 내역 등록 화면)
const goToTransactions = () => {
  router.push('/inputview');
};
</script>

<style scoped>
.add-button-container {
  text-align: center;
  margin-top: 20px;
}

.add-button {
  background-color: #5e4b3c;
  color: white;
  padding: 0px 10px;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  /* font-weight: bold; */
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #5e4b3c;
  color: #ffc107;
}
</style>
