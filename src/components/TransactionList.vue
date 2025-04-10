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

    <!-- 📦 거래 추가 모달: selectedDate가 없는 상태에서만 표시 (일일 추가 용도) -->
    <BaseModal
      v-if="modal.showForm && !modal.selectedDate"
      @close="modal.close"
    >
      <template #header>거래 추가</template>

      <template #body>
        <!-- ✍️ 팀원 제작한 입력 폼 사용 -->
        <TransactionForm :date="defaultDate" @completed="onAddComplete" />
      </template>

      <template #footer>
        <button @click="modal.close">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
// 📦 스토어 및 컴포넌트 임포트
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';
import TransactionItem from './TransactionItem.vue';
import BaseModal from '@/components/base/baseModal.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import { useAuthStore } from '../stores/authStore';

// 현재 로그인 사용자 ID 접근
const authStore = useAuthStore();

// 📥 부모로부터 전달된 현재 선택된 월
const props = defineProps({
  selectedMonth: String,
});

// 🧾 거래 데이터 가져오기
const { transactions } = storeToRefs(useTransactionStore());
const modal = useModalStore();

// ✅ 해당 월 + 현재 사용자 거래만 필터링
const filteredTransactions = computed(() =>
  transactions.value
    .filter(
      (tx) =>
        tx.date.startsWith(props.selectedMonth) &&
        tx.userId === authStore.user.id // 👈 로그인 사용자 기준
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

// 💰 수입/지출 총합 (현재 사용 안됨)
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

// ➕ 거래 추가 버튼 클릭 시 모달 오픈
const openAddModal = () => {
  modal.selectedDate = null;
  modal.showForm = true;
};

// ✅ 거래 등록 완료 후 새로고침
const onAddComplete = () => {
  useTransactionStore().fetchTransactions();
  modal.close();
};

// 📅 오늘 날짜 문자열로 생성
const today = new Date();
const defaultDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
</script>

<style scoped>
.summary-box {
  padding: 12px;
  margin-bottom: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-weight: bold;
}

.add-container {
  text-align: center;
  margin-top: 16px;
}

.add-btn {
  background: #4a90e2;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #357bd8;
}
</style>
