import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // ✅ 로그인 사용자 정보 사용

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const incomeCategory = ref([]);
  const expenseCategory = ref([]);

  // ✅ 사용자별 거래만 가져오기
  const fetchTransactions = async () => {
    try {
      const authStore = useAuthStore();
      if (!authStore.user?.id) return;

      const res = await axios.get(
        `http://localhost:3000/budget?userId=${authStore.user.id}`
      );
      transactions.value = res.data;
    } catch (error) {
      console.error('📛 거래 데이터 불러오기 실패:', error);
    }
  };

  // 📦 모든 데이터 동시 로딩
  const fetchData = async () => {
    try {
      const authStore = useAuthStore();
      if (!authStore.user?.id) return;

      const [tx, income, expense] = await Promise.all([
        axios.get(`http://localhost:3000/budget?userId=${authStore.user.id}`),
        axios.get('http://localhost:3000/incomeCategory'),
        axios.get('http://localhost:3000/expenseCategory'),
      ]);
      transactions.value = tx.data;
      incomeCategory.value = income.data;
      expenseCategory.value = expense.data;
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/budget/${id}`);
      await fetchTransactions();
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  const addTransaction = async (item) => {
    try {
      await axios.post('http://localhost:3000/budget', item);
      await fetchTransactions();
    } catch (error) {
      console.error('거래 저장 실패:', error);
      alert('거래 저장 중 오류가 발생했습니다.');
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      await axios.put(
        `http://localhost:3000/budget/${updatedTransaction.id}`,
        updatedTransaction
      );
      await fetchTransactions();
    } catch (error) {
      console.error('업데이트 오류:', error);
    }
  };

  return {
    transactions,
    incomeCategory,
    expenseCategory,
    fetchTransactions,
    fetchData,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  };
});
