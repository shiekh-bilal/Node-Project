const xlsx = require('xlsx');

function processFile(filePath) {
    // console.log('Before Error');
    const workbook = xlsx.readFile(filePath);
    // console.log('workbook= ',workbook);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // console.log(sheet)
    const data = xlsx.utils.sheet_to_json(sheet);
    // console.log(data)
    return data;  // Returns array of objects
}

module.exports = processFile;