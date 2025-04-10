import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  const selectedDate = ref(null);
  const showForm = ref(false);

  const open = (date) => {
    selectedDate.value = date;
    showForm.value = false;
  };

  const close = () => {
    selectedDate.value = null;
    showForm.value = false;
  };

  return {
    selectedDate,
    showForm,
    open,
    close,
  };
});
