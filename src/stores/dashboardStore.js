// 월별 요약 데이터 저장
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
  const monthlySummary = ref<any>(null);
  const chartData = ref<any>(null);

  const setMonthlySummary = (summary: any) => {
    monthlySummary.value = summary;
  };

  //   차트용 데이터 상태 관리
  const setChartData = (data: any) => {
    chartData.value = data;
  };

  return { monthlySummary, chartData, setMonthlySummary, setChartData };
});
