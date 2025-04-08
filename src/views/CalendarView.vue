<template>
  <div class="calendar">
    <div class="calendar-grid">
      <div
        v-for="day in daysInMonth"
        :key="day.date"
        class="calendar-cell"
        @click="$emit('select-day', day.transaction)"
      >
        <div class="date">{{ day.date }}</div>
        <div v-if="day.transaction" class="summary">
          <span class="emoji">{{
            getCategoryEmoji(day.transaction.category)
          }}</span>
          <span class="amount">{{ day.transaction.amount }}원</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

// 이번 달 날짜 목록 만들기
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

// 날짜 수 계산
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// 날짜와 거래 매칭
const daysInMonth = computed(() => {
  const days = [];
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      '0'
    )}-${String(i).padStart(2, '0')}`;
    const transaction = store.transactions.find((tx) => tx.date === dateStr);
    days.push({ date: i, transaction });
  }
  return days;
});

// 카테고리에 따라 이모지 표시 (간단 예시)
const getCategoryEmoji = (category) => {
  const map = {
    식비: '🍕',
    교통: '🚌',
    쇼핑: '🛍️',
    급여: '💵',
  };
  return map[category] || '💬';
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.calendar-cell {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
}
.date {
  font-weight: bold;
}
.summary {
  font-size: 0.9em;
  margin-top: 4px;
}
.emoji {
  font-size: 1.2em;
}
</style>
