import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/transactions');
      transactions.value = res.data;
    } catch (error) {
      console.error('불러오기 오류:', error);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      await axios.put(
        `http://localhost:3000/transactions/${updatedTransaction.id}`,
        updatedTransaction
      );
      await fetchTransactions();
    } catch (error) {
      console.error('업데이트 오류:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/transactions/${id}`);
      await fetchTransactions();
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  return {
    transactions,
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  };
});
