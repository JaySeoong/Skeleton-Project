<script setup>
import { useCategoryStore } from '@/stores/categoryStore';

const props = defineProps({
  categoryList: {
    type: Object,
    required: true,
  },
});

const categoryStore = useCategoryStore();

// 카테고리 삭제 함수
const handleDelete = async () => {
  try {
    console.log(props.categoryList.id);

    await categoryStore.deleteCategory(
      categoryStore.selectIncome ? 'incomeCategory' : 'expenseCategory',
      props.categoryList.id
    );
    categoryStore.fetchIncome();
    categoryStore.fetchExpense();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="ShowCategoryList">
    <li>
      <span>{{ categoryList.value }}</span>
      <!-- 카테고리 입력 버튼 (미구현) -->
      <button>선택</button>
      <!-- 카테고리 삭제 버튼 -->
      <button @click="handleDelete">삭제</button>
    </li>
  </div>
</template>
