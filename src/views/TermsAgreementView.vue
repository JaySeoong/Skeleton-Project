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
          v-if="term.scroll"
          class="form-control mt-2"
          rows="4"
          readonly
          >{{ term.content }}</textarea
        >
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
      terms: [],
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
    async loadTermContents() {
      for (const term of this.terms) {
        if (term.scroll && term.contentUrl) {
          try {
            const response = await fetch(term.contentUrl);
            term.content = await response.text();
          } catch (err) {
            term.content = '약관을 불러오는 데 실패했습니다.';
          }
        }
      }
    },
  },
  async mounted() {
    try {
      const res = await fetch('/terms.json');
      this.terms = await res.json();
      await this.loadTermContents();
    } catch (error) {
      console.error('약관 데이터를 불러오는 중 오류:', error);
    }
  },
};
</script>

<style scoped>
textarea {
  transition: opacity 0.2s ease-in-out;
  white-space: pre-wrap; /* 줄바꿈 보이게 */
}
</style>
