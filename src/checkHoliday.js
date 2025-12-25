// 米国市場休場日 2025年
const US_HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK Day
  '2025-02-17', // Presidents Day
  '2025-04-18', // Good Friday
  '2025-05-26', // Memorial Day
  '2025-06-19', // Juneteenth
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas
];

// 米国市場休場日 2026年
const US_HOLIDAYS_2026 = [
  '2026-01-01', // New Year's Day
  '2026-01-19', // MLK Day
  '2026-02-16', // Presidents Day
  '2026-04-03', // Good Friday
  '2026-05-25', // Memorial Day
  '2026-06-19', // Juneteenth
  '2026-07-03', // Independence Day (observed)
  '2026-09-07', // Labor Day
  '2026-11-26', // Thanksgiving
  '2026-12-25', // Christmas
];

const US_HOLIDAYS = [...US_HOLIDAYS_2025, ...US_HOLIDAYS_2026];

/**
 * 日本の祝日かどうかをチェック
 * @param {string} dateStr YYYY-MM-DD形式
 * @returns {Promise<boolean>}
 */
export async function isJapaneseHoliday(dateStr) {
  const year = dateStr.substring(0, 4);
  const url = `https://holidays-jp.github.io/api/v1/${year}/date.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch Japanese holidays: ${response.status}`);
      return false;
    }

    const holidays = await response.json();
    return dateStr in holidays;
  } catch (error) {
    console.warn(`Error checking Japanese holiday: ${error.message}`);
    return false;
  }
}

/**
 * 米国市場休場日かどうかをチェック
 * @param {string} dateStr YYYY-MM-DD形式
 * @returns {boolean}
 */
export function isUSMarketHoliday(dateStr) {
  return US_HOLIDAYS.includes(dateStr);
}

/**
 * 前日の日付を取得（YYYY-MM-DD形式）
 * @param {Date} date
 * @returns {string}
 */
export function getPreviousDay(date) {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return prev.toISOString().split('T')[0];
}

/**
 * 前日が米国市場休場日または週末かどうかをチェック
 * @param {Date} date 本日の日付
 * @returns {boolean}
 */
export function wasUSMarketClosedYesterday(date) {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return isWeekend(yesterday) || isUSMarketHoliday(yesterdayStr);
}

/**
 * 週末かどうかをチェック
 * @param {Date} date
 * @returns {boolean}
 */
export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * 取引日かどうかをチェック（日本市場の営業日かどうか）
 * 日本の週末・祝日は基準価額が更新されないためスキップ
 * @param {Date} date
 * @returns {Promise<{isTradingDay: boolean, reason?: string, usMarketClosedYesterday?: boolean}>}
 */
export async function checkTradingDay(date) {
  const dateStr = date.toISOString().split('T')[0];

  if (isWeekend(date)) {
    return { isTradingDay: false, reason: '週末' };
  }

  if (await isJapaneseHoliday(dateStr)) {
    return { isTradingDay: false, reason: '日本の祝日' };
  }

  const usMarketClosedYesterday = wasUSMarketClosedYesterday(date);

  return { isTradingDay: true, usMarketClosedYesterday };
}
