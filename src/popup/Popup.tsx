import React, { useEffect, useState } from "react";
import { isValidURL, executeRotation } from "../utils";
import "./Popup.css";

const Popup: React.FC = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [angle, setAngle] = useState(0);
  const [lastCmd, setLastCmd] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      if (!isValidURL(tabs[0].url)) setIsDisabled(true);
    });
  }, []);

  const sendCommand = (command: "left" | "right" | "reset") => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || !isValidURL(tabs[0].url)) return;
      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id! },
          args: [command],
          func: executeRotation,
        })
        .catch(console.error);
    });

    if (command === "left") {
      setAngle((a) => (a - 90 + 360) % 360);
      setLastCmd("left");
    } else if (command === "right") {
      setAngle((a) => (a + 90) % 360);
      setLastCmd("right");
    } else {
      setAngle(0);
      setLastCmd(null);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="header-logo">
          <div className="header-icon">
            <span className="icon icon-logo" />
          </div>
          <div>
            <h1>Page Flip</h1>
            <p>Adjust your view instantly</p>
          </div>
        </div>
      </div>

      {isDisabled && (
        <div className="disabled-banner" role="alert">
          <span className="icon icon-lock" />
          This page can't be rotated
        </div>
      )}

      <div className="preview-area">
        <div
          className="preview-screen"
          aria-label="Rotation preview"
          role="img"
        >
          <div
            className="preview-page"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <span />
            <span />
            <span />
          </div>
          <div className="angle-badge">{angle}°</div>
        </div>
      </div>

      <div className="button-group">
        <button
          id="rotateLeft"
          className={lastCmd === "left" ? "active" : ""}
          onClick={() => sendCommand("left")}
          disabled={isDisabled}
        >
          <span className="icon icon-left" />
          <span>Rotate left</span>
        </button>
        <button
          id="rotateRight"
          className={lastCmd === "right" ? "active" : ""}
          onClick={() => sendCommand("right")}
          disabled={isDisabled}
        >
          <span className="icon icon-right" />
          <span>Rotate right</span>
        </button>
      </div>

      <button
        id="reset"
        className="reset-btn"
        onClick={() => sendCommand("reset")}
        disabled={isDisabled}
      >
        <span className="icon icon-reset" />
        Reset orientation
      </button>

      <div className="footer">v4.2 • Page Flip</div>
    </div>
  );
};

export default Popup;
