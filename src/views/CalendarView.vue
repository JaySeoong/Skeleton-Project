<template>
  <div class="calendar">
    <!-- 📅 요일 헤더 출력 -->
    <div class="weekday-header">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <!-- 📆 실제 날짜 셀 출력 -->
    <!-- 이전 / 다음 달 날짜는 회색 표시 -->
    <div class="calendar-grid">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        class="calendar-cell"
        :class="{ 'outside-month': !day.date }"
        @click="onClickDay(day)"
      >
        <!-- 날짜 숫자 출력 -->
        <div v-if="day.date" class="date">{{ day.date }}</div>

        <!-- 거래 요약 표시 (최대 3개) -->
        <!-- 수입/지출 구분 색상 클래스 -->
        <div v-if="day.transactions.length">
          <div
            v-for="(tx, i) in day.transactions.slice(0, 3)"
            :key="tx.id"
            class="summary"
            :class="tx.type"
          >
            <!-- 이모지와 금액 표시 -->
            <span>{{ getCategoryEmoji(tx.category) }}</span>
            <span>{{ tx.amount.toLocaleString() }}</span>
          </div>

          <!-- 3개 초과일 경우 추가 알림 -->
          <div v-if="day.transactions.length > 3" class="more-indicator">
            +{{ day.transactions.length - 3 }}개
          </div>
        </div>

        <!-- 거래가 없는 경우 빈 공간 -->
        <div v-else class="no-transaction-placeholder"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 상위 컴포넌트로 날짜 클릭 이벤트 전파
const emit = defineEmits(['select-day']);

// props 정의: 년/월/거래목록
const props = defineProps({
  year: Number,
  month: Number,
  transactions: Array,
});

// 📅 요일 이름 (월요일 시작 기준)
const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

// 📌 특정 월의 마지막 날짜 구하기
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// 📌 특정 월의 시작 요일 구하기 (0=일요일 → 월요일 시작 보정)
const getStartDay = (year, month) => new Date(year, month, 1).getDay();

// 📆 달력 날짜 계산 (빈칸 포함해서 7로 나누어 떨어지게 맞춤)
const daysInMonth = computed(() => {
  const days = [];
  const total = getDaysInMonth(props.year, props.month);
  const start = (getStartDay(props.year, props.month) + 6) % 7; // 일→월 보정

  // 앞쪽 빈 셀 삽입 (이전 달)
  for (let i = 0; i < start; i++) {
    days.push({ date: '', fullDate: '', transactions: [] });
  }

  // 현재 월 날짜 생성 + 해당 날짜 거래 필터링
  for (let i = 1; i <= total; i++) {
    const dayStr = String(i).padStart(2, '0');
    const monthStr = String(props.month + 1).padStart(2, '0');
    const fullDate = `${props.year}-${monthStr}-${dayStr}`;
    const txs = props.transactions.filter((tx) => tx.date === fullDate);
    days.push({ date: i, fullDate, transactions: txs });
  }

  // 마지막 줄 빈 셀 채우기 (다음 달)
  while (days.length % 7 !== 0) {
    days.push({ date: '', fullDate: '', transactions: [] });
  }

  return days;
});

// 🔤 카테고리별 이모지 매핑
const getCategoryEmoji = (category) => {
  const map = {
    식비: '🍽️',
    교통비: '🚌',
    쇼핑: '🛍️',
    월급: '💰',
    용돈: '💸',
  };
  return map[category] || '💬'; // 매핑 없으면 기본 이모지
};

// ✅ 날짜 클릭 시 상위 컴포넌트로 fullDate 전달
const onClickDay = (day) => {
  if (day.fullDate) emit('select-day', day.fullDate);
};
</script>

<style scoped>
.calendar {
  width: 100%;
}

/* 📅 요일 헤더 스타일 */
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

/* 📆 달력 그리드 */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
}

/* 📦 날짜 셀 스타일 */
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

/* ⛅ 셀 hover 효과 */
.calendar-cell:hover {
  background-color: #f9f9f9;
}

/* ⬜ 이전/다음달 영역 스타일 (회색 처리) */
.calendar-cell.outside-month {
  background-color: #f0f0f0;
  color: #aaa;
  pointer-events: none;
}

/* 🔢 날짜 텍스트 */
.date {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 4px;
}

/* 📋 거래 목록 줄 정렬 */
.tx-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-wrap: wrap;
  word-break: break-word;
}

/* 💰 거래 요약 텍스트 스타일 */
.summary {
  font-size: 0.72em;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  word-break: break-word;
  line-height: 1.2;
}

/* ➕ 거래 초과 표시 */
.more-indicator {
  font-size: 0.68em;
  color: #999;
  text-align: right;
  margin-top: 2px;
}

/* 💙 수입 색상 */
.income {
  color: #007bff;
}

/* ❤️ 지출 색상 */
.expense {
  color: #dc3545;
}
</style>
