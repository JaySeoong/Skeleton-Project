<template>
  <div class="card p-3 mb-4 shadow-sm text-center w-100">
    <!-- 차트 -->
    <canvas ref="canvasRef" class="w-100" height="60"></canvas>

    <!-- 코멘트 -->
    <div class="mt-3 small fw-semibold text-muted">
      {{ feedbackComment }}
    </div>

    <!-- 요약 박스 -->
    <div class="summary-box mt-4 text-start">
      <div class="fw-bold mb-2">잔액 피드백</div>
      <div>총 수입: {{ totalIncome.toLocaleString() }} 원</div>
      <div>총 지출: {{ totalExpense.toLocaleString() }} 원</div>
      <div>순수입: {{ (totalIncome - totalExpense).toLocaleString() }} 원</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  BarController,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const store = useTransactionStore();
const canvasRef = ref(null);
const chartInstance = ref(null);

// 📅 현재 달 필터링
const selectedMonth = computed(() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}`;
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

const barColor = computed(() => {
  const ratio = balanceRatio.value;
  if (ratio >= 75) return '#4CAF50';
  if (ratio >= 50) return '#8BC34A';
  if (ratio >= 25) return '#FFC107';
  return '#F44336';
});

// 🟩 차트 그리기
const drawChart = () => {
  if (!canvasRef.value) return;
  const ctx = canvasRef.value.getContext('2d');
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['잔액 비율'],
      datasets: [
        {
          label: '잔액 비율',
          data: [balanceRatio.value],
          backgroundColor: barColor.value,
          borderRadius: 10,
          barThickness: 30,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        x: {
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
          },
          grid: { display: false },
        },
        y: { display: false },
      },
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
    },
  });
};

// 📊 데이터 변화 감지 시 재렌더링
onMounted(drawChart);
watch([totalIncome, totalExpense], drawChart);
</script>

<style scoped>
canvas {
  margin: 0 auto;
}

.summary-box {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
