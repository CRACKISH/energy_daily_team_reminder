const duties = require('../../duties.json');

function readDuties() {
	if (!duties) {
		return null;
	}
	return {
		fourthLine: duties['4thLine'],
		demo: duties['Demo'],
		retro: duties['Retro'] ?? duties['Demo'],
		nightTests: duties['NightTests'],
	};
}

module.exports = { readDuties };
