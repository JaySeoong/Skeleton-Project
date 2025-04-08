<template>
  <div>
    <!-- 💰 월별 수입/지출 요약 -->
    <div class="summary-box">
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>

    <!-- 📋 거래 리스트 -->
    <TransactionItem
      v-for="transaction in filteredTransactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transactionStore';
import { computed } from 'vue';
import TransactionItem from './TransactionItem.vue';

const props = defineProps({
  selectedMonth: String,
});

const { transactions } = storeToRefs(useTransactionStore());

// ✅ 필터링된 거래목록 (해당 월)
const filteredTransactions = computed(() => {
  return transactions.value
    .filter((tx) => tx.date.startsWith(props.selectedMonth))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

// ✅ 수입 총합
const totalIncome = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

// ✅ 지출 총합
const totalExpense = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);
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
</style>
