// 거래 목록 관리 (조회, 추가, 삭제)
// stores/transactionStore.js
import { defineStore } from 'pinia';

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [
      {
        id: 1,
        date: '2025-04-06',
        category: '식비',
        memo: '점심',
        amount: 8000,
        type: 'expense',
      },
      {
        id: 2,
        date: '2025-04-05',
        category: '교통',
        memo: '버스',
        amount: 1200,
        type: 'expense',
      },
    ],
    filteredTransactions: [],
  }),

  actions: {
    filterTransactions(date, category) {
      this.filteredTransactions = this.transactions.filter((tx) => {
        const matchDate = !date || tx.date === date;
        const matchCategory = !category || tx.category === category;
        return matchDate && matchCategory;
      });
    },

    deleteTransaction(id) {
      this.transactions = this.transactions.filter((tx) => tx.id !== id);
      this.filteredTransactions = this.filteredTransactions.filter(
        (tx) => tx.id !== id
      );
    },
  },
});
