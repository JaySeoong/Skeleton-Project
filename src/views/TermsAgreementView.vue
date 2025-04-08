<template>
  <div class="container my-4 wrapper loginWrapper">
    <!-- 상단 로고 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="text-success fw-bold text-warning" style="font-size: 20px">
        **뱅크
      </h3>
    </div>

    <!-- 전체 동의 -->
    <div class="form-check mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="checkAll"
        v-model="allChecked"
        @change="toggleAll"
      />
      <label class="form-check-label fw-bold" for="checkAll"
        >전체 동의하기</label
      >
      <p class="text-muted small mt-1">
        필수 및 선택 약관 전체 동의에 포함됩니다.
      </p>
    </div>

    <hr />

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

      <!-- 약관 내용 미리보기: 갑자기 튀어나오지 않도록 v-show 사용 -->
      <textarea
        v-show="term.scroll"
        class="form-control mt-2"
        rows="4"
        readonly
      >
약관 내용 작성 필요. 약관 내용 작성 필요. 약관 내용 작성 필요. 약관 내용 작성 필요.
      </textarea>
    </div>

    <!-- 다음 버튼: 필수 약관 전체 동의 시에만 router-link 사용 -->
    <router-link
      v-if="canProceed"
      to="/signup"
      class="btn btn-white w-100 mt-4 bg-warning text-center"
    >
      다음
    </router-link>
    <button v-else class="btn btn-white w-100 mt-4 bg-warning" disabled>
      다음
    </button>
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
    // 필수 항목 모두 체크됐는지 확인
    canProceed() {
      return this.terms
        .filter((term) => term.required)
        .every((term) => term.checked);
    },
  },
  methods: {
    // 전체 동의 체크 시 모든 체크박스 업데이트
    toggleAll() {
      this.terms.forEach((term) => {
        term.checked = this.allChecked;
      });
    },
    // 개별 항목 클릭 시 전체 동의 체크 상태 자동 반영
    syncAllCheck() {
      this.allChecked = this.terms.every((term) => term.checked);
    },
  },
};
</script>

<style scoped>
.loginWrapper {
  width: 414px;
  height: 896px;
  border: 1px solid black;
  overflow-y: auto;
  box-sizing: border-box;
}

/* textarea 튀어나오는 느낌 방지 */
textarea {
  transition: opacity 0.2s ease-in-out;
}
</style>
