<template>
  <div class="transaction-item">
    <div>{{ transaction.date }}</div>
    <div>{{ transaction.type }}</div>
    <div>{{ transaction.category }}</div>
    <div>{{ transaction.amount.toLocaleString() }} 원</div>
    <div>{{ transaction.memo }}</div>
  </div>
</template>

<script setup>
defineProps({
  transaction: Object,
});
</script>

<style scoped>
.transaction-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
}
</style>
