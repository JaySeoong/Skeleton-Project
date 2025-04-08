import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/transactions');
      transactions.value = response.data;
      console.log('데이터 불러오기 성공:', response.data);
    } catch (error) {
      console.error('거래내역을 가져오는 데 실패했습니다:', error);
    }
  };

  return { transactions, fetchTransactions };
});
