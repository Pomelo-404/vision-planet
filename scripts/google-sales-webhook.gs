const SALES_SHEET = "Ventas";

function doPost(event) {
  const payload = JSON.parse(event.postData.contents);
  const token = PropertiesService.getScriptProperties().getProperty("VENTAS_TOKEN");
  if (!token || payload.token !== token) return json({ ok: false });

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SALES_SHEET) || spreadsheet.insertSheet(SALES_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Fecha", "Estado", "Cliente", "Teléfono", "ID", "Modelo", "Armazón",
      "Marca", "Color", "Precio", "Notas",
    ]);
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    new Date(payload.timestamp), payload.status, payload.customerName, payload.phone,
    payload.id, payload.model, payload.name, payload.brand, payload.color,
    payload.price, payload.notes,
  ]);
  return json({ ok: true });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
