<template>
  <div>
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

// ✅ 월 필터링 + 최신순 정렬
const filteredTransactions = computed(() => {
  return transactions.value
    .filter((tx) => tx.date.startsWith(props.selectedMonth))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});
</script>
