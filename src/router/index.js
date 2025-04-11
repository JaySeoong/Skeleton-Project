// 📁 router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// ✅ auth 레이아웃에서 사용하는 페이지들 (로그인/회원가입 등)
import IntroView from '@/views/IntroView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import TermsAgreementView from '@/views/TermsAgreementView.vue';

// ✅ default 레이아웃에서 사용하는 페이지들 (로그인 후 접근 가능한 내부 페이지)
import ProfileView from '@/views/ProfileView.vue';
import Home from '@/views/HomeView.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import TransactionView from '@/views/TransactionView.vue';

// ✅ Pinia 스토어 (로그인 상태 확인용)
import { useAuthStore } from '@/stores/authStore';

const routes = [
  // ✅ 루트 접근 시 intro 페이지로 리다이렉트
  {
    path: '/',
    redirect: '/intro',
  },

  // ✅ Intro 화면: 비회원 진입 시 처음 보여줄 소개 페이지
  {
    path: '/intro',
    name: 'Intro',
    component: IntroView,
    meta: { layout: 'auth', requiresAuth: false },
  },

  // ✅ 로그인 페이지
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { layout: 'auth' },
  },

  // ✅ 회원가입 페이지
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { layout: 'auth' },
  },

  // ✅ 이용약관 동의 페이지
  {
    path: '/terms',
    name: 'TermsAgreement',
    component: TermsAgreementView,
    meta: { layout: 'auth' },
  },

  // ✅ 홈 페이지: 로그인 후 진입, 기본 페이지
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { layout: 'default', requiresAuth: true },
  },

  // ✅ 거래 등록 화면 (입력 폼 + 카테고리 선택)
  {
    path: '/inputview',
    name: 'InputView',
    component: TransactionForm,
    meta: { layout: 'default' },
  },

  // ✅ 거래 내역 페이지: 로그인 후 접근 가능
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionView,
    meta: { layout: 'default', requiresAuth: true },
  },

  // ✅ 대시보드: 요약, 수입, 지출 통계 차트 (자식 컴포넌트 3개)
  {
    path: '/dashboard',
    redirect: '/dashboard/summary',
    component: () => import('@/views/Dashboard.vue'),
    meta: { layout: 'default', requiresAuth: true },
    children: [
      {
        path: 'summary',
        name: 'DashboardSummary',
        component: () => import('@/components/ChartMonthlySummary.vue'),
      },
      {
        path: 'income',
        name: 'DashboardIncome',
        component: () => import('@/components/ChartMonthlyIncome.vue'),
      },
      {
        path: 'spending',
        name: 'DashboardSpending',
        component: () => import('@/components/ChartMonthlySpending.vue'),
      },
    ],
  },

  // ✅ 설정(프로필) 페이지
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { layout: 'default', requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * ✅ 전역 라우터 가드
 * - requiresAuth가 true인 페이지 접근 시
 * - authStore의 isLoggedIn이 false면 로그인 페이지로 강제 이동
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    alert('로그인이 필요합니다.');
    next('/login');
  } else {
    next();
  }
});

export default router;
