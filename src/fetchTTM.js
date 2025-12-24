/**
 * 外為オンラインからUSD/JPYのTTS/TTBを取得してTTMを計算
 * @returns {Promise<{tts: number, ttb: number, ttm: number}>}
 */
export async function fetchTTM() {
  const url = 'http://www.gaitameonline.com/rateaj/getrate';

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TTM: ${response.status}`);
  }

  const data = await response.json();

  // USD/JPYのレートを探す
  const usdJpy = data.quotes.find(q => q.currencyPairCode === 'USDJPY');

  if (!usdJpy) {
    throw new Error('USD/JPY rate not found');
  }

  const tts = parseFloat(usdJpy.ask);
  const ttb = parseFloat(usdJpy.bid);
  const ttm = (tts + ttb) / 2;

  return { tts, ttb, ttm };
}
