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
      wrapper.style.width = "100%";
      wrapper.style.minHeight = "100%";

      while (body.firstChild) {
        wrapper.appendChild(body.firstChild);
      }

      body.appendChild(wrapper);
    }

    html.style.width = "100vw";
    html.style.height = "100vh";
    html.style.overflow = "hidden";
    html.style.margin = "0";
    html.style.padding = "0";

    const commonStyles = `
      position: absolute;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: auto;
    `;

    switch (currentRotation) {
      case 90:
        body.setAttribute(
          "style",
          `
          ${commonStyles}
          transform: rotate(90deg);
          transform-origin: top left;
          top: 0;
          left: 100vw;
          width: 100vh;
          height: 100vw;
          `,
        );
        break;
      case 180:
        body.setAttribute(
          "style",
          `
          ${commonStyles}
          transform: rotate(180deg);
          transform-origin: center center;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          `,
        );
        break;
      case 270:
        body.setAttribute(
          "style",
          `
          ${commonStyles}
          transform: rotate(270deg);
          transform-origin: top left;
          top: 100vh;
          left: 0;
          width: 100vh;
          height: 100vw;
          `,
        );
        break;
      case 0:
      default:
        body.setAttribute(
          "style",
          `
          ${commonStyles}
          transform: rotate(0deg);
          position: relative;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          `,
        );
        break;
    }

    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error during page rotation:", error);
  }
}
