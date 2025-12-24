function getTTM() {
  var url = 'https://www.murc-kawasesouba.jp/fx/index.php';

  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  var $ = Cheerio.load(html);
  var TTS = $('table:nth-child(16) > tbody > tr:nth-child(2) > td:nth-child(4)').text();
  var TTB = $('table:nth-child(16) > tbody > tr:nth-child(2) > td:nth-child(5)').text();

  var spreadsheetId = '1zgRu0By1dWlEDOkrhgBJ5rSQolAUgH33I5nyn7wPc6s';
  var sheetName = 'シート1';

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

  var row = 4;
  // E列とF列の値を取得
  var existingTTS = sheet.getRange(row, 5).getValue();
  var existingTTB = sheet.getRange(row, 6).getValue();

  // もし値が入っていたら、元あった値を上の行にコピー
  if (existingTTS || existingTTB) {
    sheet.getRange(row - 1, 5).setValue(existingTTS); // E列の値を上の行にコピー
    sheet.getRange(row - 1, 6).setValue(existingTTB); // F列の値を上の行にコピー
  }

  // 新しいTTSとTTBの値を書き込む
  sheet.getRange(row, 5).setValue(TTS); // E列にTTSを書き込む
  sheet.getRange(row, 6).setValue(TTB); // F列にTTBを書き込む
}
