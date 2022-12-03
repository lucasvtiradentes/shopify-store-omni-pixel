function doGet(e) {
  return handleResponse(e)
}

function doPost(e) {
  return handleResponse(e)
}

/* ############################################################################################################### */

function handleResponse(e) {

  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  const QUERIES = e.parameter

  try {

    const { spread_id, sheet_name } = QUERIES
    const spreadObj = SpreadsheetApp.openById(spread_id);
    const sheetObj = spreadObj.getSheetByName(sheet_name);

    if (Object.keys(QUERIES).length === 0) { throw new Error('queries most be defined!') }

    let updatedRow;
    const rowAtSheet = getRowAtSheet(sheetObj, QUERIES.token)
    const dataType = rowAtSheet === false ? "new" : "old"

    if (QUERIES.method === "initial_access" && dataType === "new"){
      updatedRow = populateRow(sheetObj, QUERIES)
    } else if (QUERIES.method !== "initial_access" && dataType === "old"){
      updatedRow = populateRow(sheetObj, QUERIES, QUERIES.token)
    } else {
      throw new Error(`error in conditions: ${QUERIES.method} & ${dataType}`)
    }

    return generateJsonResponse({
      result: true,
      method: QUERIES.method,
      data_type: dataType,
      row: updatedRow,
      url_queries: e.parameter,
      date_time: `${getCurrentDateTimeObjFromBelem().date} - ${getCurrentDateTimeObjFromBelem().time}`
    })

  } catch (err) {

    return generateJsonResponse({
      result: false,
      method: QUERIES.method,
      url_queries: e.parameter,
      error: err.message
    })

  } finally {
    lock.releaseLock();
  }

}

/* ################################################################################################################ */


function populateRow(sheetObj, QUERIES, token) {

  const orderType = token ? "old" : "new"
  const { STORE_SHEETS_COLUMN_OBJECT, STORE_SHEETS_COLUMNS_NAMES_ARR, STORE_SHEETS_COLUMNS_LETTERS_ARR, STORE_SHEETS_INITIAL_ROW } = getGlobalVariables()
  const newOrderRow = STORE_SHEETS_INITIAL_ROW

  const rowToUpdate = getRowAtSheet(sheetObj, token)
  const sheetRow = orderType === "old" ? rowToUpdate : newOrderRow

  if (orderType === "new"){
    sheetObj.insertRowsBefore(STORE_SHEETS_INITIAL_ROW, 1);

    var allFormulaArr = STORE_SHEETS_COLUMNS_NAMES_ARR.filter((itemArr) => itemArr[0] === "formula")

    if (allFormulaArr.length > 0){

      const rowToCopy = 6

      allFormulaArr.map(itemArr => itemArr[1]).map(columnName => {
        const columnLetter = STORE_SHEETS_COLUMN_OBJECT[columnName]
        const oldRange = `${columnLetter}${rowToCopy}`
        const newRange = `${columnLetter}${STORE_SHEETS_INITIAL_ROW}`
        sheetObj.getRange(oldRange).copyTo(sheetObj.getRange(newRange)); // , {contentsOnly:true}
        fillDownFormulas(sheetObj, STORE_SHEETS_INITIAL_ROW, rowToCopy, columnLetter)
      })

    }

  }


  const initialColumn = "B" // STORE_SHEETS_COLUMN_OBJECT[0]
  const lastColumn = STORE_SHEETS_COLUMNS_LETTERS_ARR[STORE_SHEETS_COLUMNS_LETTERS_ARR.length - 1]
  sheetObj.getRange(`${initialColumn}${STORE_SHEETS_INITIAL_ROW}:${lastColumn}${STORE_SHEETS_INITIAL_ROW}`).setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);

  for (var [key, value] of Object.entries(QUERIES)) {

    const curParameterName = key
    const curParameterColumn = STORE_SHEETS_COLUMN_OBJECT[curParameterName]
    if (!curParameterColumn) { continue }

    const columnTypeIndex = STORE_SHEETS_COLUMNS_NAMES_ARR.findIndex(itemArr => itemArr[1] === curParameterName)
    if (STORE_SHEETS_COLUMNS_NAMES_ARR[columnTypeIndex][0] === "formula") { continue }

    let curParameterValue;

    if (curParameterName === "date"){
      curParameterValue= getCurrentDateTimeObjFromBelem().date
    } else if (curParameterName === "time"){
      curParameterValue = getCurrentDateTimeObjFromBelem().time
    } else if (curParameterName === "price"){
      curParameterValue = value.replace(".", ",")
    } else if (curParameterName === "path"){
      curParameterValue = value.replace(/___/g, '&')
      curParameterValue = curParameterValue.replace(/__/g, '=')
    } else {
      curParameterValue = value
    }

    sheetObj.getRange(curParameterColumn + sheetRow).setValue(curParameterValue)
  }

  return sheetRow

}

function readRow(sheet, rowAtSheet) {

  const rowToRead = getRowAtSheet(sheet, rowAtSheet)
  if (rowToRead === false){return}

  const { STORE_SHEETS_COLUMN_OBJECT, STORE_SHEETS_COLUMNS_NAMES_ARR } = getGlobalVariables()
  var rowObj = {}

  for(let x = 0; x < STORE_SHEETS_COLUMNS_NAMES_ARR.length; x++ ){
    const columnName = STORE_SHEETS_COLUMNS_NAMES_ARR[x][1]
    const col = STORE_SHEETS_COLUMN_OBJECT[columnName]
    const curCell = sheet.getRange(`${col}${rowToRead}`).getDisplayValues()
    rowObj[columnName] = curCell[0][0]
  }

  return rowObj

}

function getRowAtSheet(sheet, rowAtSheet) {

  const { STORE_SHEETS_COLUMN_OBJECT, STORE_SHEETS_INITIAL_ROW } = getGlobalVariables()
  const { token } = STORE_SHEETS_COLUMN_OBJECT

  const finalRow = sheet.getLastRow()
  const ordersArr = sheet.getRange(`${token}${STORE_SHEETS_INITIAL_ROW}:${token}${finalRow}`).getDisplayValues()
  const indexOfOrder = ordersArr.findIndex(tmpOrder => { return tmpOrder[0] == rowAtSheet });

  return indexOfOrder === -1 ? false : STORE_SHEETS_INITIAL_ROW + indexOfOrder
}

/* ############################################################################################################### */

function fillDownFormulas(currentSheet, lastRow, newLastrow, column) {

  const formatedRange = currentSheet.getRange(`${column}${lastRow}:${column}${newLastrow}`)
  currentSheet.getRange(`${column}${lastRow}`).copyTo(formatedRange, SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);

}

function getCurrentDateTimeObjFromBelem() {

let dateObj = new Date();

  const currentDate = dateObj.toLocaleDateString('pt-BR');

  dateObj.setHours(dateObj.getHours());
  const currentHour = (dateObj.getHours().toString().length == 1) ? "0" + dateObj.getHours() : dateObj.getHours()
  const currentMinute = (dateObj.getMinutes().toString().length == 1) ? "0" + dateObj.getMinutes() : dateObj.getMinutes()
  const currentTime = currentHour + ":" + currentMinute

  return {
    date: currentDate,
    time: currentTime
  }

}

function generateJsonResponse(resultObj) {

  return ContentService
    .createTextOutput(JSON.stringify(resultObj))
    .setMimeType(ContentService.MimeType.JSON);

}
