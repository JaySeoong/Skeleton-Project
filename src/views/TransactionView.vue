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

    <!-- 월 이동 (공통) -->
    <div class="month-navigation">
      <button @click="prevMonth">← 이전 달</button>
      <strong>{{ selectedMonth }}</strong>
      <button @click="nextMonth">다음 달 →</button>
    </div>

    <!-- 일일 거래 리스트 -->
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
      @select-day="onSelectDay"
    />

    <!-- 모달: 날짜 클릭 시 열림 -->
    <BaseModal v-if="modal.selectedDate" @close="modal.close">
      <template #header>{{ modal.selectedDate }} 거래 내역</template>

      <template #body>
        <TransactionItem
          v-for="tx in transactionsForSelectedDate"
          :key="tx.id"
          :transaction="tx"
        />

        <div v-if="transactionsForSelectedDate.length === 0">
          거래 내역이 없습니다.
          <button class="add-button" @click="modal.showForm = true">
            ＋ 거래 추가
          </button>
        </div>

        <!-- 거래 추가 폼 (팀원 컴포넌트) -->
        <TransactionForm
          v-if="modal.showForm"
          :date="modal.selectedDate"
          @completed="onAddComplete"
        />
      </template>

      <template #footer>
        <button @click="modal.close">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';

import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionItem from '@/components/TransactionItem.vue';
// import TransactionForm from '@/components/TransactionForm.vue';
import BaseModal from '@/components/base/baseModal.vue';

const viewMode = ref('daily');
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const store = useTransactionStore();
const modal = useModalStore();

onMounted(() => {
  store.fetchTransactions();
});

const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

const transactions = computed(() => store.transactions);
const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);
const transactionsForSelectedDate = computed(() =>
  store.transactions.filter((tx) => tx.date === modal.selectedDate)
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

const onSelectDay = (date) => {
  modal.open(date);
};

const onAddComplete = () => {
  store.fetchTransactions();
  modal.showForm = false;
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

.add-button {
  margin-top: 12px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: #4a90e2;
  color: white;
  cursor: pointer;
}
.add-button:hover {
  background-color: #357bd8;
}
</style>
