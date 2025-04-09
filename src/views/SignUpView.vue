<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow p-4 bg-white"
      style="width: 414px; height: 896px; overflow-y: auto"
    >
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
        <p class="fw-bold fs-4 text-success">🎉 가입 완료 🎉</p>
      </div>

      <!-- 회원가입 폼 -->
      <form v-else @submit.prevent="submitForm">
        <!-- 아이디 + 중복검사 -->
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

        <p
          v-if="idCheckMessage"
          :class="idCheckValid ? 'text-success' : 'text-danger'"
          class="mb-2"
        >
          {{ idCheckMessage }}
        </p>

        <!-- 비밀번호 -->
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

        <!-- 이메일, 이름, 생년월일 -->
        <div class="mb-3">
          <input
            type="email"
            class="form-control"
            v-model="form.email"
            placeholder="이메일"
          />
        </div>
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            placeholder="이름"
          />
        </div>
        <div class="mb-3">
          <input
            type="date"
            class="form-control"
            v-model="form.birth"
            :max="maxDate"
          />
        </div>

        <!-- 통신사 -->
        <div class="mb-4">
          <select class="form-select" v-model="form.telecom">
            <option value="">통신사 선택</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
          </select>
        </div>

        <!-- 전화번호 + 인증번호 -->
        <div class="mb-3">
          <input
            type="tel"
            class="form-control"
            v-model="form.phone"
            placeholder="휴대전화번호"
          />
        </div>
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

        <!-- 약관 전체동의 -->
        <div class="form-check mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="agreeAll"
            v-model="form.agreeAll"
            @change="toggleAllAgreements"
          />
          <label class="form-check-label fw-bold" for="agreeAll">
            [필수] 인증 약관 전체동의
          </label>
        </div>

        <!-- 세부 약관 -->
        <div class="ms-3 mb-3" v-if="form.showAgreements">
          <div
            class="form-check"
            v-for="(value, key) in form.agreements"
            :key="key"
          >
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
          </div>
        </div>

        <!-- 제출 버튼 -->
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const router = useRouter();
const authStore = useAuthStore();

const isSignedUp = ref(false);
const isAuthRequested = ref(false);
const isLoading = ref(false);
const isIdChecked = ref(false);
const idCheckMessage = ref('');
const idCheckValid = ref(false);

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
    identity: false,
    authTerms: false,
  },
});

const agreementLabels = {
  privacy: '개인정보 이용',
  telecom: '통신사 이용약관',
  bank: '** 뱅크 개인정보보호정책',
  identity: '고유식별정보 처리',
  authTerms: '인증사 이용약관',
};

const passwordMessage = computed(() => {
  const password = form.value.password;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const count = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (
    (count >= 3 && password.length >= 8) ||
    (count >= 2 && password.length >= 10)
  ) {
    return '사용 가능한 비밀번호입니다.';
  } else {
    return '비밀번호는 3종류 이상 조합 8자리 이상 또는 2종류 조합 10자리 이상이어야 합니다.';
  }
});

const isPasswordValid = computed(() => {
  return passwordMessage.value === '사용 가능한 비밀번호입니다.';
});

const maxDate = new Date().toISOString().split('T')[0];

const isFormValid = computed(() => {
  const f = form.value;
  const allFilled =
    f.id &&
    f.password &&
    f.email &&
    f.name &&
    f.birth &&
    f.telecom &&
    f.phone &&
    f.agreeAll &&
    isIdChecked.value;
  const passwordOk = isPasswordValid.value;
  return !isAuthRequested.value
    ? allFilled && passwordOk
    : allFilled && f.authCode.length === 6 && passwordOk;
});

const toggleAllAgreements = () => {
  const isChecked = form.value.agreeAll;
  for (let key in form.value.agreements) {
    form.value.agreements[key] = isChecked;
  }
  form.value.showAgreements = isChecked;
};

const checkIfAllAgreed = () => {
  const values = Object.values(form.value.agreements);
  const allChecked = values.every((val) => val);
  form.value.agreeAll = allChecked;
  form.value.showAgreements = values.some((val) => val);
};

const checkDuplicateId = async () => {
  if (!form.value.id) {
    alert('아이디를 입력해주세요.');
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:3000/users?id=${form.value.id}`
    );
    if (res.data.length > 0) {
      idCheckValid.value = false;
      idCheckMessage.value = '이미 사용 중인 아이디입니다.';
    } else {
      idCheckValid.value = true;
      idCheckMessage.value = '사용 가능한 아이디입니다.';
      isIdChecked.value = true;
    }
  } catch (error) {
    alert('중복 검사 실패: ' + error.message);
  }
};

const submitForm = async () => {
  if (!isAuthRequested.value) {
    if (form.value.phone.length < 10 || form.value.phone.length > 11) {
      alert('휴대전화번호는 10자리 또는 11자리여야 합니다.');
      return;
    }
    isAuthRequested.value = true;
    alert('인증번호가 전송되었습니다.');
    return;
  }

  if (!form.value.authCode || form.value.authCode.length !== 6) {
    alert('6자리 인증번호를 입력해주세요.');
    return;
  }

  if (!isIdChecked.value || !idCheckValid.value) {
    alert('아이디 중복 검사를 완료해주세요.');
    return;
  }

  isLoading.value = true;

  try {
    // 아래는 bcrypt 구현 -> 사용불가
    // const hashedPassword = await bcrypt.hash(this.form.password, 10)
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hashedPassword = CryptoJS.SHA256(
      salt + form.value.password
    ).toString();

    const newUser = {
      id: form.value.id,
      password: hashedPassword,
      salt: salt,
      email: form.value.email,
      name: form.value.name,
      birth: form.value.birth,
      telecom: form.value.telecom,
      phone: form.value.phone,
      agreements: form.value.agreements,
    };

    const success = await authStore.register(newUser);
    if (success) {
      isSignedUp.value = true;
      alert('가입 완료!');
      setTimeout(() => router.push('/login'), 4000);
    } else {
      alert('가입 실패');
    }
  } catch (error) {
    alert('가입 실패: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
