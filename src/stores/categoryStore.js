import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000/';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    incomeCategory: [],
    expenseCategory: [],
    selectIncome: false,
    selectExpense: false,
    loading: false,
    error: null,
  }),
  getters: {
    getIncomeCategorys: (state) => {
      return [...state.incomeCategory].sort((a, b) => b - a);
    },
    getExpenseCategorys: (state) => {
      return [...state.expenseCategory].sort((a, b) => b - a);
    },
  },
  actions: {
    // 수입 카테고리 목록 초기화
    async fetchIncome() {
      this.incomeCategory = [];
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(API_URL + 'incomeCategory');
        this.incomeCategory = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 지출 카테고리 목록 초기화
    async fetchExpense() {
      this.expenseCategory = [];
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(API_URL + 'expenseCategory');
        this.expenseCategory = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 카테고리 생성 함수
    async createCategory(categoryData) {
      this.loading = true;
      this.error = null;
      try {
        // const newCategory = {
        //   id: Date.now().toString(),
        //   value: categoryData.name,
        // }
        if (categoryData.type == 'income') {
          const response = await axios.post(
            API_URL + 'incomeCategory',
            newCategory
          );
          this.incomeCategory.push(response.data);
          return response.data;
        } else {
          const response = await axios.post(
            API_URL + 'expenseCategory',
            newCategory
          );
          this.expenseCategory.push(response.data);
          return response.data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 카테고리 삭제 함수
    async deleteCategory(type, id) {
      this.loading = true;
      this.error = null;

      try {
        await axios.delete(`${API_URL}${type}/${id}`);
        if (type == 'income') {
          this.incomeCategory = this.incomeCategory.filter(
            (category) => category.id != id
          );
        } else {
          this.expenseCategory = this.expenseCategory.filter(
            (category) => category.id != id
          );
        }
        return true;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
