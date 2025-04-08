import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);

  const fetchTransactions = async () => {
    const res = await axios.get('http://localhost:3000/transactions');
    transactions.value = res.data;
  };

  const updateTransaction = async (updatedTransaction) => {
    await axios.put(
      `http://localhost:3000/transactions/${updatedTransaction.id}`,
      updatedTransaction
    );
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`http://localhost:3000/transactions/${id}`);
    fetchTransactions();
  };

  return {
    transactions,
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  };
});
