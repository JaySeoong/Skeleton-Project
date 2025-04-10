<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow bg-white position-relative"
      style="width: 414px; height: 896px"
    >
      <!-- 내용 영역 -->
      <div class="p-4" style="height: calc(100% - 120px); overflow-y: auto">
        <!-- 네비게이션 바 -->
        <nav class="d-flex bg-white shadow-md p-4 flex gap-4">
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
                class="font-semibold text-decoration-none text-dark hover:text-primary"
              >
                통계
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/profile"
                class="font-semibold text-decoration-none hover:text-primary"
                style="
                  background-color: #6c757d;
                  opacity: 0.7;
                  padding: 3px 10px;
                  color: white;
                  border-radius: 5px;
                "
              >
                설정
              </RouterLink>
            </li>
          </ul>
        </nav>
        <!-- <h2 class="mb-4 fw-bold text-warning text-center">프로필 설정</h2> -->

        <div v-if="user">
          <!-- 이름 -->
          <div class="mb-3">
            <label class="form-label">이름</label>
            <input v-model="editUser.name" class="form-control" />
          </div>

          <!-- 이메일 -->
          <div class="mb-3">
            <label class="form-label">이메일</label>
            <input v-model="editUser.email" class="form-control" />
          </div>

          <!-- 휴대폰번호 -->
          <div class="mb-3">
            <label class="form-label">휴대폰번호</label>
            <input v-model="editUser.phone" class="form-control" />
          </div>

          <!-- 생년월일 -->
          <div class="mb-3">
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

          <!-- 저장 버튼 -->
          <button class="btn btn-warning w-100 mb-3 mt-3" @click="saveChanges">
            정보 저장
          </button>
        </div>

        <div v-else class="text-center mt-5">
          <p>로그인이 필요합니다.</p>
          <router-link to="/login">로그인하러 가기</router-link>
        </div>
      </div>

      <!-- ✅ 고정된 하단 버튼 영역 -->
      <div class="position-absolute bottom-0 start-0 end-0 px-4 pb-3">
        <button class="btn btn-outline-secondary w-100 mb-3" @click="logout">
          로그아웃
        </button>
        <button
          class="btn btn-outline-danger w-100 mb-3"
          @click="deleteAccount"
        >
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
