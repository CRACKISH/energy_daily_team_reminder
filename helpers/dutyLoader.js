const XLSX = require('xlsx');

function loadDuties(filePath, sprintIndex, dailyIndex, sheetName) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    const sprintRow = data[sprintIndex % data.length];
    const dailyRow = data[dailyIndex % data.length];

    return {
        sprintIndex: sprintIndex,
        fourthLine: sprintRow['4th Line'],
        demo: sprintRow['Demo'],
        nightTests: dailyRow['Night Tests'],
    };
}

module.exports = { loadDuties };
