<template>
  <div class="home-container">
    <RecentTransactionList />
    <AddTransactionButton />
  </div>
</template>

<script setup>
import RecentTransactionList from '@/components/RecentTransactionList.vue';
import AddTransactionButton from '@/components/AddTransactionButton.vue';
</script>

<style lang="scss" scoped>
.home-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  background: #f8f9fa;
}
</style>
