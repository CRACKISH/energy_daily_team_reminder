const XLSX = require('xlsx');

function getDuty(filePath, sheetName, index) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const names = data.flat().filter(Boolean);

    if (names.length === 0) {
        return '(no one assigned)';
    }

    return names[index % names.length];
}

function loadDuties(filePath, sprintIndex, dailyIndex) {
    return {
        fourthLine: getDuty(filePath, '4th Line', sprintIndex),
        demo: getDuty(filePath, 'Demo', sprintIndex),
        nightTests: getDuty(filePath, 'Night Tests', dailyIndex),
    };
}

module.exports = { loadDuties };
