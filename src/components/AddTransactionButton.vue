<template>
  <div class="add-button-container">
    <button class="add-button" @click="openTransactionModal">
      + 거래 내역 추가
    </button>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/modalStore';

const modal = useModalStore();

const openTransactionModal = () => {
  modal.selectedDate = null; // 새로운 거래니까 날짜 지정 없음
  modal.showForm = true; // 모달 열기
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
