// stores/transactionStore.js
import { defineStore } from 'pinia';
import axios from 'axios'; // 또는 service로 분리 가능

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transactions: [], // 빈 배열로 초기화
    filteredTransactions: [],
    incomeCategory: [],
    expenseCategory: [],
  }),

  actions: {
    // ✅ JSON 서버에서 데이터 불러오기
    async fetchTransactions() {
      try {
        const response = await axios.get('http://localhost:3000/budget');
        this.transactions = response.data;
        this.filteredTransactions = response.data;
      } catch (error) {
        console.error('📛 거래 데이터 불러오기 실패:', error);
      }
    },

    // 거래 필터링
    async fetchData() {
      try {
        const [transactionRes, incomeRes, expenseRes] = await Promise.all([
          axios.get('/api/budget'),
          axios.get('/api/incomeCategory'),
          axios.get('/api/expenseCategory'),
        ]);
        this.transactions = transactionRes.data;
        this.filteredTransactions = transactionRes.data; // 기본값 설정
        this.incomeCategory = incomeRes.data;
        this.expenseCategory = expenseRes.data;
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    },

    filterTransactions(date, category) {
      this.filteredTransactions = this.transactions.filter((tx) => {
        const matchDate = !date || tx.date === date;
        const matchCategory = !category || tx.category === category;
        return matchDate && matchCategory;
      });
    },

    // 거래 삭제
    deleteTransaction(id) {
      this.transactions = this.transactions.filter((tx) => tx.id !== id);
      this.filteredTransactions = this.filteredTransactions.filter(
        (tx) => tx.id !== id
      );
    },

    async addTransaction(item) {
      try {
        const response = await axios.post('/api/budget', item);
        this.transactions.push(response.data); // 서버에서 저장된 데이터 사용
        this.filteredTransactions.push(response.data);
      } catch (error) {
        console.error('거래 저장 실패:', error);
        alert('거래 저장 중 오류가 발생했습니다.');
      }
    },
  },
// import { ref } from 'vue';

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
