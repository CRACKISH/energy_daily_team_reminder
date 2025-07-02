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
		currentDuties: {
			nightTests: { duty: getDuty(workbook, 'Night Tests', dailyIndex), icon: '🔍' },
			fourthLine: { duty: getDuty(workbook, '4th Line', sprintIndex), icon: '👨‍💻' },
			demo: { duty: getDuty(workbook, 'Demo', sprintIndex), icon: '📺' },
			retro: { duty: getDuty(workbook, 'Retro', sprintIndex), icon: '💬' },
		},
		futureDuties: {
			nightTests: { duty: getDuty(workbook, 'Night Tests', dailyIndex + 1), icon: '🔭' },
			fourthLine: { duty: getDuty(workbook, '4th Line', sprintIndex + 1), icon: '🧑‍💼' },
			demo: { duty: getDuty(workbook, 'Demo', sprintIndex + 1), icon: '📽️' },
			retro: { duty: getDuty(workbook, 'Retro', sprintIndex + 1), icon: '📣' },
		},
	};
}

module.exports = { loadDuties };
