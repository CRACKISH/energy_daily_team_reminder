function getProvider(providerName) {
	switch (providerName) {
		case 'xlsx': {
			return require('./file-providers/xlsxFileProvider');
		}
		case 'json': {
			return require('./file-providers/jsonFileProvider');
		}
		default: {
			return null;
		}
	}
}

function readDuties(providerName) {
	const provider = getProvider(providerName);
	return provider?.readDuties();
}

module.exports = { readDuties };
