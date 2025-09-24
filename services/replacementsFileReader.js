/**
 * replacements.json — overrides
 * Example:
 * { "replacement":"duty name","dutyZone":"Demo","sprintNumber":155 }
 * { "replacement":"duty name","dutyZone":"NightTests","day":"09/25/2025" }
 * Fields:
 * - replacement (string, req) — who will replace.
 * - dutyZone (string, req) — "NightTests" | "Demo" | "Retro" | "4thLine".
 * - sprintNumber (number|string) — required for sprint's duties (current/future).
 * - day (string) — required for nightly tests duties: format 'MM/DD/YYYY'.
 */

function readReplacements() {
	let data = [];
	try {
		data = require('../replacements.json');
	} catch {
		data = [];
	}
	return Array.isArray(data) ? data : [];
}

module.exports = { readReplacements };
