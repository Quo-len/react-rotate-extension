export function isValidURL(url: string | undefined): boolean {
  if (!url) return false;

  return !(
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("chrome-devtools://") ||
    url.startsWith("devtools://") ||
    url.startsWith("chrome-search://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.startsWith("data:") ||
    url.startsWith("view-source:")
  );
}

export function executeRotation(cmd: "left" | "right" | "reset"): void {
  try {
    const html = document.documentElement;
    const body = document.body;

    if (cmd === "reset") {
      const wrapper = document.getElementById("portrait-mode-wrapper");
      if (wrapper) {
        while (wrapper.firstChild) body.appendChild(wrapper.firstChild);
        wrapper.remove();
      }
      html.style.width = "";
      html.style.height = "";
      html.style.overflow = "";
      html.style.margin = "";
      html.style.padding = "";
      body.removeAttribute("style");
      body.removeAttribute("data-rotation");
      window.scrollTo(0, 0);
      return;
    }

    let currentRotation = parseInt(
      document.body.getAttribute("data-rotation") || "0",
    );

    if (cmd === "left") {
      currentRotation = (currentRotation - 90) % 360;
    } else if (cmd === "right") {
      currentRotation = (currentRotation + 90) % 360;
    }

    if (currentRotation < 0) {
      currentRotation = 360 + currentRotation;
    }

    document.body.setAttribute("data-rotation", currentRotation.toString());

    if (!document.getElementById("portrait-mode-wrapper")) {
      const wrapper = document.createElement("div");
      wrapper.id = "portrait-mode-wrapper";
      wrapper.style.cssText = `
        width: 100% !important;
        min-height: 100% !important;
        display: block !important;
        position: relative !important;
        margin: 0 !important;
        padding: 0 !important;
      `;

      while (body.firstChild) {
        wrapper.appendChild(body.firstChild);
      }

      body.appendChild(wrapper);
    }

    html.style.setProperty("width", "100vw", "important");
    html.style.setProperty("height", "100vh", "important");
    html.style.setProperty("overflow", "hidden", "important");
    html.style.setProperty("margin", "0", "important");
    html.style.setProperty("padding", "0", "important");

    const baseBodyStyles = `
      position: absolute !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
    `;

    switch (currentRotation) {
      case 90:
        body.style.cssText = `
          ${baseBodyStyles}
          transform: rotate(90deg) !important;
          transform-origin: top left !important;
          top: 0 !important;
          left: 100vw !important;
          width: 100vh !important;
          height: 100vw !important;
        `;
        break;
      case 180:
        body.style.cssText = `
          ${baseBodyStyles}
          transform: rotate(180deg) !important;
          transform-origin: center center !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        `;
        break;
      case 270:
        body.style.cssText = `
          ${baseBodyStyles}
          transform: rotate(270deg) !important;
          transform-origin: top left !important;
          top: 100vh !important;
          left: 0 !important;
          width: 100vh !important;
          height: 100vw !important;
        `;
        break;
      case 0:
      default:
        body.style.cssText = `
          ${baseBodyStyles}
          transform: rotate(0deg) !important;
          position: relative !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        `;
        break;
    }

    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error during page rotation:", error);
  }
}
