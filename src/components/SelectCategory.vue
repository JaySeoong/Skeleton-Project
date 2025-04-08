<script setup>
import { ref } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import ShowCategoryList from './ShowCategoryList.vue'

const newCategoryName = ref('')

const categoryStore = useCategoryStore()
function selectIncome() {
  categoryStore.fetchIncome()
  categoryStore.selectIncome = true
  categoryStore.selectExpense = false
}
function selectExpense() {
  categoryStore.fetchExpense()
  categoryStore.selectIncome = false
  categoryStore.selectExpense = true
}

const handleCreate = async () => {
  try {
    const categoryData = {
      name: newCategoryName.value,
      type: categoryStore.selectIncome ? 'income' : 'expense',
    }
    await categoryStore.createCategory(categoryData)
    newCategoryName.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="SelectCategory">
    <input type="radio" id="income" name="category" @click="selectIncome" value="income" />
    <label for="income">수입</label>
    <input type="radio" id="expense" name="category" @click="selectExpense" value="expense" />
    <label for="expense">지출</label>
    <br />
    <ul v-if="categoryStore.selectIncome">
      <ShowCategoryList
        v-for="categoryList in categoryStore.getIncomeCategorys"
        :key="categoryList.id"
        :categoryList="categoryList"
      />
      <form @submit.prevent="handleCreate">
        <span>새 카테고리 만들기</span>
        <input type="text" placeholder="카테고리 이름을 입력하세요" v-model="newCategoryName" />
        <button type="submit">생성</button>
      </form>
    </ul>
    <ul v-if="categoryStore.selectExpense">
      <ShowCategoryList
        v-for="categoryList in categoryStore.getExpenseCategorys"
        :key="categoryList.id"
        :categoryList="categoryList"
      />
      <form @submit.prevent="handleCreate">
        <span>새 카테고리 만들기</span>
        <input type="text" placeholder="카테고리 이름을 입력하세요" v-model="newCategoryName" />
        <button type="submit">생성</button>
      </form>
    </ul>
  </div>
</template>

<style scoped>
.SelectCategory {
}
</style>
