<template>
  <div class="calendar">
    <div class="calendar-grid">
      <!-- 📅 한 달의 각 날짜를 반복 렌더링 -->
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="calendar-cell"
        @click="onClickDay(day)"
      >
        <!-- 📌 날짜 숫자 -->
        <div class="date">{{ day.date }}</div>

        <!-- 💸 해당 날짜의 거래 내역 존재 시 -->
        <div v-if="day.transactions.length">
          <div
            v-for="tx in day.transactions"
            :key="tx.id"
            class="summary"
            :class="tx.type"
          >
            <span>{{ getCategoryEmoji(tx.category) }}</span>
            <span>{{ tx.amount.toLocaleString() }}원</span>
          </div>
        </div>

        <!-- ❗ 거래가 없는 날짜 표시용 placeholder -->
        <div v-else class="no-transaction-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 📤 부모 컴포넌트로 날짜 클릭 이벤트 전달
const emit = defineEmits(['select-day']);

// 📥 부모로부터 전달받는 props
const props = defineProps({
  year: Number,
  month: Number,
  transactions: Array,
});

// 📆 해당 달의 날짜 수 구하기 (28~31일)
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// 📌 날짜별 거래 목록 정리된 배열 생성
const daysInMonth = computed(() => {
  const days = [];
  const total = getDaysInMonth(props.year, props.month);

  for (let i = 1; i <= total; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(props.month + 1).padStart(2, '0');
    const fullDate = `${props.year}-${monthStr}-${dayStr}`;
    const txs = props.transactions.filter((tx) => tx.date === fullDate);
    days.push({ date: i, fullDate, transactions: txs });
  }
  return days;
});

// 📊 카테고리에 따라 이모지로 변환
const getCategoryEmoji = (category) => {
  const map = {
    식비: '🍽️',
    교통비: '🚌',
    쇼핑: '🛍️',
    월급: '💰',
    용돈: '💸',
  };
  return map[category] || '💬';
};

// ✅ 날짜 클릭 시 부모로 fullDate 전달
const onClickDay = (day) => {
  emit('select-day', day.fullDate);
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 일주일 7열 */
  gap: 10px;
}

.calendar-cell {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 110px; /* 일정한 높이 유지 */
  min-height: 110px;
  padding: 6px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer; /* 손모양 커서 */
  transition: background 0.2s;
}

.calendar-cell:hover {
  background: #f9f9f9; /* hover 효과 */
}

.date {
  font-weight: bold;
  font-size: 0.95em;
  margin-bottom: 4px;
}

.summary {
  font-size: 0.8em;
  display: flex;
  justify-content: space-between;
}

.no-transaction-placeholder {
  flex: 1;
}

.income {
  color: blue; /* 수입 파란색 */
}

.expense {
  color: red; /* 지출 빨간색 */
}
</style>
