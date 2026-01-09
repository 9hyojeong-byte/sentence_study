
/**
 * GOOGLE APPS SCRIPT CODE
 * Database for English Learning App
 */

const SHEET_NAME = 'EnglishEntries';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Columns: date, sentence, meaning, hint, referenceUrl, check, bookmark, createdAt
    sheet.appendRow(['date', 'sentence', 'meaning', 'hint', 'referenceUrl', 'check', 'bookmark', 'createdAt']);
  }
  return sheet;
}

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setup();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const result = data.map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      let value = row[i];
      // Convert 'TRUE'/'FALSE' strings or booleans to actual boolean for boolean fields
      if (header === 'check' || header === 'bookmark') {
        value = (value === true || value === 'TRUE' || value === 'true');
      }
      obj[header] = value;
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
    const data = sheet.getDataRange().getValues();
    
    // Identification keys
    const dateStr = String(params.date);
    const sentenceStr = String(params.sentence);

    // Find row index (1-based for Sheet, but data[0] is headers)
    let foundIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === dateStr && String(data[i][1]) === sentenceStr) {
        foundIndex = i + 1;
        break;
      }
    }

    if (params.action === "toggleBookmark") {
      if (foundIndex !== -1) {
        // Bookmark is Column 7 (index 6 zero-based)
        const currentVal = data[foundIndex - 1][6];
        const newVal = !(currentVal === true || currentVal === 'TRUE' || currentVal === 'true');
        sheet.getRange(foundIndex, 7).setValue(newVal);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', newValue: newVal }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Entry not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default Upsert Logic
    const checkVal = params.check === true;
    const bookmarkVal = params.bookmark === true;
    
    if (foundIndex !== -1) {
      // Update existing row (Columns 1-7)
      sheet.getRange(foundIndex, 1, 1, 7).setValues([[
        params.date,
        params.sentence,
        params.meaning,
        params.hint,
        params.referenceUrl,
        checkVal,
        bookmarkVal
      ]]);
    } else {
      // Append new row
      sheet.appendRow([
        params.date,
        params.sentence,
        params.meaning,
        params.hint,
        params.referenceUrl,
        checkVal,
        bookmarkVal,
        new Date().toISOString()
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
