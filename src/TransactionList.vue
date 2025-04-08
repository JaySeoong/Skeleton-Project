<template>
  <div class="main-view">
    <header class="header">
      <!-- 기존 header 내용 유지 -->
    </header>

    <div v-if="viewMode === 'daily'">
      <TransactionItem
        v-for="transaction in sortedTransactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>

    <CalendarView
      v-if="viewMode === 'monthly'"
      :year="currentYear"
      :month="currentMonth"
      :transactions="transactions"
      @select-day="openDayTransactions"
    />

    <button class="add-btn">＋</button>

    <!-- 기존 BaseModal을 활용한 날짜별 상세 내역 표시 -->
    <BaseModal v-if="selectedDate" @close="selectedDate = null">
      <template #header>{{ selectedDate }} 거래 내역</template>

      <template #body>
        <ul class="transaction-list">
          <li v-for="tx in transactionsForSelectedDate" :key="tx.id">
            <span>{{ tx.category }} | {{ tx.memo }}</span>
            <span>{{ tx.amount.toLocaleString() }} 원</span>
          </li>
          <li v-if="transactionsForSelectedDate.length === 0">
            거래 내역이 없습니다.
          </li>
        </ul>
      </template>

      <template #footer>
        <button @click="selectedDate = null">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TransactionItem from './TransactionItem.vue';
import CalendarView from '../views/CalendarView.vue';
import BaseModal from '../components/base/baseModal.vue';

import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

const viewMode = ref('daily');
const selectedDate = ref(null);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const transactions = computed(() => store.transactions);
const sortedTransactions = computed(() =>
  transactions.value.sort((a, b) => new Date(b.date) - new Date(a.date))
);

const transactionsForSelectedDate = computed(() =>
  transactions.value.filter((tx) => tx.date === selectedDate.value)
);

const openDayTransactions = (date) => {
  selectedDate.value = date;
};
</script>

<style scoped>
.main-view {
  padding: 16px;
}

.add-btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #4a4a4a;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.transaction-list {
  padding: 0;
  list-style: none;
}

.transaction-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
</style>
