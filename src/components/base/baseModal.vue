<template>
  <!-- 🔲 모달 배경 오버레이 (바깥 클릭 시 모달 닫힘) -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- 🧱 모달 헤더 슬롯 (예: 타이틀) -->
      <div class="modal-header">
        <slot name="header" />
      </div>

      <!-- 📄 모달 바디 슬롯 (주요 콘텐츠 영역) -->
      <div class="modal-body">
        <slot name="body" />
      </div>

      <!-- ✅ 모달 푸터 슬롯 (버튼 등, 하드코딩 제거됨) -->
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 🧩 상위에서 'close' 이벤트 리스닝 가능하게 설정
defineEmits(['close']);
</script>

<style scoped>
/* 🔲 전체 화면을 덮는 어두운 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검정 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 📦 모달 창 본체 */
.modal-content {
  background-color: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 🧱 헤더 스타일 (타이틀 영역) */
.modal-header {
  padding: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  background-color: #5e4b3c; /* 딥 브라운 */
  color: #ffc107; /* 골드 */
}

/* 📄 바디 영역 (내용 표시) */
.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1; /* 남은 공간 모두 차지 */
}

/* 📌 하단 버튼 영역 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #ddd;
}

/* 버튼 공통 스타일 클래스 (사용처에서 활용 가능) */
.btn {
  background-color: #5e4b3c;
  color: #ffc107;
}
</style>
