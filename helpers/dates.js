const dayjs = require('dayjs');

const { startDate } = require('../config');

function getBusinessDaysBetween(start, end) {
	let count = 0;
	let current = start;
	const forward = end.isAfter(start);
	while (forward ? current.isBefore(end, 'day') : current.isAfter(end, 'day')) {
		const day = current.day(); // 0 = sunday, 6 = saturday
		if (day !== 0 && day !== 6) {
			count += 1;
		}
		current = forward ? current.add(1, 'day') : current.subtract(1, 'day');
	}
	return count;
}

function getDutyIndices() {
	const today = dayjs();
	const start = dayjs(startDate);
	const businessDaysPassed = getBusinessDaysBetween(start, today);
	const daysPassed = today.diff(start, 'day');
	const sprintIndex = Math.floor(daysPassed / 14);
	const dailyIndex = businessDaysPassed;
	return { sprintIndex, dailyIndex };
}

function isEndOfSprint() {
	const today = dayjs();
	const start = dayjs(startDate);
	const daysPassed = today.diff(start, 'day');
	const dayInSprint = ((daysPassed % 14) + 14) % 14;
	return dayInSprint >= 10; // 10th day => second Thursday/Friday of the sprint;
}

module.exports = { getDutyIndices, isEndOfSprint };
