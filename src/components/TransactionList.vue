<script setup>
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionItem from './TransactionItem.vue'
import { onMounted } from 'vue'

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchTransactions()
})
</script>

<template>
  <div class="TransactionList">
    <ul>
      <TransactionItem
        v-for="TransactionItem in transactionStore.getSortedTransaction"
        :key="TransactionItem.id"
        :TransactionItem="TransactionItem"
      />
    </ul>
  </div>
</template>

<style scoped>
.TransactionList {
}
</style>
