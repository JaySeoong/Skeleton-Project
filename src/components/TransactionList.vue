<template>
  <div>
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

const { transactions } = storeToRefs(useTransactionStore());
</script>
