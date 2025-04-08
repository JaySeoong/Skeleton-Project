<template>
  <div class="calendar">
    <div class="calendar-grid">
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="calendar-cell"
        @click="onClickDay(day)"
      >
        <div class="date">{{ day.date }}</div>
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

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

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
  emit('select-day', day.fullDate);
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.calendar-cell {
  .calendar-cell {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 110px; /* 고정 높이 */
    min-height: 110px;
    padding: 6px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }
}
.calendar-cell:hover {
  background: #f9f9f9;
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
  color: blue;
}
.expense {
  color: red;
}
</style>
