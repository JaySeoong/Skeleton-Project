<template>
  <!-- 거래 추가 버튼 영역 -->
  <div class="add-button-container">
    <!-- 버튼 클릭 시 모달 열기 -->
    <button class="add-button" @click="openTransactionModal">
      + 거래 추가
    </button>
  </div>
</template>

<script setup>
// 모달 상태 관리 스토어
import { useModalStore } from '@/stores/modalStore';

const modal = useModalStore();

//  거래 추가 버튼 클릭 시 동작
const openTransactionModal = () => {
  modal.selectedDate = null; // 새로운 거래니까 날짜 지정 없음
  modal.showForm = true; // 모달 열기
};
</script>

<style scoped>
/* 버튼 위치 중앙 정렬 */
.add-button-container {
  text-align: center;
  margin-top: 20px;
}

/* 버튼 스타일 */
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

/* 버튼 hover 효과 */
.add-button:hover {
  background-color: #5e4b3c;
  color: #ffc107;
}
</style>
