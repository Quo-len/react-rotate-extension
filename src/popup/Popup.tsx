import React, { useEffect, useState } from "react";
import { isValidURL, executeRotation } from "../utils";
import "./Popup.css";

const Popup: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs.length === 0) return;
        const tab = tabs[0];
        if (!isValidURL(tab.url)) {
          setIsDisabled(true);
        }
      },
    );
  }, []);

  const sendCommand = (command: "left" | "right" | "reset") => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        if (tabs.length === 0) return;

        const tab = tabs[0];
        if (!isValidURL(tab.url)) {
          console.error(
            "This page cannot be rotated due to Chrome security restrictions.",
          );
          return;
        }

        try {
          chrome.scripting
            .executeScript({
              target: { tabId: tab.id! },
              args: [command],
              func: executeRotation,
            })
            .catch((error: any) => {
              console.error("Error executing rotation script:", error);
            });
        } catch (error) {
          console.error("Failed to execute rotation:", error);
        }
      },
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Page Flip</h1>
        <p>Adjust your view instantly</p>
      </div>

      <div className="button-group">
        <button
          id="rotateLeft"
          onClick={() => sendCommand("left")}
          disabled={isDisabled}
        >
          <svg
            className="icon"
            stroke="currentColor"
            fill="none"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          <span>Rotate Left</span>
        </button>
        <button
          id="rotateRight"
          onClick={() => sendCommand("right")}
          disabled={isDisabled}
        >
          <svg
            className="icon"
            stroke="currentColor"
            fill="none"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          <span>Rotate Right</span>
        </button>
        <button
          id="reset"
          onClick={() => sendCommand("reset")}
          disabled={isDisabled}
        >
          <svg
            className="icon"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M256 16C123.45 16 16 123.45 16 256s107.45 240 240 240 240-107.45 240-240S388.55 16 256 16zm0 60c99.41 0 180 80.59 180 180s-80.59 180-180 180S76 355.41 76 256 156.59 76 256 76zm-80.625 60c-.97-.005-2.006.112-3.063.313v-.032c-18.297 3.436-45.264 34.743-33.375 46.626l73.157 73.125-73.156 73.126c-14.63 14.625 29.275 58.534 43.906 43.906L256 299.906l73.156 73.156c14.63 14.628 58.537-29.28 43.906-43.906l-73.156-73.125 73.156-73.124c14.63-14.625-29.275-58.5-43.906-43.875L256 212.157l-73.156-73.125c-2.06-2.046-4.56-3.015-7.47-3.03z"></path>
          </svg>
          <span>Reset Orientation</span>
        </button>
      </div>

      <div className="footer">v4.2 • Page Flip</div>
    </div>
  );
};

export default Popup;
