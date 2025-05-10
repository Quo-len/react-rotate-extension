import { isValidURL, executeRotation } from './utils.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
	// Button event listeners
	document.getElementById('rotateLeft').addEventListener('click', () => sendCommand('left'));
	document.getElementById('rotateRight').addEventListener('click', () => sendCommand('right'));
	document.getElementById('reset').addEventListener('click', () => sendCommand('reset'));

	// Check if current page is valid for rotation
	checkCurrentPage();
});

function sendCommand(command) {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length === 0) return;

		// Check if URL is valid for injection
		const tab = tabs[0];
		if (!isValidURL(tab.url)) {
			console.error('This page cannot be rotated due to Chrome security restrictions.');
			return;
		}

		try {
			chrome.scripting
				.executeScript({
					target: { tabId: tabs[0].id },
					args: [command],
					func: executeRotation,
				})
				.catch((error) => {
					console.error('Error executing rotation script:', error);
				});
		} catch (error) {
			console.error('Failed to execute rotation:', error);
		}
	});
}

// Check if current page can be rotated
function checkCurrentPage() {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length === 0) return;

		const tab = tabs[0];
		if (!isValidURL(tab.url)) {
			// Disable buttons if on a restricted page
			document.getElementById('rotateLeft').disabled = true;
			document.getElementById('rotateRight').disabled = true;
			document.getElementById('reset').disabled = true;
		}
	});
}
