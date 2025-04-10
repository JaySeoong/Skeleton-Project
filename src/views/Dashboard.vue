<template>
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
              class="font-semibold text-decoration-none text-dark hover:text-primary"
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
              class="font-semibold text-decoration-none hover:text-primary"
              style="
                background-color: #6c757d;
                opacity: 0.7;
                padding: 3px 10px;
                color: white;
                border-radius: 5px;
              "
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
      <div class="space-y-6">
        <!-- 상단 탭 메뉴 -->
        <div class="d-flex gap-3 border-bottom pb-2">
          <ul class="d-flex gap-3 list-unstyled mb-0">
            <li>
              <RouterLink
                to="/dashboard/summary"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('summary'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('summary'),
                }"
              >
                월별 요약
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/dashboard/income"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('income'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('income'),
                }"
              >
                수입 추이
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/dashboard/spending"
                class="fw-semibold px-2 py-1 text-decoration-none rounded"
                :class="{
                  'text-danger border-bottom border-2 border-danger bg-light':
                    $route.path.includes('spending'),
                  'text-dark hover:text-danger':
                    !$route.path.includes('spending'),
                }"
              >
                지출 추이
              </RouterLink>
            </li>
          </ul>
        </div>
        <!-- 서브 페이지 표시 영역 -->
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';

defineOptions({
  name: 'DashboardPage',
});

const $route = useRoute();
</script>

<style scoped>
.space-y-6 {
  max-width: 500px;
  margin: 0 auto;
}
.router-link-exact-active {
  font-weight: bold;
}
</style>
