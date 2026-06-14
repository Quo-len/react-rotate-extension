import { isValidURL, executeRotation } from '../utils';

chrome.commands.onCommand.addListener((command: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    if (tabs.length === 0) return;

    const tab = tabs[0];
    if (!isValidURL(tab.url)) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });

      // Reset badge after 2 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2000);

      return;
    }

    let rotationCommand: 'left' | 'right' | 'reset';

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

    try {
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id! },
          args: [rotationCommand],
          func: executeRotation,
        })
        .catch((error: any) => {
          console.error('Error executing rotation script:', error);
        });
    } catch (error) {
      console.error('Failed to execute rotation:', error);
    }
  });
});
