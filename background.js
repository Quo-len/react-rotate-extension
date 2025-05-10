import { isValidURL, executeRotation } from './utils.js';

// Listen for keyboard commands
chrome.commands.onCommand.addListener((command) => {
	// Get the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length === 0) return;

		// Check if URL is valid for injection
		const tab = tabs[0];
		if (!isValidURL(tab.url)) {
			// Optionally notify user that this page can't be rotated
			chrome.action.setBadgeText({ text: '!' });
			chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

			// Reset badge after 2 seconds
			setTimeout(() => {
				chrome.action.setBadgeText({ text: '' });
			}, 2000);

			return;
		}

		let rotationCommand = '';

		// Map the command to the corresponding rotation
		switch (command) {
			case 'rotate-left':
				rotationCommand = 'left';
				break;
			case 'rotate-right':
				rotationCommand = 'right';
				break;
			case 'rotate-reset':
				rotationCommand = 'reset';
				break;
			default:
				return;
		}

		// Execute the rotation script on the active tab
		try {
			chrome.scripting
				.executeScript({
					target: { tabId: tabs[0].id },
					args: [rotationCommand],
					func: executeRotation,
				})
				.catch((error) => {
					console.error('Error executing rotation script:', error);
				});
		} catch (error) {
			console.error('Failed to execute rotation:', error);
		}
	});
});
