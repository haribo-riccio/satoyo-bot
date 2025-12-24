# 円建SP500投信 速報通知

S&P 500指数と為替レート（TTM）を取得し、円建てS&P 500投信の理論値をDiscordに通知するGoogle Apps Scriptプロジェクト。

## 機能

- S&P 500終値のスクレイピング（nikkeiyosoku.com）
- TTS/TTB為替レートのスクレイピング（三菱UFJリサーチ&コンサルティング）
- Googleスプレッドシートへのデータ保存
- Discord Webhookによる日次通知

## セットアップ

1. [Google Apps Script](https://script.google.com/)で新規プロジェクトを作成
2. 各`.js`ファイルの内容をスクリプトエディタにコピー
3. Cheerioライブラリを追加（スクリプトID: `1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0`）
4. スプレッドシートIDとDiscord Webhook URLを必要に応じて変更
5. トリガーを設定（例：毎日朝9時に実行）

## スプレッドシート構成

| 行 | A列 | B列 | E列 | F列 | G列 |
|----|-----|-----|-----|-----|-----|
| 3 | 前々日日付 | 前々日SP500 | 前日TTS | 前日TTB | 前日TTM |
| 4 | 前日日付 | 前日SP500 | 本日TTS | 本日TTB | 本日TTM |
| 9 | - | 前日比 | - | - | - |
| 10 | - | 年初来 | - | - | - |

※ G列（TTM）と9-10行の計算値はスプレッドシート内の数式で算出

## 実行順序

1. `getSP500()` - S&P 500データ取得
2. `getTTM()` - 為替レート取得
3. `sendDiscord()` - Discord通知送信
