<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow bg-white position-relative"
      style="width: 414px; height: 896px"
    >
      <!-- 내용 영역 -->
      <div
        class="p-4 justify-content-center"
        style="height: calc(100% - 120px); overflow-y: auto"
      >
        <!-- 네비게이션 바 -->
        <nav
          class="d-flex bg-white shadow-md p-4 flex gap-4"
          style="width: 100%"
        >
          <ul class="d-flex gap-4 list-unstyled">
            <li>
              <RouterLink
                to="/home"
                class="font-semibold text-decoration-none text-dark hover:text-primary"
              >
                홈
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/transactions"
                class="font-semibold text-decoration-none hover:text-primary"
                style="
                  background-color: #6c757d;
                  opacity: 0.7;
                  padding: 3px 10px;
                  color: white;
                  border-radius: 5px;
                "
              >
                거래내역
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/dashboard"
                class="font-semibold text-decoration-none text-dark hover:text-primary"
              >
                통계
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/profile"
                class="font-semibold text-decoration-none text-dark hover:text-primary"
              >
                설정
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="main-view">
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
            <div>
              <span style="font-weight: bold">총 수입: </span
              >{{ totalIncome.toLocaleString() }} 원
            </div>
            <div>
              <span style="font-weight: bold">총 지출:</span>
              {{ totalExpense.toLocaleString() }} 원
            </div>
            <div>
              <span style="font-weight: bold"> 순수입 : </span
              >{{ (totalIncome - totalExpense).toLocaleString() }} 원
            </div>
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
              <div
                v-if="
                  transactionsForSelectedDate.length === 0 && !modal.showForm
                "
              >
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
      </div>
    </div>
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
  background: #ffc107;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  /* font-weight: bold; */
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
.tx-label {
  font-size: 14px;
  color: #555;
}

.income {
  color: #4caf50;
  font-weight: bold;
}

.expense {
  color: #f44336;
  font-weight: bold;
}
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
</style>
