<template>
  <div class="transaction-item" @click="openModal">
    <div>{{ transaction.date }} | {{ transaction.category }}</div>
    <div>{{ transaction.amount.toLocaleString() }} 원</div>

    <!-- 모달창 -->
    <BaseModal v-if="showModal" @close="closeModal">
      <template #header> 거래 수정 ({{ transaction.date }}) </template>

      <template #body>
        <form>
          <label
            >유형(type):
            <select v-model="editable.type">
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </label>
          <label
            >카테고리(category):
            <input v-model="editable.category" type="text" />
          </label>
          <label
            >금액(amount):
            <input v-model.number="editable.amount" type="number" />
          </label>
          <label
            >메모(memo):
            <input v-model="editable.memo" type="text" />
          </label>
        </form>
      </template>

      <template #footer>
        <button @click.stop="saveChanges">저장</button>
        <button @click.stop="deleteItem">삭제</button>
        <button @click.stop="closeModal">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import BaseModal from '@/components/base/baseModal.vue';

const props = defineProps({
  transaction: Object,
});

const showModal = ref(false);
const editable = ref({ ...props.transaction });

const store = useTransactionStore();

const openModal = () => {
  editable.value = { ...props.transaction }; // 원본 복사
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveChanges = () => {
  store.updateTransaction(editable.value);
  closeModal();
};

const deleteItem = () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    store.deleteTransaction(props.transaction.id);
    closeModal();
  }
};
</script>

<style scoped>
.transaction-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  margin-right: 6px;
}
</style>
