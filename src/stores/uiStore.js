// // 모달, 로딩 상태 등 UI상태 관리
// import { defineStore } from 'pinia';
// import { ref } from 'vue';

// export const useUIStore = defineStore('ui', () => {
//   const isModalOpen = ref(false);
//   const isLoading = ref(false);
//   const toastMessage = (ref < string) | (null > null);

//   const toggleModal = () => {
//     isModalOpen.value = !isModalOpen.value;
//   };

//   const setLoading = (value: boolean) => {
//     isLoading.value = value;
//   };

//   //   일시적으로 메시지를 띄우는 토스트 기능 추가
//   const showToast = (message: string, timeout = 3000) => {
//     toastMessage.value = message;
//     setTimeout(() => {
//       toastMessage.value = null;
//     }, timeout);
//   };

//   return {
//     isModalOpen,
//     isLoading,
//     toastMessage,
//     toggleModal,
//     setLoading,
//     showToast,
//   };
// });
