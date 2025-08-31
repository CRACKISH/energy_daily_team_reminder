const axios = require('axios');

const { messageType, startSprint, webhookUrl } = require('./config');
const { loadDuties } = require('./helpers/dutyLoader');
const { buildMessage } = require('./helpers/messageBuilder');
const { getDutyIndices, isEndOfSprint } = require('./helpers/dates');

async function sendMessage() {
	const { sprintIndex, dailyIndex } = getDutyIndices();
	const duties = loadDuties(sprintIndex, dailyIndex);
	const sprintNumber = sprintIndex + startSprint;
	const showNextDuties = isEndOfSprint();
	const message = buildMessage(duties, sprintNumber, showNextDuties, messageType);

	try {
		const response = await axios.post(webhookUrl, message);
		console.log('✅ Message sent to Teams:', response.status);
	} catch (error) {
		console.error('❌ Failed to send message:', error.message);
	}
}

sendMessage();
