<template>
  <div class="transaction-view">
    <!-- 필터바: 날짜/카테고리 선택 -->
    <div class="filter-bar">
      <label>
        날짜:
        <input type="date" v-model="date" />
      </label>
      <label>
        카테고리:
        <select v-model="category">
          <option value="">전체</option>
          <option value="식비">식비</option>
          <option value="교통">교통</option>
        </select>
      </label>
      <button @click="applyFilter">필터 적용</button>
    </div>

    <!-- 거래 목록 컴포넌트 -->
    <TransactionList :transactions="filteredTransactions" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import TransactionList from '../components/TransactionList.vue';

const store = useTransactionStore();

const date = ref('');
const category = ref('');

const applyFilter = () => {
  store.filterTransactions(date.value, category.value);
};

// Pinia에서 필터링된 거래 목록 가져오기
const filteredTransactions = computed(() => store.filteredTransactions);
</script>
