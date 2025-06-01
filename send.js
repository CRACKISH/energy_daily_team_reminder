const axios = require('axios');
const dayjs = require('dayjs');
const { webhookUrl, sheetName } = require('./config');
const { loadDuties } = require('./helpers/dutyLoader');

const START_SPRINT = 146;
const START_DATE = '2025-05-26'; // start date of 146 sprint

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
	const start = dayjs(START_DATE);
	const businessDaysPassed = getBusinessDaysBetween(start, today);
	const daysPassed = today.diff(start, 'day');

	const sprintIndex = Math.floor(daysPassed / 14);
	const dailyIndex = businessDaysPassed;

	return { sprintIndex, dailyIndex };
}

async function sendMessage() {
	const today = dayjs().format('dddd, MMMM D, YYYY');
	const { sprintIndex, dailyIndex } = getDutyIndices();

	const filePath = './duties.xlsx';
	const duty = loadDuties(filePath, sprintIndex, dailyIndex, sheetName);
	const sprintNumber = sprintIndex + START_SPRINT;

	const message = {
		'@type': 'MessageCard',
		'@context': 'https://schema.org/extensions',
		summary: 'Daily Duty Reminder',
		themeColor: '0076D7',
		title: `📅 Daily Duty — ${today}`,
		sections: [
			{
				facts: [
					{ name: '🏃 Sprint', value: `#${sprintNumber}` },
					{ name: '👨‍💻 4th Line Duty', value: duty.fourthLine },
					{ name: '🔍 Nightly Tests Monitor', value: duty.nightTests },
					{ name: '📺 Demo Responsible', value: duty.demo },
				],
				markdown: true,
			},
		],
	};

	try {
		const response = await axios.post(webhookUrl, message);
		console.log('✅ Message sent to Teams:', response.status);
	} catch (error) {
		console.error('❌ Failed to send message:', error.message);
	}
}

sendMessage();
