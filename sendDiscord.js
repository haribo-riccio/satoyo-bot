function sendDiscord() {
  // テスト
  // var webhookUrl = 'https://discord.com/api/webhooks/1293916307246289000/uc1hpj_DQ9Y9QG04XvGdDqtt72tlfq9AEtdnjaKiv7XQsZ_duaD_uPofRSyrgAS6Dbg7';
  // 同期部屋
  var webhookUrl = 'https://discord.com/api/webhooks/1293897474536374284/qcAhPuOqWa8xsXAk3DlP_BX67_eSIdvUniBqXiqY1Q2nX9Xrt7LHb7pW6vJWyrmqzGdd';

  var spreadsheetId = '1zgRu0By1dWlEDOkrhgBJ5rSQolAUgH33I5nyn7wPc6s';
  var sheetName = 'シート1';

  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

  var SP500_YESTERDAY = sheet.getRange(3, 2).getValue();
  var SP500_TODAY = sheet.getRange(4, 2).getValue();

  var TTM_YESTERDAY = sheet.getRange(3, 7).getValue();
  var TTM_TODAY = sheet.getRange(4, 7).getValue();

  var CHANGE_YESTERDAY = sheet.getRange(9, 2).getValue();
  var FORMAT_CHANGE_YESTERDAY = (CHANGE_YESTERDAY * 100).toFixed(2) + '%'

  var YEAR_TO_DATE = sheet.getRange(10, 2).getValue();
  var FORMAT_YEAR_TO_DATE = (YEAR_TO_DATE * 100).toFixed(2) + '%'

  var message = {
    "content": `
    【円建SP500投信 速報（理論値）】
    前日比：${FORMAT_CHANGE_YESTERDAY}
    年始からの損益：${FORMAT_YEAR_TO_DATE}
    
    前々日 SP500終値：${SP500_YESTERDAY}
    前日TTM：${TTM_YESTERDAY}

    前日SP500終値：${SP500_TODAY}
    本日TTM：${TTM_TODAY}
    `
  };
  if (TTM_YESTERDAY == TTM_TODAY) return
  UrlFetchApp.fetch(webhookUrl, {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(message)
  });
}