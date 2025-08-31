const { readDuties } = require('../services/dutiesFileReader');
const { dutiesFileProviderName } = require('../config');

function getDuty(dutiesList, path, index) {
	const data = dutiesList[path];
	const names = data.flat().filter(Boolean);
	if (names.length === 0) {
		return '(no one assigned)';
	}
	return names[index % names.length];
}

function loadDuties(sprintIndex, dailyIndex) {
	const dutiesList = readDuties(dutiesFileProviderName);
	return {
		currentDuties: {
			nightTests: { duty: getDuty(dutiesList, 'nightTests', dailyIndex), icon: '🔍' },
			fourthLine: { duty: getDuty(dutiesList, 'fourthLine', sprintIndex), icon: '👨‍💻' },
			demo: { duty: getDuty(dutiesList, 'demo', sprintIndex), icon: '📺' },
			retro: { duty: getDuty(dutiesList, 'retro', sprintIndex), icon: '💬' },
		},
		futureDuties: {
			nightTests: { duty: getDuty(dutiesList, 'nightTests', dailyIndex + 1), icon: '🔭' },
			fourthLine: { duty: getDuty(dutiesList, 'fourthLine', sprintIndex + 1), icon: '🧑‍💼' },
			demo: { duty: getDuty(dutiesList, 'demo', sprintIndex + 1), icon: '📽️' },
			retro: { duty: getDuty(dutiesList, 'retro', sprintIndex + 1), icon: '📣' },
		},
	};
}

module.exports = { loadDuties };
