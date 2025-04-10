<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <!-- 네비게이션 바 -->

    <!-- 실제 페이지 내용 -->
    <main class="p-6">
      <router-view />
      <!-- ✅ 거래 추가 모달: 전역 어디서든 작동 -->
      <BaseModal v-if="modal.showForm" @close="modal.close">
        <template #header>거래 추가</template>

        <template #body>
          <TransactionForm
            :date="modal.selectedDate"
            @completed="onAddComplete"
          />
        </template>

        <template #footer>
          <button @click="modal.close">닫기</button>
        </template>
      </BaseModal>
    </main>
  </div>
</template>

<script setup>
import BaseModal from '@/components/base/baseModal.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import { useModalStore } from '@/stores/modalStore';
import { useTransactionStore } from '@/stores/transactionStore';

const modal = useModalStore();
const transactionStore = useTransactionStore();

const onAddComplete = async () => {
  await transactionStore.fetchTransactions();
  modal.close();
};
</script>

<style scoped>
.min-h-screen {
  max-width: 500px;
  margin: 0 auto;
}
</style>
