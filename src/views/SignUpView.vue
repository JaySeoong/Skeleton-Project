<template>
  <!-- 화면 중앙에 회원가입 폼 배치 -->
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow p-4 bg-white"
      style="width: 414px; height: 896px; overflow-y: auto"
    >
      <!-- 상단 로고 -->
      <h1
        class="d-block mt-2 mb-4 text-warning fw-bold"
        style="font-size: 20px"
      >
        ** 뱅크
      </h1>

      <!-- 가입 완료 메시지 -->
      <div
        v-if="isSignedUp"
        class="d-flex justify-content-center align-items-center text-center"
        style="height: 80%"
      >
        <p class="fw-bold fs-4 text-success">⭐ 가입 완료 ⭐</p>
      </div>

      <!-- 회원가입 폼 -->
      <form v-else @submit.prevent="submitForm">
        <!-- 아이디 입력 및 중복 검사 버튼 -->
        <div class="mb-3 d-flex align-items-center">
          <input
            type="text"
            class="form-control me-2"
            v-model="form.id"
            placeholder="아이디"
            :disabled="isIdChecked"
          />
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="checkDuplicateId"
            style="font-size: 0.75rem; height: 32px; min-width: 70px"
          >
            중복검사
          </button>
        </div>

        <!-- 아이디 중복검사 메시지 -->
        <p
          v-if="idCheckMessage"
          :class="idCheckValid ? 'text-success' : 'text-danger'"
          class="mb-2"
        >
          {{ idCheckMessage }}
        </p>

        <!-- 비밀번호 입력 -->
        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            v-model="form.password"
            placeholder="비밀번호"
          />
          <small
            v-if="form.password"
            :class="isPasswordValid ? 'text-success' : 'text-danger'"
          >
            {{ passwordMessage }}
          </small>
        </div>

        <!-- 비밀번호 확인 입력 -->
        <div class="mb-3">
          <input
            type="password"
            class="form-control"
            v-model="confirmPassword"
            placeholder="비밀번호 재확인"
          />
          <small
            v-if="confirmPassword"
            :class="isPasswordMatched ? 'text-success' : 'text-danger'"
          >
            {{ passwordMatchMessage }}
          </small>
        </div>

        <!-- 이메일 입력 -->
        <div class="mb-3">
          <input
            type="email"
            class="form-control"
            v-model="form.email"
            placeholder="이메일"
          />
        </div>

        <!-- 이름 입력 -->
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            placeholder="이름"
          />
        </div>

        <!-- 생년월일 입력 -->
        <div class="mb-3">
          <input
            type="date"
            class="form-control"
            v-model="form.birth"
            :max="maxDate"
          />
        </div>

        <!-- 통신사 선택 -->
        <div class="mb-4">
          <select class="form-select" v-model="form.telecom">
            <option value="">통신사 선택</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
          </select>
        </div>

        <!-- 휴대전화번호 입력 -->
        <div class="mb-3">
          <input
            type="tel"
            class="form-control"
            v-model="form.phone"
            placeholder="휴대전화번호"
          />
        </div>

        <!-- 인증번호 입력 -->
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="form.authCode"
            placeholder="인증번호 6자리를 입력해주세요."
            maxlength="6"
            :disabled="!isAuthRequested"
          />
          <small v-if="!isAuthRequested" class="text-muted"
            >* 인증 요청을 먼저 해주세요.</small
          >
        </div>

        <!-- 전체 약관 동의 -->
        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="agreeAll"
            v-model="form.agreeAll"
            @change="toggleAllAgreements"
          />
          <label class="form-check-label fw-bold" for="agreeAll"
            >[필수] 인증 약관 전체동의</label
          >
        </div>

        <!-- 개별 약관 목록 -->
        <div class="ms-3 mb-3" v-if="form.showAgreements">
          <div
            class="form-check"
            v-for="(value, key) in form.agreements"
            :key="key"
          >
            <template v-if="key !== 'identity'">
              <input
                class="form-check-input"
                type="checkbox"
                :id="key"
                v-model="form.agreements[key]"
                @change="checkIfAllAgreed"
              />
              <label class="form-check-label" :for="key">
                {{ agreementLabels[key] }}
              </label>
            </template>
          </div>
        </div>

        <!-- 가입 또는 인증요청 버튼 -->
        <button
          type="submit"
          class="btn w-100 mt-3 d-flex justify-content-center align-items-center"
          style="background-color: #5e4b3c; color: white"
          :disabled="!isFormValid || isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{ isAuthRequested ? '가입 완료' : '인증 요청' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// 주요 라이브러리와 Pinia 스토어 import
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useAuthStore } from '@/stores/authStore';

