<template>
  <div class="transaction-view">
    <!-- 🔹 네비게이션 탭 -->
    <nav class="tab-nav">
      <button
        :class="{ active: viewMode === 'daily' }"
        @click="viewMode = 'daily'"
      >
        일일
      </button>
      <button
        :class="{ active: viewMode === 'monthly' }"
        @click="viewMode = 'monthly'"
      >
        월별
      </button>
    </nav>

    <!-- 🔹 일일 거래 내역 -->
    <div v-if="viewMode === 'daily'">
      <TransactionList />
    </div>

    <!-- 🔹 월별 거래 내역 -->
    <div v-else-if="viewMode === 'monthly'">
      <CalendarView @select-day="openDayPopup" />
    </div>

    <!-- 🔹 팝업 (거래 상세/수정/삭제) -->
    <Modal v-if="selectedTransaction" @close="selectedTransaction = null">
      <div class="popup-content">
        <p>
          {{ selectedTransaction.memo }} - {{ selectedTransaction.amount }}원
        </p>
        <button @click="editTransaction(selectedTransaction)">수정</button>
        <button @click="deleteTransaction(selectedTransaction.id)">삭제</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from './CalendarView.vue'; // 월별 뷰용 컴포넌트
import Modal from '../components/base/baseModal.vue'; // 팝업 컴포넌트

const store = useTransactionStore();
const viewMode = ref('daily'); // 'daily' or 'monthly'
const selectedTransaction = ref(null);

const openDayPopup = (transaction) => {
  selectedTransaction.value = transaction;
};

const editTransaction = (tx) => {
  alert(`${tx.id}번 거래 수정`);
};

const deleteTransaction = (id) => {
  if (confirm('정말 삭제할까요?')) {
    store.deleteTransaction(id);
    selectedTransaction.value = null;
  }
};
</script>

<style scoped>
.tab-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.tab-nav button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
