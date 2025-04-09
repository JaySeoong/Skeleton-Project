// 📁 router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// auth 레이아웃용 뷰들
import IntroView from '@/views/IntroView.vue';
import LoginView from '@/views/LoginView.vue';
import SignUpView from '@/views/SignUpView.vue';
import TermsAgreementView from '@/views/TermsAgreementView.vue';
import ProfileView from '@/views/ProfileView.vue';
import Home from '@/views/HomeView.vue';

// Pinia store
import { useAuthStore } from '@/stores/authStore';

const routes = [
  {
    path: '/',
    redirect: '/intro',
  },
  {
    path: '/intro',
    name: 'Intro',
    component: IntroView,
    meta: { layout: 'auth', requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { layout: 'auth' },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { layout: 'auth' },
  },
  {
    path: '/terms',
    name: 'TermsAgreement',
    component: TermsAgreementView,
    meta: { layout: 'auth' },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { layout: 'default', requiresAuth: true },
  },
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
 * ✅ 라우터 가드: 로그인 필요 페이지는 authStore에서 로그인 여부 확인
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
