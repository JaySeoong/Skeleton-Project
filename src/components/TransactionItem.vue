<template>
  <div class="transaction-item" @click="openModal">
    <div class="left-info">
      <div>{{ transaction.date }} | {{ transaction.category }}</div>
      <div>{{ transaction.amount.toLocaleString() }} 원</div>
    </div>

    <!-- 수정/삭제 버튼 -->
    <div class="right-actions" @click.stop>
      <button @click="openModal">수정</button>
      <button @click="deleteItem">삭제</button>
    </div>

    <BaseModal v-if="showModal" @close="closeModal">
      <template #header>거래 수정</template>

      <template #body>
        <form @submit.prevent="saveChanges">
          <label>
            날짜(date):
            <input type="date" v-model="editable.date" required />
          </label>

          <label>
            유형(type):
            <select v-model="editable.type" required>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </label>

          <label>
            카테고리(category):
            <select v-model="editable.category" required>
              <option
                v-for="cat in availableCategories"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </label>

          <label>
            금액(amount):
            <input
              type="text"
              v-model="editable.amount"
              @input="validateAmount"
              required
            />
          </label>

          <label>
            메모(memo):
            <input type="text" v-model="editable.memo" />
          </label>
        </form>
      </template>

      <template #footer>
        <button @click.stop="saveChanges">수정</button>
        <button @click.stop="deleteItem">삭제</button>
        <button @click.stop="closeModal">닫기</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import BaseModal from '@/components/base/baseModal.vue';

const props = defineProps({
  transaction: Object,
});

const showModal = ref(false);
const editable = ref({});

const incomeCategories = ['월급', '용돈', '기타수입'];
const expenseCategories = ['식비', '교통비', '기타지출'];

const availableCategories = computed(() =>
  editable.value.type === 'income' ? incomeCategories : expenseCategories
);

const store = useTransactionStore();

const openModal = () => {
  // 깊은 복사로 반응형 유지
  editable.value = JSON.parse(JSON.stringify(props.transaction));
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const validateAmount = (event) => {
  const val = event.target.value.replace(/[^0-9]/g, '');
  editable.value.amount = val ? parseInt(val, 10) : '';
};

const saveChanges = async () => {
  if (!editable.value.amount || editable.value.amount <= 0) {
    alert('금액은 1 이상의 숫자만 입력 가능합니다.');
    return;
  }

  await store.updateTransaction({
    ...editable.value,
    amount: parseInt(editable.value.amount, 10),
  });

  await store.fetchTransactions();
  closeModal();
};

const deleteItem = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await store.deleteTransaction(props.transaction.id);
    await store.fetchTransactions();
    closeModal();
  }
};
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.right-actions button {
  margin-left: 6px;
  padding: 4px 10px;
  font-size: 0.9em;
  background: #e4e4e4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.right-actions button:hover {
  background-color: #d4d4d4;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
