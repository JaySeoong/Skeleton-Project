<template>
  <div>
    <!-- 📋 거래 리스트 표시: 해당 월의 거래만 필터링 -->
    <TransactionItem
      v-for="transaction in filteredTransactions"
      :key="transaction.id"
      :transaction="transaction"
    />

    <!-- ➕ 거래 추가 버튼: 클릭 시 모달 오픈 -->
    <div class="add-container">
      <button class="add-btn" @click="openAddModal">＋ 거래 추가</button>
    </div>

    <!-- 📦 거래 추가 모달 (일일 탭 전용): 날짜가 선택되지 않았을 때만 열림 -->
    <BaseModal
      v-if="modal.showForm && !modal.selectedDate"
      @close="modal.close"
    >
      <template #header>거래 추가</template>

      <template #body>
        <!-- ✍️ 거래 추가 입력 폼 (기본 날짜 전달) -->
        <TransactionForm :date="defaultDate" @completed="onAddComplete" />
      </template>

      <template #footer>
        <!-- ✅ 폼 submit 연결 -->
        <button class="btn btn-primary" form="transactionForm" type="submit">
          저장
        </button>
        <button @click="modal.close">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
// ✅ Pinia 스토어, 컴포넌트, 유틸 임포트
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';
import { useAuthStore } from '@/stores/authStore';
import TransactionItem from './TransactionItem.vue';
import BaseModal from '@/components/base/baseModal.vue';
import TransactionForm from '@/views/TransactionForm.vue';

// ✅ 현재 로그인 유저 가져오기 (사용자 식별용)
const authStore = useAuthStore();

// ✅ props로 부모로부터 현재 선택된 월을 받음 (예: '2025-04')
const props = defineProps({
  selectedMonth: String,
});

// ✅ 거래내역과 모달 상태를 Pinia에서 가져옴
const { transactions } = storeToRefs(useTransactionStore());
const modal = useModalStore();

// ✅ 선택된 월 + 로그인한 사용자에 해당하는 거래만 필터링
const filteredTransactions = computed(
  () =>
    transactions.value
      .filter(
        (tx) =>
          tx.date.startsWith(props.selectedMonth) &&
          tx.userId === authStore.user.id // 🔐 로그인된 사용자 ID 기준 필터링
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // 📆 최신순 정렬
);

// 📊 수입 총합 계산 (현재 미사용 중)
const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// 📉 지출 총합 계산 (현재 미사용 중)
const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// ➕ 거래 추가 버튼 클릭 → 모달 초기화 + 열기
const openAddModal = () => {
  modal.selectedDate = null; // 📅 선택된 날짜 초기화 (일일 탭에서만 사용)
  modal.showForm = true; // 모달 표시
};

// ✅ 거래 등록 완료 시 거래 목록 새로 불러오고 모달 닫기
const onAddComplete = () => {
  useTransactionStore().fetchTransactions(); // 최신 거래 불러오기
  modal.close();
};

// 📅 오늘 날짜를 'YYYY-MM-DD' 형식 문자열로 변환 (기본값 전달용)
const today = new Date();
const defaultDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
</script>

<style scoped>
/* ✅ 거래 요약 박스 스타일 (현재 사용 안됨) */
.summary-box {
  padding: 12px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: bold;
}

/* ➕ 거래 추가 버튼을 감싸는 컨테이너 */
.add-container {
  text-align: center;
  margin-top: 16px;
}

/* ➕ 거래 추가 버튼 스타일 */
.add-btn {
  background-color: #5e4b3c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.3s;
}

.add-btn:hover {
  color: #ffc107; /* 호버 시 포인트 색상 */
}
</style>
