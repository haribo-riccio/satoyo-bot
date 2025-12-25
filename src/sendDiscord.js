/**
 * Discordに通知を送信
 * @param {string} message 送信するメッセージ
 */
export async function sendDiscord(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error('DISCORD_WEBHOOK_URL is not set');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send Discord message: ${response.status}`);
  }
}

/**
 * 通常の通知メッセージを生成
 * @param {Object} data
 * @returns {string}
 */
export function formatNotifyMessage(data) {
  const { previous, current, dailyChange, ytdChange, usMarketClosedYesterday } = data;

  const formatPercent = (value) => (value * 100).toFixed(2) + '%';

  // 前日米国休場の場合、SP500は前々日終値を使用
  const currentSp500Label = usMarketClosedYesterday ? '前々日SP500終値' : '前日SP500終値';
  const previousSp500Label = usMarketClosedYesterday ? '3日前SP500終値' : '前々日 SP500終値';
  const usClosedNote = usMarketClosedYesterday ? '\n※前日は米国市場休場' : '';

  return `【円建SP500投信 速報（理論値）】
前日比：${formatPercent(dailyChange)}
年始からの損益：${formatPercent(ytdChange)}

${previousSp500Label}：${previous.sp500}
前日TTM：${previous.ttm.toFixed(2)}

${currentSp500Label}：${current.sp500}
本日TTM：${current.ttm.toFixed(2)}${usClosedNote}`;
}

/**
 * 休場日の通知メッセージを生成
 * @param {string} reason 休場理由
 * @returns {string}
 */
export function formatHolidayMessage(reason) {
  return `【円建SP500投信】
本日は${reason}のためお休みです`;
}
