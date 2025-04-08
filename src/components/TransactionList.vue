<template>
  <div class="main-view">
    <!-- 💰 월별 수입/지출 요약 (일일 보기일 때만 표시) -->
    <div class="summary-box" v-if="viewMode === 'daily'">
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>

    <!-- 🗓️ 월 이동 버튼 -->
    <div class="month-navigation" v-if="viewMode === 'monthly'">
      <button @click="prevMonth">← 이전 달</button>
      <strong>{{ selectedMonth }}</strong>
      <button @click="nextMonth">다음 달 →</button>
    </div>

    <!-- 📋 일일 거래 리스트 -->
    <div v-if="viewMode === 'daily'">
      <TransactionItem
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>

    <!-- 📆 월별 달력 보기 -->
    <CalendarView
      v-if="viewMode === 'monthly'"
      :year="currentYear"
      :month="currentMonth"
      :transactions="transactions"
      @select-day="openDayTransactions"
    />

    <!-- ➕ 거래 추가 버튼 -->
    <button class="add-btn">＋</button>

    <!-- 📌 날짜 클릭 시 거래 내역 팝업 -->
    <BaseModal v-if="selectedDate" @close="selectedDate = null">
      <template #header>{{ selectedDate }} 거래 내역</template>
      <template #body>
        <TransactionItem
          v-for="tx in transactionsForSelectedDate"
          :key="tx.id"
          :transaction="tx"
        />
        <div v-if="transactionsForSelectedDate.length === 0">
          거래 내역이 없습니다.
        </div>
      </template>
      <template #footer>
        <button @click="selectedDate = null">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionItem from './TransactionItem.vue';
import CalendarView from '../views/CalendarView.vue';
import BaseModal from '../components/base/baseModal.vue';

const store = useTransactionStore();

const viewMode = ref('daily');
const selectedDate = ref(null);
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

const transactions = computed(() => store.transactions);

const filteredTransactions = computed(() =>
  transactions.value
    .filter((tx) => tx.date.startsWith(selectedMonth.value))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

const transactionsForSelectedDate = computed(() =>
  transactions.value.filter((tx) => tx.date === selectedDate.value)
);

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

const openDayTransactions = (date) => {
  selectedDate.value = date;
};
</script>

<style scoped>
.main-view {
  padding: 16px;
}

.summary-box {
  padding: 12px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: bold;
}

.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
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
</style>
