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

      <div
        v-if="isSignedUp"
        class="d-flex justify-content-center align-items-center text-center"
        style="height: 80%"
      >
        <p class="fw-bold fs-4 text-success">지윤이 작성</p>
      </div>

      <form v-else @submit.prevent="submitForm">
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

        <div class="mb-4">
          <select class="form-select" v-model="form.telecom">
            <option value="">통신사 선택</option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LG">LG U+</option>
          </select>
        </div>

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
          <small v-if="!isAuthRequested" class="text-muted">
            * 인증 요청을 먼저 해주세요.
          </small>
        </div>

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

        <div class="ms-3 mb-3" v-if="form.showAgreements">
          <div
            class="form-check"
            v-for="(value, key) in form.agreements"
            :key="key"
          >
            <!-- '고유식별정보 처리' 항목 주석 처리 -->
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

            <!--
            <template v-if="key === 'identity'">
              <input
                class="form-check-input"
                type="checkbox"
                id="identity"
                v-model="form.agreements.identity"
                @change="checkIfAllAgreed"
              />
              <label class="form-check-label" for="identity">
                {{ agreementLabels.identity }}
              </label>
            </template>
            -->
          </div>
        </div>

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
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useAuthStore } from '@/stores/authStore';

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
    // identity: false, // 고유식별정보 항목 주석 처리
    authTerms: false,
  },
});

const agreementLabels = {
  privacy: '개인정보 이용',
  telecom: '통신사 이용약관',
  bank: '** 뱅크 개인정보보호정책',
  // identity: '고유식별정보 처리',
  authTerms: '인증사 이용약관',
};

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

const maxDate = new Date().toISOString().split('T')[0];

const isFormValid = computed(() => {
  const f = form.value;
  const filled =
    f.id &&
    f.password &&
    f.email &&
    f.name &&
    f.birth &&
    f.telecom &&
    f.phone &&
    f.agreeAll &&
    isIdChecked.value;
  return !isAuthRequested.value
    ? filled && isPasswordValid.value
    : filled && f.authCode.length === 6 && isPasswordValid.value;
});

const toggleAllAgreements = () => {
  const check = form.value.agreeAll;
  for (const key in form.value.agreements) {
    form.value.agreements[key] = check;
  }
  form.value.showAgreements = check;
};

const checkIfAllAgreed = () => {
  const values = Object.values(form.value.agreements);
  const allChecked = values.every((val) => val);
  form.value.agreeAll = allChecked;
  form.value.showAgreements = values.some((val) => val);
};

const checkDuplicateId = async () => {
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
  } catch (e) {
    alert('중복검사 실패: ' + e.message);
  }
};

const checkAuthCodeExists = async (phone) => {
  try {
    const res = await axios.get(
      `http://localhost:3000/authCodes?phone=${phone}`
    );
    return res.data.length > 0 ? res.data[0] : null;
  } catch (e) {
    return null;
  }
};

const sendAuthCode = async () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const exists = await checkAuthCodeExists(form.value.phone);
    if (exists) {
      await axios.delete(`http://localhost:3000/authCodes/${exists.id}`);
    }

    await axios.post('http://localhost:3000/authCodes', {
      id: form.value.phone,
      phone: form.value.phone,
      code,
      createdAt: new Date().toISOString(),
    });
    console.log('인증번호:', code);
    alert('인증번호가 전송되었습니다.');

    setTimeout(async () => {
      const stillExists = await checkAuthCodeExists(form.value.phone);
      if (stillExists) {
        await axios.delete(`http://localhost:3000/authCodes/${stillExists.id}`);
      }
    }, 180000);
  } catch (e) {
    alert('인증번호 전송 실패: ' + e.message);
  }
};

const verifyAuthCode = async () => {
  try {
    const saved = await checkAuthCodeExists(form.value.phone);
    if (!saved) {
      alert('인증번호가 존재하지 않거나 만료되었습니다.');
      return false;
    }

    const expired = new Date() - new Date(saved.createdAt) > 180000;
    if (form.value.authCode !== saved.code) {
      alert('인증번호가 일치하지 않습니다.');
      return false;
    }
    if (expired) {
      alert('인증번호가 만료되었습니다.');
      return false;
    }

    return true;
  } catch (e) {
    alert('인증번호 검증 오류: ' + e.message);
    return false;
  }
};

const submitForm = async () => {
  if (!isAuthRequested.value) {
    if (form.value.phone.length < 10 || form.value.phone.length > 11) {
      alert('휴대전화번호는 10~11자리여야 합니다.');
      return;
    }
    isAuthRequested.value = true;
    await sendAuthCode();
    return;
  }

  if (!form.value.authCode || form.value.authCode.length !== 6) {
    alert('6자리 인증번호를 입력해주세요.');
    return;
  }

  const verified = await verifyAuthCode();
  if (!verified) return;

  try {
    isLoading.value = true;
    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const hashedPassword = CryptoJS.SHA256(
      salt + form.value.password
    ).toString();
    const newUser = {
      id: form.value.id,
      password: hashedPassword,
      salt,
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
      setTimeout(() => router.push('/login'), 2000);
    } else {
      alert('가입 실패');
    }
  } catch (e) {
    alert('가입 실패: ' + e.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
