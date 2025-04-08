<template>
  <div>
    <h1>거래 내역</h1>

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

    <!-- ✅ 월별 합계 표시 위치는 여기 -->
    <div class="monthly-summary" v-if="viewMode === 'monthly'">
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>

    <!-- ✅ 월별 이동 -->
    <div class="month-navigation" v-if="viewMode === 'monthly'">
      <button @click="prevMonth">← 이전 달</button>
      <strong>{{ selectedMonth }}</strong>
      <button @click="nextMonth">다음 달 →</button>
    </div>

    <!-- ✅ 월별 달력 -->
    <CalendarView
      v-if="viewMode === 'monthly'"
      :year="currentYear"
      :month="currentMonth"
      :transactions="transactions"
      @select-day="openDayModal"
    />

    <!-- ✅ 일일 거래 리스트 -->
    <TransactionList
      v-if="viewMode === 'daily'"
      :selectedMonth="selectedMonth"
    />

    <!-- ✅ 하루치 모달 -->
    <BaseModal v-if="selectedDate" @close="selectedDate = null">
      <template #header> {{ selectedDate }} 거래 내역 </template>
      <template #body>
        <TransactionItem
          v-for="tx in transactionsForSelectedDate"
          :key="tx.id"
          :transaction="tx"
        />
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
import BaseModal from '@/components/base/baseModal.vue';

const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});
// 계산로직
const transactionsForMonth = computed(() =>
  transactions.value.filter((tx) => tx.date.startsWith(selectedMonth.value))
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
const transactionsForSelectedDate = computed(() =>
  transactions.value.filter((tx) => tx.date === selectedDate.value)
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
</script>
