<template>
  <div class="card p-3 mb-4 shadow-sm text-center w-100">
    <canvas ref="canvasRef" class="w-100" height="60"></canvas>

    <div class="mt-3 small fw-semibold text-muted">
      {{ feedbackComment }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  BarController,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const canvasRef = ref(null);
const chartInstance = ref(null);

const income = ref(0);
const expense = ref(0);
const balanceRatio = computed(() => {
  const inc = income.value;
  const exp = expense.value;
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

const fetchTransactionData = async () => {
  try {
    const res = await axios.get('http://localhost:3000/budget');
    const data = res.data;

    income.value = data
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    expense.value = data
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    drawChart();
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
};

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

onMounted(() => {
  fetchTransactionData();
});
</script>

<style scoped>
canvas {
  margin: 0 auto;
}
</style>
