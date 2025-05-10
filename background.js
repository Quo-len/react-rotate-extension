// Listen for keyboard commands
chrome.commands.onCommand.addListener((command) => {
	// Get the active tab
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length === 0) return;

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
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			args: [rotationCommand],
			func: executeRotation,
		});
	});
});

// This function contains the rotation logic
function executeRotation(cmd) {
	const html = document.documentElement;
	const body = document.body;

	if (cmd === 'reset') {
		const wrapper = document.getElementById('portrait-mode-wrapper');
		if (wrapper) {
			while (wrapper.firstChild) body.appendChild(wrapper.firstChild);
			wrapper.remove();
		}
		html.removeAttribute('style');
		body.removeAttribute('style');
		window.scrollTo(0, 0);

		// Reset the rotation counter
		document.body.setAttribute('data-rotation', '0');
		return;
	}

	// Get current rotation or initialize to 0
	let currentRotation = parseInt(document.body.getAttribute('data-rotation') || '0');

	// Update rotation based on command
	if (cmd === 'left') {
		currentRotation = (currentRotation - 90) % 360;
	} else if (cmd === 'right') {
		currentRotation = (currentRotation + 90) % 360;
	}

	// Normalize negative rotations to positive equivalent
	if (currentRotation < 0) {
		currentRotation = 360 + currentRotation;
	}

	// Store the updated rotation
	document.body.setAttribute('data-rotation', currentRotation.toString());

	// Set up base wrapper if not already there
	if (!document.getElementById('portrait-mode-wrapper')) {
		const wrapper = document.createElement('div');
		wrapper.id = 'portrait-mode-wrapper';

		while (body.firstChild) {
			wrapper.appendChild(body.firstChild);
		}

		body.appendChild(wrapper);
	}

	const viewportHeight = window.innerHeight;
	const viewportWidth = window.innerWidth;

	html.style.width = '100%';
	html.style.height = '100%';
	html.style.overflow = 'hidden';

	// Apply rotation and position based on current rotation angle
	switch (currentRotation) {
		case 90:
			// Right landscape (clockwise)
			body.setAttribute(
				'style',
				`
        transform: rotate(90deg);
        transform-origin: left top;
        position: absolute;
        top: 0;
        left: ${viewportWidth}px;
        width: ${viewportHeight}px;
        height: ${viewportWidth}px;
        overflow-x: hidden;
        overflow-y: auto;
        `
			);
			break;
		case 180:
			// Upside down - FIXED
			body.setAttribute(
				'style',
				`
        transform: rotate(180deg);
        transform-origin: center center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        `
			);
			break;
		case 270:
			// Left landscape (counter-clockwise) - FIXED
			body.setAttribute(
				'style',
				`
        transform: rotate(270deg);
        transform-origin: top left;
        position: absolute;
        top: ${viewportHeight}px;
        left: 0;
        width: ${viewportHeight}px;
        height: ${viewportWidth}px;
        overflow-x: hidden;
        overflow-y: auto;
        `
			);
			break;
		case 0:
		default:
			// Normal portrait
			body.setAttribute(
				'style',
				`
        transform: rotate(0deg);
        position: relative;
        top: 0;
        left: 0;
        width: ${viewportWidth}px;
        height: ${viewportHeight}px;
        overflow-x: hidden;
        overflow-y: auto;
        `
			);
			break;
	}

	window.scrollTo(0, 0);
}
