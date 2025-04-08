<template>
  <div>
    <div v-if="transactions.length === 0">거래내역이 없습니다.</div>
    <TransactionItem
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionItem from '@/components/TransactionItem.vue';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
</script>
