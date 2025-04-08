<template>
  <div class="transaction-item">
    <div class="left">
      <div class="category">{{ transaction.category }}</div>
      <div class="memo">{{ transaction.memo }}</div>
      <div class="date">{{ transaction.date }}</div>
    </div>
    <div class="right">
      <span :class="transaction.type">{{ transaction.amount }}원</span>
      <button @click="edit">✏️</button>
      <button @click="remove">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const props = defineProps<{
  transaction: {
    id: number;
    date: string;
    category: string;
    memo: string;
    amount: number;
    type: 'income' | 'expense';
  };
}>();

const store = useTransactionStore();

const edit = () => {
  // 수정 모달 열기 or 라우터 이동 가능
  alert(`${props.transaction.id}번 거래 수정`);
};

const remove = () => {
  if (confirm('정말 삭제할까요?')) {
    store.deleteTransaction(props.transaction.id);
  }
};
</script>
