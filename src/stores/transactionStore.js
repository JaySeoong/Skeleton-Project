import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000/'

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    transaction: [],
    loading: false,
    error: null,
  }),
  getters: {
    getSortedTransaction: (state) => {
      return [...state.transaction].sort((a, b) => b.date - a.date)
    },
  },
  actions: {
    async fetchTransactions() {
      this.transaction = []
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(API_URL + 'budget')
        this.transaction = response.data
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
})
