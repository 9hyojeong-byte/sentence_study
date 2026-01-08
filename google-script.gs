
/**
 * GOOGLE APPS SCRIPT CODE
 * 
 * 1. Open Google Sheets.
 * 2. Extensions -> Apps Script.
 * 3. Paste this code.
 * 4. Deploy -> New Deployment -> Web App.
 * 5. Set "Execute as: Me" and "Who has access: Anyone".
 * 6. Copy the Web App URL and paste it in `constants.ts` in the React app.
 */

const SHEET_NAME = 'EnglishEntries';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['date', 'sentence', 'meaning', 'hint', 'referenceUrl', 'createdAt']);
  }
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setup();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const result = data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || setup();
    
    sheet.appendRow([
      params.date,
      params.sentence,
      params.meaning,
      params.hint,
      params.referenceUrl,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
