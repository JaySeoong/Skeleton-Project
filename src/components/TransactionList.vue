<template>
  <div v-if="store.filteredTransactions.length > 0">
    <TransactionItem
      v-for="tx in store.filteredTransactions"
      :key="tx.id"
      :transaction="tx"
    />
  </div>
  <div v-else-if="store.transactions.length > 0">
    <TransactionItem
      v-for="tx in store.transactions"
      :key="tx.id"
      :transaction="tx"
    />
  </div>
  <div v-else>거래내역이 없어요</div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore'; // JS 파일이어도 import는 동일
import TransactionItem from './TransactionItem.vue';

const store = useTransactionStore();

// 컴포넌트가 마운트될 때 초기 필터링 적용 (없으면 전체를 보여주기 위해)
onMounted(() => {
  if (store.filteredTransactions.length === 0) {
    store.filteredTransactions = [...store.transactions];
  }
});
</script>
