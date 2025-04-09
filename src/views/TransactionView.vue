<template>
  <div class="main-view">
    <h1>거래 내역</h1>

    <!-- 👇 보기 모드 선택 탭: 일일 / 월별 -->
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

    <!-- 💰 월간 수입/지출/순수입 요약 -->
    <div class="summary-box">
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>

    <!-- 📅 월 변경 네비게이션 -->
    <div class="month-navigation">
      <button @click="prevMonth">← 이전 달</button>
      <strong>{{ selectedMonth }}</strong>
      <button @click="nextMonth">다음 달 →</button>
    </div>

    <!-- 📋 일일 거래 리스트 -->
    <TransactionList
      v-if="viewMode === 'daily'"
      :selectedMonth="selectedMonth"
    />

    <!-- 📆 월별 거래 내역 (달력) -->
    <CalendarView
      v-if="viewMode === 'monthly'"
      :year="currentYear"
      :month="currentMonth"
      :transactions="transactions"
      @select-day="onSelectDay"
    />

    <!-- 🧾 모달: 특정 날짜 클릭 시 해당 거래 목록 + 추가 -->
    <BaseModal v-if="modal.selectedDate" @close="modal.close">
      <template #header>{{ modal.selectedDate }} 거래 내역</template>

      <template #body>
        <!-- 📄 해당 날짜의 거래 리스트 -->
        <TransactionItem
          v-for="tx in transactionsForSelectedDate"
          :key="tx.id"
          :transaction="tx"
        />

        <!-- ✨ 거래가 없을 경우 메시지 + 추가 버튼 -->
        <div v-if="transactionsForSelectedDate.length === 0 && !modal.showForm">
          거래 내역이 없습니다.
          <button class="add-button" @click="modal.showForm = true">
            ＋ 거래 추가
          </button>
        </div>

        <!-- ✍️ 거래 추가 폼 (팀원 컴포넌트 사용) -->
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
// 📦 스토어 및 유틸
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';

// 🧩 컴포넌트
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import BaseModal from '@/components/base/baseModal.vue';

// 🔧 상태 초기화
const viewMode = ref('daily');
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const store = useTransactionStore();
const modal = useModalStore();

// 🚀 컴포넌트 마운트 시 거래내역 fetch
onMounted(() => {
  store.fetchTransactions();
});

// 📅 YYYY-MM 문자열 반환
const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

// 📋 거래 리스트 필터링
const transactions = computed(() => store.transactions);
const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);
const transactionsForSelectedDate = computed(() =>
  store.transactions.filter((tx) => tx.date === modal.selectedDate)
);

// 💰 총합 계산
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

// ⬅️ 이전 달 이동
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// ➡️ 다음 달 이동
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 📆 날짜 클릭 시 모달 열기
const onSelectDay = (date) => {
  modal.open(date);
};

// ✅ 거래 추가 완료 시 동작
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
