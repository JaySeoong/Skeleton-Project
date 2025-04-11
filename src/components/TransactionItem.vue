<template>
  <div class="transaction-item" @click="openModal">
    <!-- 🧾 왼쪽 정보 표시: 날짜, 카테고리, 금액 -->
    <div class="left-info">
      <div>{{ transaction.date }} | {{ transaction.category }}</div>
      <div>{{ transaction.amount.toLocaleString() }} 원</div>
    </div>

    <!-- 🛠️ 오른쪽 수정/삭제 버튼 (모달 내 버튼과 동일한 기능) -->
    <div class="right-actions" @click.stop>
      <button @click="openModal">수정</button>
      <button @click="deleteItem">삭제</button>
    </div>

    <!-- 🧩 모달: 거래 수정 창 -->
    <BaseModal v-if="showModal" @close="closeModal">
      <!-- 모달 헤더 -->
      <template #header>거래 수정</template>

      <!-- 모달 본문 -->
      <template #body>
        <form @submit.prevent="saveChanges">
          <!-- 날짜 입력 -->
          <label>
            날짜(date):
            <input type="date" v-model="editable.date" required />
          </label>

          <!-- 유형 선택 -->
          <label>
            유형(type):
            <select v-model="editable.type" required>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </label>

          <!-- 카테고리 선택 (유형에 따라 필터링됨) -->
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

          <!-- 금액 입력 (숫자만 허용) -->
          <label>
            금액(amount):
            <input
              type="text"
              v-model="editable.amount"
              @input="validateAmount"
              required
            />
          </label>

          <!-- 메모 입력 -->
          <label>
            메모(memo):
            <input type="text" v-model="editable.memo" />
          </label>
        </form>
      </template>

      <!-- 모달 하단 버튼들 -->
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

// ✅ props 정의: 상위 컴포넌트에서 전달받은 거래 데이터
const props = defineProps({
  transaction: Object,
});

// ✅ 모달 상태 및 편집용 거래 데이터
const showModal = ref(false);
const editable = ref({});

// ✅ 카테고리 목록: 수입/지출용
const incomeCategories = ['월급', '용돈', '기타수입'];
const expenseCategories = ['식비', '교통비', '기타지출'];

// ✅ 선택한 유형(type)에 따라 카테고리 필터링
const availableCategories = computed(() =>
  editable.value.type === 'income' ? incomeCategories : expenseCategories
);

// ✅ Pinia 스토어 접근
const store = useTransactionStore();

// 🔓 모달 열기: props.transaction을 복사하여 editable에 저장
const openModal = () => {
  editable.value = {
    ...JSON.parse(JSON.stringify(props.transaction)), // 깊은 복사
    userId: props.transaction.userId, // userId 유지
  };
  showModal.value = true;
};

// 🔒 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

// 🔢 금액 입력 유효성 검사 (숫자만 허용)
const validateAmount = (event) => {
  const val = event.target.value.replace(/[^0-9]/g, '');
  editable.value.amount = val ? parseInt(val, 10) : '';
};

// ✅ 수정 저장
const saveChanges = async () => {
  // 금액 유효성 검사
  if (!editable.value.amount || editable.value.amount <= 0) {
    alert('금액은 1 이상의 숫자만 입력 가능합니다.');
    return;
  }

  // 수정된 거래 저장
  await store.updateTransaction({
    ...editable.value,
    userId: props.transaction.userId, // 명시적 포함
    amount: parseInt(editable.value.amount, 10),
  });

  await store.fetchTransactions(); // 거래 목록 갱신
  closeModal(); // 모달 닫기
};

// ❌ 삭제 처리
const deleteItem = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await store.deleteTransaction(props.transaction.id); // 삭제 요청
    await store.fetchTransactions(); // 거래 목록 갱신
    closeModal(); // 모달 닫기
  }
};
</script>

<style scoped>
/* 🧾 거래 아이템 레이아웃 */
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

/* 🛠️ 우측 버튼 영역 */
.right-actions button {
  margin-left: 6px;
  padding: 4px 10px;
  font-size: 0.9em;
  background: #e4e4e4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* 버튼 hover 효과 */
.right-actions button:hover {
  background-color: #d4d4d4;
}

/* 모달 내 폼 정렬 */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 인풋 & 셀렉트 스타일 */
input,
select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* 모달 하단 버튼 */
button {
  margin-right: 6px;
}
</style>
