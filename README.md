# 円建SP500投信 速報通知

S&P 500指数と為替レート（TTM）から円建てS&P500投信の理論値を計算し、Discordに通知するシステム。

## 機能

- S&P 500終値の取得（Yahoo Finance Japan）
- TTS/TTB為替レートの取得（外為オンライン）
- 円建て理論値の前日比・年初来損益を計算
- Discord Webhookによる通知
- 日本祝日・米国市場休場日の自動判定

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/sp500-notify.git
cd sp500-notify
```

### 2. 依存パッケージをインストール

```bash
npm install
```

### 3. 環境変数を設定

```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### 4. ローカルで実行

```bash
npm start
```

## GitHub Actions 設定

### Secretsの登録

1. リポジトリの Settings > Secrets and variables > Actions に移動
2. 「New repository secret」をクリック
3. 以下を登録：

| Name | Value |
|------|-------|
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL |

### スケジュール

- **実行時間:** 平日 JST 9:00（UTC 0:00）
- **手動実行:** Actions タブから「Run workflow」で実行可能

## ファイル構成

```
├── .github/workflows/
│   └── notify.yml      # GitHub Actions定義
├── src/
│   ├── index.js        # メイン処理
│   ├── fetchSP500.js   # S&P500取得
│   ├── fetchTTM.js     # TTM取得
│   ├── checkHoliday.js # 祝日判定
│   └── sendDiscord.js  # Discord通知
├── data.json           # データ保持（自動更新）
└── package.json
```

## データソース

| データ | ソース | 形式 |
|--------|--------|------|
| S&P500終値 | Yahoo Finance Japan | HTMLスクレイピング |
| TTS/TTB | 外為オンライン | JSON API |
| 日本祝日 | Holidays JP API | JSON API |
| 米国休場日 | コード内定義 | 静的リスト |

## 出力例

### 通常時

```
【円建SP500投信 速報（理論値）】
前日比：2.03%
年始からの損益：14.93%

前々日 SP500終値：6774.76
前日TTM：155.85

前日SP500終値：6834.5
本日TTM：157.62
```

### 休場日

```
【円建SP500投信】
本日は米国市場休場日のためお休みです
```

## 計算ロジック

```javascript
TTM = (TTS + TTB) / 2
前日比 = (本日S&P500 × 本日TTM) / (前日S&P500 × 前日TTM) - 1
年初来 = (本日S&P500 × 本日TTM) / (年初S&P500 × 年初TTM) - 1
```

## 年次メンテナンス

毎年1月に以下を更新：

1. `data.json` の `yearStart` を新年最初の取引日のデータに更新
2. `src/checkHoliday.js` に新年の米国休場日を追加
