<template>
  <div
    class="d-flex justify-content-center align-items-center min-vh-100 bg-white"
  >
    <div
      class="border shadow bg-white p-4"
      style="width: 414px; height: 896px; overflow-y: auto"
    >
      <!-- 상단 로고 -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold text-warning mb-0" style="font-size: 20px">
          ** 뱅크
        </h3>
      </div>

      <!-- 전체 동의 -->
      <div class="form-check mb-2">
        <input
          class="form-check-input"
          type="checkbox"
          id="checkAll"
          v-model="allChecked"
          @change="toggleAll"
        />
        <label class="form-check-label fw-bold" for="checkAll">
          전체 동의하기
        </label>
        <p class="text-muted small mt-1">
          필수 및 선택 약관 전체 동의에 포함됩니다.
        </p>
      </div>

      <hr class="my-3" />

      <!-- 약관 목록 -->
      <div class="form-check mb-3" v-for="(term, index) in terms" :key="index">
        <input
          class="form-check-input"
          type="checkbox"
          :id="'check-' + index"
          v-model="term.checked"
          @change="syncAllCheck"
        />
        <label class="form-check-label" :for="'check-' + index">
          <span
            class="badge me-1"
            :class="term.required ? 'bg-warning' : 'bg-secondary'"
          >
            {{ term.required ? '필수' : '선택' }}
          </span>
          {{ term.title }}
        </label>

        <!-- 약관 내용 미리보기 -->
        <textarea
          v-show="term.scroll"
          class="form-control mt-2"
          rows="4"
          readonly
        >
약관 내용 작성 필요. 약관 내용 작성 필요. 약관 내용 작성 필요. 약관 내용 작성 필요.
        </textarea>
      </div>

      <!-- 다음 버튼 -->
      <router-link
        v-if="canProceed"
        to="/signup"
        class="btn w-100 mt-4 text-warning fw-bold"
        style="background-color: #5e4b3c"
      >
        다음
      </router-link>
      <button
        v-else
        class="btn w-100 mt-4 text-white fw-bold"
        style="background-color: #5e4b3c"
        disabled
      >
        다음
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allChecked: false,
      terms: [
        {
          title: '**뱅크 이용약관',
          required: true,
          checked: false,
          scroll: true,
        },
        {
          title: '개인정보 수집 및 이용',
          required: true,
          checked: false,
          scroll: true,
        },
        {
          title: '실명 인증된 아이디로 가입',
          required: false,
          checked: false,
          scroll: false,
        },
        {
          title: '위치기반서비스 이용약관',
          required: false,
          checked: false,
          scroll: false,
        },
      ],
    };
  },
  computed: {
    canProceed() {
      return this.terms
        .filter((term) => term.required)
        .every((term) => term.checked);
    },
  },
  methods: {
    toggleAll() {
      this.terms.forEach((term) => {
        term.checked = this.allChecked;
      });
    },
    syncAllCheck() {
      this.allChecked = this.terms.every((term) => term.checked);
    },
  },
};
</script>

<style scoped>
textarea {
  transition: opacity 0.2s ease-in-out;
}
</style>
