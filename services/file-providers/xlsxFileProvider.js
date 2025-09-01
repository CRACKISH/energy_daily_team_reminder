const XLSX = require('xlsx');

function getDuties(workbook, sheetName) {
	const sheet = workbook.Sheets[sheetName];
	if (!sheet) {
		return [];
	}
	const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
	return data.flat().filter(Boolean);
}

function readDuties() {
	const filePath = './duties.xlsx';
	const workbook = XLSX.readFile(filePath);
	if (!workbook) {
		return null;
	}
	const fourthLineDuties = getDuties(workbook, '4th Line');
	const demoDuties = getDuties(workbook, 'Demo');
	const retroDuties = getDuties(workbook, 'Retro');
	const nightTestsDuties = getDuties(workbook, 'Night Tests');
	return {
		fourthLine: fourthLineDuties,
		demo: demoDuties,
		retro: retroDuties || demoDuties,
		nightTests: nightTestsDuties,
	};
}

module.exports = { readDuties };
