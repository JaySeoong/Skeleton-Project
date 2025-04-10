<script setup>
import MonthlySummary from '@/components/MonthlySummary.vue';
import RecentTransactionList from '@/components/RecentTransactionList.vue';
import AddTransactionButton from '@/components/AddTransactionButton.vue';
</script>

<template>
  <!-- <div class="min-h-screen bg-gray-50 text-gray-800"> -->

  <!-- 전체 뷰포트 영역 가운데 정렬 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <!-- 고정 크기 박스 -->
    <div
      class="border shadow d-flex flex-column justify-content-start align-items-center p-4"
      style="width: 414px; height: 896px"
    >
      <!-- 네비게이션 바 -->
      <nav class="bg-white shadow-md p-4 flex gap-4">
        <ul class="d-flex gap-4 list-unstyled">
          <li>
            <RouterLink
              to="/home"
              class="font-semibold text-decoration-none hover:text-primary"
              style="
                background-color: #6c757d;
                opacity: 0.7;
                padding: 3px 10px;
                color: white;
                border-radius: 5px;
              "
            >
              홈
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/transactions"
              class="font-semibold text-decoration-none text-dark hover:text-primary"
            >
              거래내역
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/dashboard"
              class="font-semibold text-decoration-none text-dark hover:text-primary"
            >
              통계
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/profile"
              class="font-semibold text-decoration-none text-dark hover:text-primary"
            >
              설정
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="home-container">
        <MonthlySummary />
        <RecentTransactionList />
        <AddTransactionButton />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
