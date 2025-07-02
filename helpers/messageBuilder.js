const dayjs = require('dayjs');

const MessageTypes = {
	['MessageCard']: 'MessageCard',
	['AdaptiveCard']: 'AdaptiveCard',
};

function createTitle() {
	const today = dayjs().format('dddd, MMMM D, YYYY');
	return `📅 Daily Duty — ${today}`;
}

function createAdaptiveCardTextBlock(text) {
	return {
		type: 'TextBlock',
		text: text,
		weight: 'bolder',
		size: 'large',
		wrap: true,
	};
}

function createFact(name, value, messageType) {
	switch (messageType) {
		case MessageTypes.MessageCard: {
			return {
				name: name,
				value: value,
			};
		}
		case MessageTypes.AdaptiveCard: {
			return {
				title: name,
				value: value,
			};
		}
		default: {
			return null;
		}
	}
}

function createFacts(duties, showAllFacts, messageType) {
	return [
		createFact(`${duties.nightTests.icon} Nightly Tests`, duties.nightTests.duty, messageType),
		...(showAllFacts
			? [createFact(`${duties.fourthLine.icon} 4th Line Duty`, duties.fourthLine.duty, messageType)]
			: []),
		...(showAllFacts ? [createFact(`${duties.demo.icon} Demo Responsible`, duties.demo.duty, messageType)] : []),
		...(showAllFacts ? [createFact(`${duties.retro.icon} Retro Responsible`, duties.retro.duty, messageType)] : []),
	].filter(Boolean);
}

function createFactSection(title, facts, messageType) {
	switch (messageType) {
		case MessageTypes.MessageCard: {
			const factSection = {
				markdown: true,
				facts: facts,
			};
			if (!title) {
				return [factSection];
			}
			return [{ ...factSection, text: title }];
		}
		case MessageTypes.AdaptiveCard: {
			const factSection = {
				type: 'FactSet',
				facts: facts,
			};
			if (!title) {
				return [factSection];
			}
			return [createAdaptiveCardTextBlock(title), factSection];
		}
		default: {
			throw new Error('Unknown message Type');
		}
	}
}

function createMessageWithContent(content) {
	return {
		type: 'message',
		attachments: [
			{
				contentType: 'application/vnd.microsoft.card.adaptive',
				contentUrl: null,
				content: content,
			},
		],
	};
}

function createMessageObject(sections, messageType) {
	const title = createTitle();
	switch (messageType) {
		case MessageTypes.MessageCard: {
			return {
				'@type': 'MessageCard',
				'@context': 'https://schema.org/extensions',
				summary: 'Daily Duty Reminder',
				themeColor: '0076D7',
				title: title,
				sections: sections,
			};
		}
		case MessageTypes.AdaptiveCard: {
			return createMessageWithContent({
				type: 'AdaptiveCard',
				$schema: 'https://adaptivecards.io/schemas/adaptive-card.json',
				version: '1.5',
				body: [createAdaptiveCardTextBlock(title), ...sections],
			});
		}
		default: {
			throw new Error('Unknown message Type');
		}
	}
}

function buildMessage(duties, sprintNumber, showNextDuties, messageType) {
	const sprintFact = createFact('🏃 Sprint', `#${sprintNumber}`, messageType);
	const currentDutyFacts = createFacts(duties.currentDuties, true, messageType);
	const futureDutyFacts = createFacts(duties.futureDuties, showNextDuties, messageType);
	const sections = [
		...createFactSection(null, [sprintFact, ...currentDutyFacts], messageType),
		...createFactSection('**Upcoming Duties**', futureDutyFacts, messageType),
	];
	return createMessageObject(sections, messageType);
}

module.exports = { buildMessage, MessageTypes };
