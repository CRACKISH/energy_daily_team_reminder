const dayjs = require('dayjs');

const { readReplacements } = require('../services/replacementsFileReader');

const zoneMap = {
	NightTests: 'nightTests',
	Demo: 'demo',
	Retro: 'retro',
	'4thLine': 'fourthLine',
};

function normZone(z) {
	if (!z) return null;
	return zoneMap[z] ?? zoneMap[(z + '').replace(/\s+/g, '')] ?? null;
}

function isSameDay(value, refDay) {
	if (!value) {
		return false;
	}
	const parsed = dayjs(value, 'MM/DD/YYYY', true);
	return parsed.isValid() && parsed.isSame(refDay, 'day');
}

function applyReplacementsToDuties(duties, sprintNumber, today = dayjs()) {
	const replacements = readReplacements();

	if (!replacements?.length) {
		return duties;
	}

	const updated = {
		...duties,
		currentDuties: { ...duties.currentDuties },
		futureDuties: { ...duties.futureDuties },
	};

	const currentSprint = Number(sprintNumber);
	const nextSprint = currentSprint + 1;
	const tomorrow = today.add(1, 'day');

	for (const replacement of replacements) {
		const zone = normZone(replacement.dutyZone);
		if (!zone) {
			continue;
		}

		if (zone === 'nightTests') {
			if (replacement.replacement) {
				if (isSameDay(replacement.day, today) && updated.currentDuties.nightTests) {
					updated.currentDuties.nightTests = {
						...updated.currentDuties.nightTests,
						duty: replacement.replacement,
					};
				}
				if (isSameDay(replacement.day, tomorrow) && updated.futureDuties.nightTests) {
					updated.futureDuties.nightTests = {
						...updated.futureDuties.nightTests,
						duty: replacement.replacement,
					};
				}
			}
			continue;
		}

		if (replacement.sprintNumber !== undefined && replacement.replacement) {
			const replacementSprintNumber = Number(replacement.sprintNumber);
			if (replacementSprintNumber === currentSprint && updated.currentDuties[zone]) {
				updated.currentDuties[zone] = {
					...updated.currentDuties[zone],
					duty: replacement.replacement,
				};
			}
			if (replacementSprintNumber === nextSprint && updated.futureDuties[zone]) {
				updated.futureDuties[zone] = {
					...updated.futureDuties[zone],
					duty: replacement.replacement,
				};
			}
		}
	}
	return updated;
}

module.exports = { applyReplacementsToDuties };
