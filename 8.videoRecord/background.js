chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	switch (request.command) {
		case 'appendRecordScript':
			chrome.tabs.query({ active: true, currentWindow: true }, ([ tab ]) => {
				chrome.tabs.sendMessage(tab.id, { command: request.command });
			});
			break;
	}
});
