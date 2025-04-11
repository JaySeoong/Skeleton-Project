<template>
  <!-- 전체 뷰 박스: 화면 중앙에 고정된 390x844 사이즈 -->
  <div
    class="d-flex justify-content-center align-items-center heigt-100 bg-white"
  >
    <!-- 실제 앱 UI를 감싸는 박스 -->
    <div
      class="border shadow bg-white position-relative"
      style="width: 390px; height: 844px"
    >
      <!-- 콘텐츠 영역 (스크롤 허용) -->
      <div class="px-3 py-2 overflow-y-auto" style="height: 100%">
        <div class="main-view">
          <!-- 일일 / 월별 보기 모드 토글 -->
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

          <!-- 수입/지출/순수입 요약 박스 -->
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

          <!-- 월 이동 버튼 -->
          <div class="month-navigation">
            <button @click="prevMonth">← 이전 달</button>
            <strong>{{ selectedMonth }}</strong>
            <button @click="nextMonth">다음 달 →</button>
          </div>

          <!-- 일일 모드: 거래 리스트 출력 -->
          <TransactionList
            v-if="viewMode === 'daily'"
            :selectedMonth="selectedMonth"
          />

          <!-- 월별 모드: 캘린더 출력 -->
          <CalendarView
            v-if="viewMode === 'monthly'"
            :year="currentYear"
            :month="currentMonth"
            :transactions="transactions"
            @select-day="onSelectDay"
          />

          <!-- 거래 내역 모달 -->
          <BaseModal v-if="modal.selectedDate" @close="modal.close">
            <!-- 모달 헤더: 선택된 날짜 표시 -->
            <template #header>{{ modal.selectedDate }} 거래 내역</template>

            <!-- 모달 본문: 거래 리스트 or 입력 폼 -->
            <template #body>
              <!-- 거래 항목 리스트 -->
              <TransactionItem
                v-for="tx in transactionsForSelectedDate"
                :key="tx.id"
                :transaction="tx"
              />

              <!-- 거래가 없을 때 안내 메시지 -->
              <div
                v-if="
                  transactionsForSelectedDate.length === 0 && !modal.showForm
                "
                class="text-center my-3 text-muted"
              >
                거래 내역이 없습니다.
              </div>

              <!-- 거래 추가 폼 -->
              <TransactionForm
                v-if="modal.showForm"
                :date="modal.selectedDate"
                @completed="onAddComplete"
              />
            </template>

            <!-- 모달 하단 버튼 -->
            <template #footer>
              <!-- 거래 추가 버튼 (폼 열기) -->
              <button
                class="btn btn-outline-primary me-2"
                @click="modal.showForm = true"
                :disabled="modal.showForm"
              >
                ＋ 거래 추가
              </button>

              <!-- 저장 버튼 (폼 있을 때만) -->
              <button
                v-if="modal.showForm"
                class="btn btn-primary me-2"
                form="transactionForm"
                type="submit"
              >
                저장
              </button>

              <!-- 닫기 버튼 -->
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
// ✅ Composition API로 구성된 setup 스크립트

// 뷰에서 제공하는 반응형 함수 import
import { ref, computed, onMounted } from 'vue';

// 핀니아 스토어 import
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';

// 컴포넌트 import
import TransactionList from '@/components/TransactionList.vue';
import CalendarView from '@/views/CalendarView.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import BaseModal from '@/components/base/baseModal.vue';

// 보기 모드 상태: 일일 / 월별
const viewMode = ref('daily');

// 현재 연도, 월
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

// 스토어 상태
const store = useTransactionStore();
const modal = useModalStore();

// 마운트 시 거래내역 불러오기
onMounted(() => {
  store.fetchTransactions();
});

// 선택된 월 (YYYY-MM 형태 문자열)
const selectedMonth = computed(() => {
  const y = currentYear.value;
  const m = (currentMonth.value + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

// 전체 거래내역
const transactions = computed(() => store.transactions);

// 선택된 월의 거래내역 필터링
const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);

// 선택된 날짜의 거래 필터링 (모달용)
const transactionsForSelectedDate = computed(() =>
  store.transactions.filter((tx) => tx.date === modal.selectedDate)
);

// 총 수입 계산
const totalIncome = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 총 지출 계산
const totalExpense = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 순수입 계산
const netIncome = computed(() => totalIncome.value - totalExpense.value);

// 순수입에 따른 색상 클래스 반환
const netIncomeClass = computed(() => {
  if (netIncome.value > 0) return 'text-primary';
  if (netIncome.value < 0) return 'text-danger';
  return '';
});

// 이전 달로 이동
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// 다음 달로 이동
const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

// 캘린더에서 날짜 선택 → 모달 열기
const onSelectDay = (date) => {
  modal.open(date);
};

// 거래 추가 완료 시 → 거래 다시 불러오기
const onAddComplete = () => {
  store.fetchTransactions();
  modal.showForm = false;
};
</script>

<style scoped>
/* 보기 모드 토글 버튼 영역 */
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

/* 수입/지출 요약 박스 */
.summary-box {
  background: #ffc107;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
}

/* 월 변경 네비게이션 영역 */
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

/* 거래 추가 버튼 스타일 */
.add-button {
  margin-top: 12px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #5e4b3c;
  color: white;
  cursor: pointer;
}
.add-button:hover {
  background-color: #357bd8;
}
</style>
