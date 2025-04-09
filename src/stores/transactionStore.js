import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

// 💼 거래 데이터를 관리하는 store
export const useTransactionStore = defineStore('transaction', () => {
  const budget = ref([]); // JSON 서버의 budget 데이터

  // ✅ 거래 목록 불러오기
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:3000/budget');
      budget.value = res.data;
    } catch (error) {
      console.error('불러오기 오류:', error);
    }
  };

  // ✅ 거래 수정
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

  // ✅ 거래 삭제
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/budget/${id}`);
      await fetchTransactions();
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  return {
    budget, // 새로운 이름
    transactions: budget, // 기존 코드 호환을 위한 alias (선택)
    fetchTransactions,
    updateTransaction,
    deleteTransaction,
  };
});
