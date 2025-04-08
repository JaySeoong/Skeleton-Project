<template>
  <div class="main-view">
    <h1>거래 내역</h1>

    <!-- 보기 모드 전환 -->
    <div class="view-toggle">
      <button
        @click="viewMode = 'daily'"
        :class="{ active: viewMode === 'daily' }"
      >
        일일
      </button>
      <button
        @click="viewMode = 'monthly'"
        :class="{ active: viewMode === 'monthly' }"
      >
        월별
      </button>
    </div>

    <!-- 💰 월별 수입/지출 요약 -->
    <div class="summary-box">
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>

    <!-- 월 이동 (일일/월별 공통으로 표시) -->
    <div class="month-navigation">
      <button @click="prevMonth">← 이전 달</button>
      <strong>{{ selectedMonth }}</strong>
      <button @click="nextMonth">다음 달 →</button>
    </div>

    <!-- 일일 거래 목록 -->
    <TransactionList
      v-if="viewMode === 'daily'"
      :selectedMonth="selectedMonth"
    />

    <!-- 월별 달력 -->
    <CalendarView
      v-if="viewMode === 'monthly'"
      :year="currentYear"
      :month="currentMonth"
      :transactions="transactions"
      @select-day="openDayModal"
    />

    <!-- 날짜 클릭 시 모달 -->
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
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import BaseModal from '@/components/base/baseModal.vue';

const store = useTransactionStore();
onMounted(() => store.fetchTransactions());

const viewMode = ref('daily');
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

const selectedDate = ref(null);
const openDayModal = (date) => {
  selectedDate.value = date;
};

const transactions = computed(() => store.transactions);
const transactionsForMonth = computed(() =>
  transactions.value.filter((tx) => tx.date.startsWith(selectedMonth.value))
);
const transactionsForSelectedDate = computed(() =>
  transactions.value.filter((tx) => tx.date === selectedDate.value)
);

const totalIncome = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);
const totalExpense = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};
</script>

<style scoped>
.view-toggle button {
  margin-right: 8px;
}
.summary-box {
  background: #f4f4f4;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  font-weight: bold;
}
.month-navigation {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}
</style>
