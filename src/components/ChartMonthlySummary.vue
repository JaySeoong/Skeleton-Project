<template>
  <div class="bg-white p-6 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-4">📊 월별 요약</h2>
    <Chart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Chart } from 'vue-chartjs';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const store = useTransactionStore();
const authStore = useAuthStore();

onMounted(() => {
  store.fetchTransactions(); // 이미 userId 기반 요청이면 그대로 사용 가능
});

// ✅ 사용자 거래만 필터링
const userTransactions = computed(() =>
  store.transactions.filter((tx) => tx.userId === authStore.user.id)
);

// ✅ 월별 요약 계산 (수입, 지출, 순이익)
const summaryByMonth = computed(() => {
  const summary = {};

  userTransactions.value.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!summary[month]) {
      summary[month] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') summary[month].income += t.amount;
    else if (t.type === 'expense') summary[month].expense += t.amount;
  });

  return summary;
});

// ✅ 차트 데이터 구성
const chartData = computed(() => {
  const labels = Object.keys(summaryByMonth.value).sort();
  const incomeData = labels.map((label) => summaryByMonth.value[label].income);
  const expenseData = labels.map(
    (label) => summaryByMonth.value[label].expense
  );
  const netProfit = labels.map(
    (label) =>
      summaryByMonth.value[label].income - summaryByMonth.value[label].expense
  );

  return {
    labels,
    datasets: [
      {
        type: 'line',
        label: '순이익',
        data: netProfit,
        borderColor: '#22c55e',
        backgroundColor: '#bbf7d0',
        fill: false,
        tension: 0.3,
      },
      {
        type: 'bar',
        label: '수입',
        data: incomeData,
        backgroundColor: '#93c5fd',
      },
      {
        type: 'bar',
        label: '지출',
        data: expenseData,
        backgroundColor: '#fca5a5',
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};
</script>
