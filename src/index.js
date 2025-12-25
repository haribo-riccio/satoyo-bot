import { readFileSync, writeFileSync } from 'fs';
import { fetchSP500 } from './fetchSP500.js';
import { fetchTTM } from './fetchTTM.js';
import { checkTradingDay } from './checkHoliday.js';
import { sendDiscord, formatNotifyMessage, formatHolidayMessage } from './sendDiscord.js';

const DATA_FILE = 'data.json';

/**
 * データファイルを読み込む
 * @returns {Object}
 */
function loadData() {
  const content = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

/**
 * データファイルを保存する
 * @param {Object} data
 */
function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
}

/**
 * 日付をYYYY-MM-DD形式で取得（日本時間）
 * @returns {string}
 */
function getTodayJST() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
}

/**
 * メイン処理
 */
async function main() {
  const today = new Date();
  const todayStr = getTodayJST();

  console.log(`Running for date: ${todayStr}`);

  // 取引日かチェック
  const { isTradingDay, reason, usMarketClosedYesterday } = await checkTradingDay(today);

  if (!isTradingDay) {
    console.log(`Not a trading day: ${reason}`);
    await sendDiscord(formatHolidayMessage(reason));
    return;
  }

  if (usMarketClosedYesterday) {
    console.log('Note: US market was closed yesterday, using previous SP500 close');
  }

  // データ取得
  console.log('Fetching S&P500...');
  const sp500 = await fetchSP500();
  console.log(`S&P500: ${sp500}${usMarketClosedYesterday ? ' (前々日終値)' : ''}`);

  console.log('Fetching TTM...');
  const { ttm } = await fetchTTM();
  console.log(`TTM: ${ttm}`);

  // 既存データ読み込み
  const data = loadData();

  // 前日データを更新（同じ日に複数回実行した場合は上書きしない）
  const previous = data.current.date === todayStr ? data.previous : { ...data.current };

  // 当日データを更新
  const current = {
    date: todayStr,
    sp500,
    ttm,
  };

  // 変化率を計算
  const dailyChange =
    (current.sp500 * current.ttm) / (previous.sp500 * previous.ttm) - 1;
  const ytdChange =
    (current.sp500 * current.ttm) / (data.yearStart.sp500 * data.yearStart.ttm) - 1;

  console.log(`Daily change: ${(dailyChange * 100).toFixed(2)}%`);
  console.log(`YTD change: ${(ytdChange * 100).toFixed(2)}%`);

  // Discord通知
  const message = formatNotifyMessage({
    previous,
    current,
    dailyChange,
    ytdChange,
    usMarketClosedYesterday,
  });

  console.log('Sending Discord notification...');
  await sendDiscord(message);
  console.log('Notification sent!');

  // データ保存
  data.previous = previous;
  data.current = current;
  saveData(data);
  console.log('Data saved.');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
