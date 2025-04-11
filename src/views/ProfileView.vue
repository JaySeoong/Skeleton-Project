<template>
  <div
    class="container-fluid bg-light d-flex justify-content-center align-items-center height-100"
  >
    <div
      class="bg-white shadow rounded d-flex flex-column"
      style="width: 390px; height: 844px"
    >
      <!--  상단 타이틀 -->
      <div class="px-4 py-3 border-bottom">
        <h5 class="text-center fw-bold mb-0">프로필 설정</h5>
      </div>

      <!--  내용 영역 (스크롤 허용) -->
      <div class="flex-grow-1 overflow-auto px-4 pt-3 pb-1">
        <div v-if="user">
          <!-- 이름 -->
          <div class="mb-2">
            <label class="form-label">이름</label>
            <input v-model="editUser.name" class="form-control" />
          </div>

          <!-- 이메일 -->
          <div class="mb-2">
            <label class="form-label">이메일</label>
            <input v-model="editUser.email" class="form-control" />
          </div>

          <!-- 휴대폰번호 -->
          <div class="mb-2">
            <label class="form-label">휴대폰번호</label>
            <input v-model="editUser.phone" class="form-control" />
          </div>

          <!-- 생년월일 -->
          <div class="mb-2">
            <label class="form-label">생년월일</label>
            <input
              type="date"
              v-model="editUser.birth"
              class="form-control"
              :max="maxDate"
            />
          </div>

          <!-- 통신사 -->
          <div class="mb-3">
            <label class="form-label">통신사</label>
            <select v-model="editUser.telecom" class="form-select">
              <option value="">통신사 선택</option>
              <option value="SKT">SKT</option>
              <option value="KT">KT</option>
              <option value="LG">LG U+</option>
            </select>
          </div>

          <button class="btn btn-warning w-100 mt-2" @click="saveChanges">
            정보 저장
          </button>
        </div>

        <div v-else class="text-center mt-5">
          <p>로그인이 필요합니다.</p>
          <router-link to="/login" class="text-primary"
            >로그인하러 가기</router-link
          >
        </div>
      </div>

      <!--  하단 버튼 고정 -->
      <div class="mt-auto w-100 px-3" style="padding-bottom: 16px">
        <button class="btn btn-outline-secondary w-100 mb-2" @click="logout">
          로그아웃
        </button>
        <button class="btn btn-outline-danger w-100" @click="deleteAccount">
          회원 탈퇴
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;
const editUser = reactive({ ...user });

const maxDate = new Date().toISOString().split('T')[0];

const saveChanges = async () => {
  const success = await authStore.updateUser(editUser);
  if (success) {
    alert('정보가 수정되었습니다.');
  } else {
    alert('수정 실패');
  }
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};

const deleteAccount = async () => {
  const confirmed = confirm('정말로 회원 탈퇴하시겠습니까?');
  if (!confirmed) return;

  await authStore.deleteUser();
  alert('탈퇴 완료');
  router.push('/login');
};
</script>

<style scoped>
/* 기본 폼 스타일이 부트스트랩에서 제공되므로 커스텀 불필요 */
</style>
