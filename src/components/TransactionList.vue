<template>
  <div>
    <!-- 📋 거래 리스트 -->
    <TransactionItem
      v-for="transaction in filteredTransactions"
      :key="transaction.id"
      :transaction="transaction"
    />

    <!-- ➕ 거래 추가 버튼 -->
    <div class="add-container">
      <button class="add-btn" @click="openAddModal">＋ 거래 추가</button>
    </div>

    <!-- 📦 거래 추가 모달 -->
    <BaseModal
      v-if="modal.showForm && !modal.selectedDate"
      @close="modal.close"
    >
      <template #header>거래 추가</template>
      <template #body>
        <TransactionForm :date="defaultDate" @completed="onAddComplete" />
      </template>
      <template #footer>
        <button @click="modal.close">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useModalStore } from '@/stores/modalStore';
import TransactionItem from './TransactionItem.vue';
import BaseModal from '@/components/base/baseModal.vue';
// import TransactionForm from '@/components/TransactionForm.vue';

const props = defineProps({
  selectedMonth: String,
});

const { transactions } = storeToRefs(useTransactionStore());
const modal = useModalStore();

const filteredTransactions = computed(() =>
  transactions.value
    .filter((tx) => tx.date.startsWith(props.selectedMonth))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
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

const openAddModal = () => {
  modal.selectedDate = null;
  modal.showForm = true;
};

const onAddComplete = () => {
  useTransactionStore().fetchTransactions();
  modal.close();
};

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
