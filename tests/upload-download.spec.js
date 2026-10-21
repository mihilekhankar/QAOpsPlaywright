const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');

async function writeExcel(searchText, replaceText, change, filePath) {
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText);
    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
    let output = { row: -1, column: -1 };
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

//Update Mango Price to 1200
//writeExcel("Mango", 1200, {rowChange:0,colChange:2}, "C:/Users/MIHIL EKHANKAR/Downloads/exceldownloadtest.xlsx");

test('Upload and Download Excel', async ({ page }) => {
    const textSearch = "Mango";
    const updatePrice = 1200;
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    await writeExcel(textSearch, updatePrice, { rowChange: 0, colChange: 2 }, "C:/Users/MIHIL EKHANKAR/Downloads/download.xlsx");
    await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("C:/Users/MIHIL EKHANKAR/Downloads/download.xlsx");
    const textlocator = await page.getByText(textSearch);
    const desiredRow = await page.getByRole('row').filter({ has: textlocator });
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updatePrice .toString());


});
