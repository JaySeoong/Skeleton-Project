<!-- 거래 추가 컴포넌트 -->
<!-- 수정자 박다빈 -->

<!-- <template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>
          날짜:
          <input type="date" v-model="form.date" required />
        </label>
      </div>

      <div>
        <label>
          타입:
          <select v-model="form.type" required>
            <option disabled value="">-- 선택하세요 --</option>
            <option value="income">수입</option>
            <option value="expense">지출</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          카테고리:
          <select v-model="form.category" :disabled="!form.type" required>
            <option disabled value="">-- 선택하세요 --</option>
            <option v-for="c in categoryOptions" :key="c.id" :value="c.value">
              {{ c.value }}
            </option>
          </select>
        </label>
      </div>

      <div>
        <label>
          금액:
          <input type="number" v-model.number="form.amount" min="1" required />
        </label>
      </div>

      <div>
        <label>
          메모:
          <input type="text" v-model="form.memo" />
        </label>
      </div>

      <button type="submit">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import SelectCategory from '@/components/SelectCategory.vue';

const store = useTransactionStore();

onMounted(() => {
  store.fetchData();
});

const form = ref({
  //입력받는 폼 지정
  date: '',
  type: '',
  category: '',
  amount: null,
  memo: '',
});

// 날짜 + 랜덤 문자열로 id 생성
function generateDateRandomId() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${datePart}-${randomPart}`;
}

const categoryOptions = computed(() => {
  return form.value.type === 'income'
    ? store.incomeCategory
    : form.value.type === 'expense'
    ? store.expenseCategory
    : [];
});

const handleSubmit = () => {
  const item = {
    id: generateDateRandomId(),
    date: form.value.date.replaceAll('-', ''),
    type: form.value.type,
    category: form.value.category,
    amount: form.value.amount,
    memo: form.value.memo,
  };

  store.addTransaction(item);

  form.value = {
    date: '',
    type: '',
    category: '',
    amount: null,
    memo: '',
  };

  alert('거래가 저장되었습니다!');
};
</script> -->

<!-- 수정자 전효빈 -->
<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>
          날짜:
          <input type="date" v-model="form.date" required />
        </label>
      </div>

      <div>
        <label>
          타입:
          <select v-model="form.type" required>
            <option disabled value="">-- 선택하세요 --</option>
            <option value="income">수입</option>
            <option value="expense">지출</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          카테고리:
          <select v-model="form.category" :disabled="!form.type" required>
            <option disabled value="">-- 선택하세요 --</option>
            <option v-for="c in categoryOptions" :key="c.id" :value="c.value">
              {{ c.value }}
            </option>
          </select>
        </label>
      </div>

      <div>
        <label>
          금액:
          <input type="number" v-model.number="form.amount" min="1" required />
        </label>
      </div>

      <div>
        <label>
          메모:
          <input type="text" v-model="form.memo" />
        </label>
      </div>

      <button type="submit">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const emit = defineEmits(['completed']); // ✅ 부모에게 완료 알림

const props = defineProps({
  date: String, // 날짜 prop 받기 (모달에서 전달됨)
});

const store = useTransactionStore();

// 입력 폼 상태
const form = ref({
  date: props.date || '', // 초기값으로 selectedDate 세팅
  type: '',
  category: '',
  amount: null,
  memo: '',
});

// 마운트 시 카테고리 정보 불러오기
onMounted(() => {
  store.fetchData();
});

// 카테고리 선택 옵션 계산
const categoryOptions = computed(() => {
  return form.value.type === 'income'
    ? store.incomeCategory
    : form.value.type === 'expense'
    ? store.expenseCategory
    : [];
});

// ID 생성 함수
// function generateDateRandomId() {
//   const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
//   const randomPart = Math.random().toString(36).substring(2, 8);
//   return `${datePart}-${randomPart}`;
// }

// 거래 저장 및 완료 이벤트 emit
const handleSubmit = async () => {
  const item = {
    id: authStore.user.id,
    date: form.value.date,
    type: form.value.type,
    category: form.value.category,
    amount: form.value.amount,
    memo: form.value.memo,
  };

  try {
    await store.addTransaction(item); // 서버 저장
    await store.fetchTransactions(); // ✅ 리스트 갱신
    emit('completed'); // ✅ 부모에게 완료 알림 → 모달 닫기
  } catch (error) {
    console.error('거래 저장 실패:', error);
    alert('저장 중 문제가 발생했습니다.');
  }

  // 폼 초기화
  form.value = {
    date: props.date || '',
    type: '',
    category: '',
    amount: null,
    memo: '',
  };
};
</script>
