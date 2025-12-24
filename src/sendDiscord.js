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
  const { previous, current, dailyChange, ytdChange } = data;

  const formatPercent = (value) => (value * 100).toFixed(2) + '%';

  return `【円建SP500投信 速報（理論値）】
前日比：${formatPercent(dailyChange)}
年始からの損益：${formatPercent(ytdChange)}

前々日 SP500終値：${previous.sp500}
前日TTM：${previous.ttm.toFixed(2)}

前日SP500終値：${current.sp500}
本日TTM：${current.ttm.toFixed(2)}`;
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
