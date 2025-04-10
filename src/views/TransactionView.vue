<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 고정 크기 뷰 박스 -->
    <div
      class="border shadow bg-white position-relative"
      style="width: 390px; height: 844px"
    >
      <!-- ✅ 콘텐츠 영역 -->
      <div class="px-3 py-2 overflow-y-auto" style="height: 100%">
        <div class="main-view">
          <!-- 보기 모드 선택 -->
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

          <!-- 요약 박스 -->
          <div class="summary-box">
            <div>
              <span class="text-primary"
                >총 수입: {{ totalIncome.toLocaleString() }} 원</span
              >
            </div>
            <div>
              <span class="text-danger"
                >총 지출: {{ totalExpense.toLocaleString() }} 원</span
              >
            </div>
            <div :class="netIncomeClass">
              <strong>순 수입:</strong> {{ netIncome.toLocaleString() }} 원
            </div>
          </div>

          <!-- 월 변경 -->
          <div class="month-navigation">
            <button @click="prevMonth">← 이전 달</button>
            <strong>{{ selectedMonth }}</strong>
            <button @click="nextMonth">다음 달 →</button>
          </div>

          <!-- 리스트 or 달력 -->
          <TransactionList
            v-if="viewMode === 'daily'"
            :selectedMonth="selectedMonth"
          />
          <CalendarView
            v-if="viewMode === 'monthly'"
            :year="currentYear"
            :month="currentMonth"
            :transactions="transactions"
            @select-day="onSelectDay"
          />

          <!-- 거래 내역 모달 -->
          <BaseModal v-if="modal.selectedDate" @close="modal.close">
            <template #header>{{ modal.selectedDate }} 거래 내역</template>

            <template #body>
              <!-- 거래 리스트 -->
              <TransactionItem
                v-for="tx in transactionsForSelectedDate"
                :key="tx.id"
                :transaction="tx"
              />

              <!-- 거래가 없을 경우 안내 -->
              <div
                v-if="
                  transactionsForSelectedDate.length === 0 && !modal.showForm
                "
                class="text-center my-3 text-muted"
              >
                거래 내역이 없습니다.
              </div>

              <!-- 거래 입력 폼 -->
              <TransactionForm
                v-if="modal.showForm"
                :date="modal.selectedDate"
                @completed="onAddComplete"
              />
            </template>

            <template #footer>
              <!-- 거래 추가: 항상 표시, 폼 열리면 비활성화 -->
              <button
                class="btn btn-outline-primary me-2"
                @click="modal.showForm = true"
                :disabled="modal.showForm"
              >
                ＋ 거래 추가
              </button>

              <!-- 저장: 폼 열렸을 때만 -->
              <button
                v-if="modal.showForm"
                class="btn btn-primary me-2"
                form="transactionForm"
                type="submit"
              >
                저장
              </button>

              <!-- 닫기: 항상 표시 -->
              <button class="btn btn-secondary" @click="modal.close">
                닫기
              </button>
            </template>
          </BaseModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import TransactionForm from '@/views/TransactionForm.vue';
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
const netIncome = computed(() => totalIncome.value - totalExpense.value);
const netIncomeClass = computed(() => {
  if (netIncome.value > 0) return 'text-primary';
  if (netIncome.value < 0) return 'text-danger';
  return '';
});

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
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 12px 0;
}
.view-toggle button {
  flex: 1;
  background: none;
  border: none;
  font-size: 1rem;
  padding: 8px 16px;
  color: #333;
  cursor: pointer;
  position: relative;
  border-radius: 12px 12px 0 0;
  transition: all 0.3s;
}
.view-toggle button.active {
  background-color: white;
  color: #5e4b3c;
  font-weight: bold;
}
.view-toggle button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #5e4b3c;
  border-radius: 4px 4px 0 0;
}

.summary-box {
  background: #ffc107;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: #f8f8f8;
  padding: 8px 0;
}

.month-navigation button {
  border: 1px solid #000;
  background: white;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 6px;
  transition: background 0.3s;
}
.month-navigation button:hover {
  background: #eee;
}

.add-button {
  margin-top: 12px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #5e4b3c;
  color: #ffc107;
  color: white;
  cursor: pointer;
}
.add-button:hover {
  background-color: #357bd8;
}
</style>
