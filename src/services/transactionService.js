import api from './api';

// 거래 전체 조회
export const fetchTransactions = () => api.get('/transactions');

// 거래 추가
export const addTransaction = (data) => api.post('/transactions', data);

// 거래 삭제
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
