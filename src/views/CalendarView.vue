<template>
  <div class="calendar">
    <!-- 📅 요일 헤더 -->
    <div class="weekday-header">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- 📆 달력 셀 -->
    <div class="calendar-grid">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        class="calendar-cell"
        :class="{ 'outside-month': !day.date }"
        @click="onClickDay(day)"
      >
        <div v-if="day.date" class="date">{{ day.date }}</div>

        <div v-if="day.transactions.length">
          <div
            v-for="(tx, i) in day.transactions.slice(0, 3)"
            :key="tx.id"
            class="summary"
            :class="tx.type"
          >
            <span>{{ getCategoryEmoji(tx.category) }}</span>
            <span>{{ tx.amount.toLocaleString() }}</span>
          </div>
          <div v-if="day.transactions.length > 3" class="more-indicator">
            +{{ day.transactions.length - 3 }}개
          </div>
        </div>

        <div v-else class="no-transaction-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['select-day']);

const props = defineProps({
  year: Number,
  month: Number,
  transactions: Array,
});

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

const daysInMonth = computed(() => {
  const days = [];
  const total = getDaysInMonth(props.year, props.month);
  const start = (getStartDay(props.year, props.month) + 6) % 7; // 월요일 시작

  for (let i = 0; i < start; i++) {
    days.push({ date: '', fullDate: '', transactions: [] });
  }

  for (let i = 1; i <= total; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(props.month + 1).padStart(2, '0');
    const fullDate = `${props.year}-${monthStr}-${dayStr}`;
    const txs = props.transactions.filter((tx) => tx.date === fullDate);
    days.push({ date: i, fullDate, transactions: txs });
  }

  while (days.length % 7 !== 0) {
    days.push({ date: '', fullDate: '', transactions: [] });
  }

  return days;
});

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

const onClickDay = (day) => {
  if (day.fullDate) emit('select-day', day.fullDate);
};
</script>

<style scoped>
.calendar {
  width: 100%;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
}

.weekday {
  padding: 10px 0;
  font-size: 0.9rem;
  color: #555;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
}

.calendar-cell {
  border: 1px solid #ddd;
  padding: 6px;
  min-height: 120px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.calendar-cell:hover {
  background-color: #f9f9f9;
}

.calendar-cell.outside-month {
  background-color: #f0f0f0; /* 연한 회색 */
  color: #aaa;
  pointer-events: none; /* 클릭 방지 (선택사항) */
}

.date {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.tx-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-wrap: wrap;
  word-break: break-word;
}

.summary {
  font-size: 0.72em; /* ✅ 줄임 */
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  word-break: break-word; /* ✅ 줄바꿈 허용 */
  line-height: 1.2;
}

.more-indicator {
  font-size: 0.68em;
  color: #999;
  text-align: right;
  margin-top: 2px;
}

.income {
  color: #007bff;
}

.expense {
  color: #dc3545;
}
</style>
