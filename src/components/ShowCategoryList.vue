<script setup>
import { useCategoryStore } from '@/stores/categoryStore'

const props = defineProps({
  categoryList: {
    type: Object,
    required: true,
  },
})

const categoryStore = useCategoryStore()

const handleDelete = async () => {
  try {
    console.log(props.categoryList.id)

    await categoryStore.deleteCategory(
      categoryStore.selectIncome ? 'incomeCategory' : 'expenseCategory',
      props.categoryList.id,
    )
    categoryStore.fetchIncome()
    categoryStore.fetchExpense()
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="ShowCategoryList">
    <li>
      <span>{{ categoryList.value }}</span>
      <button>선택</button>
      <button @click="handleDelete">삭제</button>
    </li>
  </div>
</template>

<style scoped>
.ShowCategoryList {
}
</style>