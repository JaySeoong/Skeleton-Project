<template>
  <div>
    <h1>거래 내역</h1>

    <!-- 월 선택 UI -->
    <select v-model="selectedMonth">
      <option v-for="month in monthOptions" :key="month" :value="month">
        {{ month }}
      </option>
    </select>

    <!-- 거래 리스트 -->
    <TransactionList :selectedMonth="selectedMonth" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import TransactionList from '@/components/TransactionList.vue';
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

onMounted(() => {
  store.fetchTransactions();
});

// ✅ 선택 가능한 월 옵션 (최근 12개월 기준 등으로 확장 가능)
const monthOptions = ['2025-04', '2025-03', '2025-02', '2025-01', '2024-12'];

// ✅ 선택된 월 상태
const selectedMonth = ref('2025-04');
</script>
