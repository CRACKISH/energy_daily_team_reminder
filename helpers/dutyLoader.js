const XLSX = require('xlsx');

function getDuty(workbook, sheetName, index) {
	const sheet = workbook.Sheets[sheetName];
	const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

	const names = data.flat().filter(Boolean);

	if (names.length === 0) {
		return '(no one assigned)';
	}

	return names[index % names.length];
}

function loadDuties(filePath, sprintIndex, dailyIndex) {
	const workbook = XLSX.readFile(filePath);

	return {
		fourthLine: getDuty(workbook, '4th Line', sprintIndex),
		nextFourthLine: getDuty(workbook, '4th Line', sprintIndex + 1),
		demo: getDuty(workbook, 'Demo', sprintIndex),
		nextDemo: getDuty(workbook, 'Demo', sprintIndex + 1),
		retro: getDuty(workbook, 'Retro', sprintIndex),
		nextRetro: getDuty(workbook, 'Retro', sprintIndex + 1),
		nightTests: getDuty(workbook, 'Night Tests', dailyIndex),
		nextNightTests: getDuty(workbook, 'Night Tests', dailyIndex + 1),
	};
}

module.exports = { loadDuties };