// 라우터와 인증 스토어 초기화
const router = useRouter();
const authStore = useAuthStore();

// 상태 변수들 정의
const isSignedUp = ref(false); // 가입 완료 여부
const isAuthRequested = ref(false); // 인증 요청 여부
const isLoading = ref(false); // 로딩 상태
const isIdChecked = ref(false); // 아이디 중복검사 완료 여부
const idCheckMessage = ref(''); // 아이디 중복검사 메시지
const idCheckValid = ref(false); // 아이디 유효 여부
const confirmPassword = ref(''); // 비밀번호 확인용 변수

// 회원가입 폼 데이터 초기화
const form = ref({
  id: '',
  password: '',
  email: '',
  name: '',
  birth: '',
  telecom: '',
  phone: '',
  authCode: '',
  agreeAll: false,
  showAgreements: false,
  agreements: {
    privacy: false,
    telecom: false,
    bank: false,
    authTerms: false,
  },
});

// 약관 항목에 대한 표시 이름 정의
const agreementLabels = {
  privacy: '개인정보 이용',
  telecom: '통신사 이용약관',
  bank: '** 뱅크 개인정보보호정책',
  authTerms: '인증사 이용약관',
};

// 비밀번호 유효성 메시지 및 검증
const passwordMessage = computed(() => {
  const pw = form.value.password;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const count = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;
  if ((count >= 3 && pw.length >= 8) || (count >= 2 && pw.length >= 10))
    return '사용 가능한 비밀번호입니다.';
  return '비밀번호는 3종류 이상 조합 8자리 이상 또는 2종류 조합 10자리 이상이어야 합니다.';
});

const isPasswordValid = computed(
  () => passwordMessage.value === '사용 가능한 비밀번호입니다.'
);
const isPasswordMatched = computed(
  () => form.value.password === confirmPassword.value
);
const passwordMatchMessage = computed(() =>
  isPasswordMatched.value
    ? '비밀번호가 일치합니다.'
    : '비밀번호가 일치하지 않습니다.'
);

// 오늘 날짜까지 선택 가능하게 제한
const maxDate = new Date().toISOString().split('T')[0];

// 폼 유효성 검증
const isFormValid = computed(() => {
  const f = form.value;
  const filled =
    f.id &&
    f.password &&
    confirmPassword.value &&
    f.email &&
    f.name &&
    f.birth &&
    f.telecom &&
    f.phone &&
    f.agreeAll &&
    isIdChecked.value;
  return !isAuthRequested.value
    ? filled && isPasswordValid.value && isPasswordMatched.value
    : filled &&
        f.authCode.length === 6 &&
        isPasswordValid.value &&
        isPasswordMatched.value;
});

// 전체 약관 체크 핸들러
const toggleAllAgreements = () => {
  const check = form.value.agreeAll;
  for (const key in form.value.agreements) form.value.agreements[key] = check;
  form.value.showAgreements = check;
};

// 개별 약관 체크 시 전체동의 상태 갱신
const checkIfAllAgreed = () => {
  const values = Object.values(form.value.agreements);
  form.value.agreeAll = values.every(Boolean);
  form.value.showAgreements = values.some(Boolean);
};
</script>

<style scoped>
/* 스타일 필요 시 추가 */
</style>
