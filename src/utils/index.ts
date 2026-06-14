export function isValidURL(url: string | undefined): boolean {
  if (!url) return false;

  return !(
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('chrome-devtools://') ||
    url.startsWith('devtools://') ||
    url.startsWith('chrome-search://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('data:') ||
    url.startsWith('view-source:')
  );
}

export function executeRotation(cmd: 'left' | 'right' | 'reset'): void {
  try {
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

      document.body.setAttribute('data-rotation', '0');
      return;
    }

    let currentRotation = parseInt(document.body.getAttribute('data-rotation') || '0');

    if (cmd === 'left') {
      currentRotation = (currentRotation - 90) % 360;
    } else if (cmd === 'right') {
      currentRotation = (currentRotation + 90) % 360;
    }

    if (currentRotation < 0) {
      currentRotation = 360 + currentRotation;
    }

    document.body.setAttribute('data-rotation', currentRotation.toString());

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

    switch (currentRotation) {
      case 90:
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
  } catch (error) {
    console.error('Error during page rotation:', error);
  }
}
