function getSP500() {
  var spreadsheetId = '1zgRu0By1dWlEDOkrhgBJ5rSQolAUgH33I5nyn7wPc6s';
  var sheetName = 'シート1';
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  
  var today = new Date();
  var formatToday = Utilities.formatDate(today, 'JST', 'yyyy/MM/dd');
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate()-1);
  var formatYesterday = Utilities.formatDate(yesterday, 'JST', 'yyyy/MM/dd');

  // 日本が祝日だった場合、参照するSP500の値は全営業日なので１日飛ばす
  var jpHolidays = []
  var jpHolidayRange = sheet.getRange("I2:I30").getDisplayValues();
  // ２次配列になる仕様に対応
  for (var item of jpHolidayRange) {
    jpHolidays.push(item[0]);
  }
  var isJpHoliday = jpHolidays.includes(formatToday);
  var readYesterdayColumn = isJpHoliday ? 3: 2;

  var usHolidays = []
  var usHolidayRange = sheet.getRange("J2:J30").getDisplayValues();
  // ２次配列になる仕様に対応
  for (var item of usHolidayRange) {
    usHolidays.push(item[0]);
  }
  var isUsHoliday = usHolidays.includes(formatYesterday);

  var url = 'https://nikkeiyosoku.com/spx/data/';

  var response = UrlFetchApp.fetch(url);
  var html = response.getContentText();
  var $ = Cheerio.load(html);
  var TODAY = $('div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(1)').text();
  var SP500_TODAY = $('div.table-responsive > table > tbody > tr:nth-child(1) > td:nth-child(5)').text();
  var YESTERDAY = $(`div.table-responsive > table > tbody > tr:nth-child(${readYesterdayColumn}) > td:nth-child(1)`).text();
  var SP500_YESTERDAY = $(`div.table-responsive > table > tbody > tr:nth-child(${readYesterdayColumn}) > td:nth-child(5)`).text();

  // アメリカが祝日だった場合、前営業日と同値が入る
  if (isUsHoliday){
    sheet.getRange(3, 1).setValue(TODAY);
    sheet.getRange(3, 2).setValue(SP500_TODAY);
    sheet.getRange(4, 1).setValue(formatYesterday);
    sheet.getRange(4, 2).setValue(SP500_TODAY);
  } else {
    sheet.getRange(3, 1).setValue(YESTERDAY);
    sheet.getRange(3, 2).setValue(SP500_YESTERDAY);
    sheet.getRange(4, 1).setValue(TODAY);
    sheet.getRange(4, 2).setValue(SP500_TODAY);
  }
}