const axios = require('axios');
const dayjs = require('dayjs');
const { webhookUrl, sheetName } = require('./config');
const { loadDuties } = require('./helpers/dutyLoader');

const START_DATE = '2025-05-26';

function getDutyIndices() {
    const today = dayjs();
    const start = dayjs(START_DATE);
    const daysPassed = today.diff(start, 'day');

    const sprintIndex = Math.floor(daysPassed / 14);
    const dailyIndex = daysPassed;

    return { sprintIndex, dailyIndex };
}

async function sendMessage() {
    const today = dayjs().format('dddd, MMMM D, YYYY');
    const { sprintIndex, dailyIndex } = getDutyIndices();

    const duty = loadDuties('./duties.xlsx', sprintIndex, dailyIndex, sheetName);
    const sprintNumber = sprintIndex + 1;

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
