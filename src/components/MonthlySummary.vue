<template>
  <div class="card p-3 mb-4 shadow-sm text-center w-100 Bbox">
    <!-- 코멘트 -->
    <div class="d-flex align-items-center gap-2 my-6 px-2">
      <p class="fw-bold fs-3" style="color: #ffc107">한달을 돌아보며...</p>
    </div>
    <p class="small fw-semibold text-muted fs-6 px-2">
      {{ feedbackComment }}
    </p>
    <!-- 요약 박스 -->
    <div class="summary-box text-start text-center">
      <div>
        <span class="fw-bold text-primary"
          >총 수입: {{ totalIncome.toLocaleString() }} 원</span
        >
      </div>
      <div>
        <span class="fw-bold text-danger"
          >총 지출: {{ totalExpense.toLocaleString() }} 원</span
        >
      </div>
      <div>
        <span :class="netIncomeClass" class="fw-bold"
          >순 수입 :
          {{ (totalIncome - totalExpense).toLocaleString() }} 원</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

// 📅 현재 달 필터링
const selectedMonth = computed(() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
});

// 📈 순수익 계산
const netIncome = computed(() => totalIncome.value - totalExpense.value);

const netIncomeClass = computed(() => {
  if (netIncome.value > 0) return 'text-primary'; // 파란색
  if (netIncome.value < 0) return 'text-danger'; // 빨간색
  return ''; // 0이면 기본색
});

const transactionsForMonth = computed(() =>
  store.transactions.filter((tx) => tx.date.startsWith(selectedMonth.value))
);

const totalIncome = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const totalExpense = computed(() =>
  transactionsForMonth.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0)
);

const balanceRatio = computed(() => {
  const inc = totalIncome.value;
  const exp = totalExpense.value;
  if (inc === 0) return 0;
  return Math.max(0, Math.min(100, ((inc - exp) / inc) * 100));
});

const feedbackComment = computed(() => {
  const ratio = balanceRatio.value;
  if (ratio >= 75) return '이번 달은 여유롭네요!';
  if (ratio >= 50) return '이번 달은 괜찮은 편이에요.';
  if (ratio >= 25) return '이번 달은 조금 아껴야 해요.';
  return '이번 달은 적자입니다...!';
});
</script>

<style scoped>
.summary-box {
  background: #ffc107;
  padding: 10px;
  border-radius: 8px;
  /* font-weight: bold; */
}
.Bbox {
  background-color: #f8f9fa;
}
</style>
