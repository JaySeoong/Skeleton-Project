<script setup>
const props = defineProps({
  TransactionItem: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <li :class="TransactionItem.type">
    <span>{{ TransactionItem.date }}</span>
    <span>{{ TransactionItem.category }}</span>
    <span>{{ TransactionItem.amount }}</span>
    <span>{{ TransactionItem.memo }}</span>
    <i>edit</i>
    <i>trash</i>
  </li>
</template>

<style scoped>
.TransactionItem {
}
</style>
