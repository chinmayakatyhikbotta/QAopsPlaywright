const path = require('path');
const os = require('os');
const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcelTest(searchText, replaceText, change, filePath) {
  const workbook = new ExcelJs.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');
  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replaceText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
  const output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }
    });
  });
  return output;
}

test('@Web upload and download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';
  const downloadPath = path.join(os.tmpdir(), 'playwright-upload-test.xlsx');

  await page.goto('/upload-download-test/index.html');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  await download.saveAs(downloadPath);

  await writeExcelTest(
    textSearch,
    updateValue,
    { rowChange: 0, colChange: 2 },
    downloadPath
  );

  await page.locator('#fileinput').setInputFiles(downloadPath);

  const textLocator = page.getByText(textSearch);
  const desiredRow = page.getByRole('row').filter({ has: textLocator });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(
    updateValue
  );
});
