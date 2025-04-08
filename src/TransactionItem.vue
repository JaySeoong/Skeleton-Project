<template>
  <div class="transaction-item" @click="openModal">
    <div>
      <div>{{ transaction.date }}</div>
      <div>{{ transaction.category }} | {{ transaction.memo }}</div>
    </div>
    <div>{{ transaction.amount.toLocaleString() }}원</div>

    <!-- 모달 -->
    <base-modal v-if="showModal" @close="showModal = false">
      <template #header> 거래 수정 </template>

      <template #body>
        <form @submit.prevent="updateTransaction">
          <label>
            카테고리
            <input v-model="editable.category" required />
          </label>
          <label>
            금액
            <input type="number" v-model.number="editable.amount" required />
          </label>
          <label>
            메모
            <input v-model="editable.memo" />
          </label>
        </form>
      </template>

      <template #footer>
        <button @click="updateTransaction">수정</button>
        <button @click="deleteTransaction">삭제</button>
        <button @click="showModal = false">닫기</button>
      </template>
    </base-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import baseModal from '@/components/base/baseModal.vue';

const props = defineProps({
  transaction: Object,
});

const store = useTransactionStore();
const showModal = ref(false);
const editable = ref({ ...props.transaction });

const openModal = () => {
  editable.value = { ...props.transaction };
  showModal.value = true;
};

const updateTransaction = () => {
  store.updateTransaction({ ...editable.value });
  showModal.value = false;
};

const deleteTransaction = () => {
  store.deleteTransaction(props.transaction.id);
  showModal.value = false;
};
</script>

<style scoped>
.transaction-item {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}
</style>
