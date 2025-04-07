import api from './api';

// type 쿼리로 구분해서 불러옴.
export const fetchIncomeCategories = () => api.get('/categories?type=income');
export const fetchExpenseCategories = () => api.get('/categories?type=expense');
