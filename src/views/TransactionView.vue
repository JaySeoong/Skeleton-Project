<template>
  <div>
    <h1>거래 내역</h1>
    <TransactionList />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import TransactionList from '@/components/TransactionList.vue';
import { useTransactionStore } from '@/stores/transactionStore';

const transactionStore = useTransactionStore();

onMounted(async () => {
  await transactionStore.fetchTransactions();
  console.log(transactionStore.transactions); // 데이터 출력 확인용
});
</script>
