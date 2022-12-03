function getGlobalVariables(){

  const STORE_SHEETS_COLUMNS_NAMES_ARR = getStoreSheetsNamesArr()
  const STORE_SHEETS_COLUMNS_LETTERS_ARR = getStoreSheetsLettersArr()
  const STORE_SHEETS_COLUMN_OBJECT = setStoreColumns(STORE_SHEETS_COLUMNS_NAMES_ARR, STORE_SHEETS_COLUMNS_LETTERS_ARR)
  const STORE_SHEETS_INITIAL_ROW = 5

  const objToExport = {
    STORE_SHEETS_COLUMN_OBJECT,
    STORE_SHEETS_COLUMNS_NAMES_ARR,
    STORE_SHEETS_INITIAL_ROW,
    STORE_SHEETS_COLUMNS_LETTERS_ARR,
  }

  return objToExport
}

/* ############################################################################################################### */

function getStoreSheetsLettersArr() {

  const columnsLetters = [
    "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q",
    "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "AA", "AB",
    "AC", "AD", "AE", "AF", "AG",
    "AH", "AI", "AJ",
    "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV"
  ]

  return columnsLetters;
}

function getStoreSheetsNamesArr() {

  const inserted = "inserted"
  const manual = "manual"
  const formula = "formula"
  const dropdown = "dropdown"
  const blank = "blank"

  const columnsNames = [

    [inserted, "date"],
    [inserted, "time"],
    [inserted, "token"],
    [inserted, "clarity_id"],
    [inserted, "ip_address"],
    [inserted, "ip_location"],
    [inserted, "device"],
    [inserted, "state"],
    [inserted, "city"],
    [inserted, "country"],
    [inserted, "month"],
    [inserted, "day"],
    [inserted, "week_day"],
    [inserted, "hour"],
    [inserted, "initial_page"],
    [inserted, "maximum_step"],

    [blank, "blank1"],

    [inserted, "initial_date"],
    [inserted, "initial_time"],
    [inserted, "referrer"],
    [inserted, "url"],
    [inserted, "path"],
    [inserted, "utm_source"],
    [inserted, "utm_medium"],
    [inserted, "utm_campaign"],
    [inserted, "utm_content"],
    [inserted, "utm_term"],
    [inserted, "utm_id"],
    [inserted, "utm_ad"],
    [inserted, "utm_placement"],
    [inserted, "utm_prodid"],
    [inserted, "utm_affiliation"],
    [inserted, "utm_coupon"],

    [blank, "blank2"],

    [inserted, "shopify_token"],
    [inserted, "product"],
    [inserted, "price"],

    [blank, "blank3"],

    [inserted, "name"],
    [inserted, "email"],
    [inserted, "cpf"],
    [inserted, "phone"],

    [blank, "blank4"],

    [inserted, "cep"],
    [inserted, "shipping_method"],

    [blank, "blank5"],

    [inserted, "payment_method"],
  ]

  return columnsNames
}

/* ############################################################################################################### */

function setStoreColumns(namesArr, lettersArr) {

  let columnObject = {}
  let onlyNamesArr = [...namesArr].map(x => x[1])

  for (let x = 0; x < onlyNamesArr.length; x++) {
    columnObject[onlyNamesArr[x]] = lettersArr[x];
  }

  return columnObject

}

/* ############################################################################################################### */
