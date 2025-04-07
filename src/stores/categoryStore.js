// 수입/지출 카테고리 목록 저장
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
  const incomeCategories = ref<string[]>([]);
  const expenseCategories = ref<string[]>([]);

  const setIncomeCategories = (list: string[]) => {
    incomeCategories.value = list;
  };

  const setExpenseCategories = (list: string[]) => {
    expenseCategories.value = list;
  };

  return {
    incomeCategories,
    expenseCategories,
    setIncomeCategories,
    setExpenseCategories,
  };
});
