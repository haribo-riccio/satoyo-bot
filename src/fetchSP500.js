import * as cheerio from 'cheerio';

/**
 * Yahoo Finance JapanからS&P500の終値を取得
 * @returns {Promise<number>} S&P500終値
 */
export async function fetchSP500() {
  const url = 'https://finance.yahoo.co.jp/quote/%5EGSPC';

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch S&P500: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Yahoo Finance Japanの価格表示要素からS&P500終値を取得
  // クラス名は動的に変わる可能性があるため、パターンマッチで取得
  const priceText = $('span[class*="_StyledNumber__value"]').first().text().trim();

  if (!priceText) {
    throw new Error('S&P500 price element not found');
  }

  // カンマを除去して数値に変換
  const price = parseFloat(priceText.replace(/,/g, ''));

  if (isNaN(price)) {
    throw new Error(`Invalid S&P500 price: ${priceText}`);
  }

  return price;
}
