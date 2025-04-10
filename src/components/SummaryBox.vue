<!-- src/components/SummaryBox.vue -->
<template>
  <div class="summary-box">
    <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
    <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
    <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

const selectedMonth = computed(() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
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
</script>

<style scoped>
.summary-box {
  background: #f4f4f4;
  padding: 10px;
  margin: 12px 0;
  border-radius: 8px;
  font-weight: bold;
}
</style>
