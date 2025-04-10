<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header" />
      </div>

      <div class="modal-body">
        <slot name="body" />
      </div>

      <!-- ✅ 하드코딩 제거하고 slot만 유지 -->
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

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

.modal-header {
  padding: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  background-color: #5e4b3c;
  color: #ffc107;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #ddd;
}
.btn {
  background-color: #5e4b3c;
  color: #ffc107;
}
</style>
