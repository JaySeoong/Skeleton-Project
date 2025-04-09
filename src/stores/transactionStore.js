// stores/transactionStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const filteredTransactions = ref([]);
  const incomeCategory = ref([]);
  const expenseCategory = ref([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/budget');
      transactions.value = res.data;
      filteredTransactions.value = res.data;
    } catch (error) {
      console.error('📛 거래 데이터 불러오기 실패:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [tx, income, expense] = await Promise.all([
        axios.get('http://localhost:3000/budget'),
        axios.get('http://localhost:3000/incomeCategory'),
        axios.get('http://localhost:3000/expenseCategory'),
      ]);
      transactions.value = tx.data;
      filteredTransactions.value = tx.data;
      incomeCategory.value = income.data;
      expenseCategory.value = expense.data;
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  const filterTransactions = (date, category) => {
    filteredTransactions.value = transactions.value.filter((tx) => {
      const matchDate = !date || tx.date === date;
      const matchCategory = !category || tx.category === category;
      return matchDate && matchCategory;
    });
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
      const res = await axios.post('http://localhost:3000/budget', item);
      transactions.value.push(res.data);
      filteredTransactions.value.push(res.data);
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
    filteredTransactions,
    incomeCategory,
    expenseCategory,
    fetchTransactions,
    fetchData,
    filterTransactions,
    deleteTransaction,
    addTransaction,
    updateTransaction,
  };
});
