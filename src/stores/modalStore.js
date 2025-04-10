// modalStore.js
import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    showForm: false,
    selectedDate: null,
    // 추가: 모달 타입 (예: 'home' 또는 'list')
    modalType: null,
  }),
  actions: {
    // 홈 화면에서 거래 추가를 열 때 사용하는 메서드
    openHomeModal() {
      // 홈 모달은 오늘 날짜를 기본으로 지정하는 예시
      const today = new Date().toISOString().split('T')[0];
      this.selectedDate = today;
      this.modalType = 'home';
      this.showForm = true;
    },
    // 거래내역 화면에서 거래 추가를 열 때 사용하는 메서드
    openListModal() {
      // 거래내역에서는 날짜 선택 없이 열 경우
      this.selectedDate = null;
      this.modalType = 'list';
      this.showForm = true;
    },
    close() {
      this.showForm = false;
      this.selectedDate = null;
      this.modalType = null;
    },
  },
});
