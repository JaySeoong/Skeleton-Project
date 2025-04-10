<template>
  <div class="app-container">
    <!-- ✅ 상단 고정 네비게이션 바 -->
    <header class="nav-fixed">
      <nav class="nav-bar">
        <ul class="nav-list">
          <li>
            <RouterLink to="/home" :class="navClass('/home')">홈</RouterLink>
          </li>
          <li>
            <RouterLink to="/transactions" :class="navClass('/transactions')"
              >거래내역</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/dashboard" :class="navClass('/dashboard')"
              >통계</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/profile" :class="navClass('/profile')"
              >설정</RouterLink
            >
          </li>
        </ul>
      </nav>
    </header>

    <!-- ✅ 본문 영역 (스크롤 가능)  여기가 문제-->
    <main class="main-content p-6">
      <RouterView />

      <!-- 거래 추가 모달 -->
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
import { useModalStore } from '@/stores/modalStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useRoute } from 'vue-router';
import BaseModal from '@/components/base/baseModal.vue';
import TransactionForm from '@/views/TransactionForm.vue';

const modal = useModalStore();
const transactionStore = useTransactionStore();
const route = useRoute();

const onAddComplete = async () => {
  await transactionStore.fetchTransactions();
  modal.close();
};

const navClass = (path) => {
  return {
    'active-link': route.path.startsWith(path),
  };
};
</script>

<style scoped>
.app-container {
  max-width: 414px;
  height: 896px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.nav-fixed {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 414px;
  z-index: 10;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-bar {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li a {
  padding: 6px 12px;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
}

.nav-list li a.active-link {
  background-color: #6c757d;
  color: white;
  font-weight: bold;
}

.main-content {
  padding: 70px 16px 16px; /* 네비게이션 높이만큼 상단 패딩 */
  overflow-y: auto;
  flex: 1;
  height: 100%;
}
</style>
