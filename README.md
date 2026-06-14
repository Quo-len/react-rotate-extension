# Page Flip - Chrome Extension

A Chrome extension that allows you to rotate web pages left, right, or reset them to their original orientation. Perfect for viewing content in portrait mode or adjusting page orientation for better readability.

## About This Extension

### Features

- **Rotate Left**: Rotate the page 90 degrees counter-clockwise
- **Rotate Right**: Rotate the page 90 degrees clockwise
- **Reset**: Return the page to its original orientation
- **Keyboard Shortcuts**: Quick access via keyboard commands
- **Smart URL Validation**: Prevents rotation on Chrome internal pages (chrome://, chrome-extension://, etc.)

### Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**:
  - `activeTab`: Access to the currently active tab
  - `scripting`: Ability to inject scripts into web pages
  - `host_permissions`: Access to all URLs (for rotation on any website)

- **Keyboard Shortcuts**:
  - `Ctrl+Insert`: Rotate counter-clockwise (left)
  - `Ctrl+Delete`: Rotate clockwise (right)
  - `Ctrl+Home`: Reset rotation

- **Rotation Implementation**:
  - Uses CSS `transform: rotate()` to rotate the page body
  - Adjusts viewport dimensions and positioning for proper display
  - Creates a wrapper element to maintain proper scrolling behavior
  - Supports rotations: 0°, 90°, 180°, 270°

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory
6. The extension icon should now appear in your toolbar

### Usage

1. **Via Popup**:
   - Click the extension icon in the Chrome toolbar
   - Click "Left", "Right", or "Reset View" buttons

2. **Via Keyboard Shortcuts**:
   - `Ctrl+Insert`: Rotate left
   - `Ctrl+Delete`: Rotate right
   - `Ctrl+Home`: Reset rotation

## File Structure

```
rotate-extension/
├── manifest.json      # Extension configuration and metadata
├── background.js      # Service worker for handling keyboard shortcuts
├── popup.html         # Popup UI markup
├── popup.js           # Popup UI logic
├── utils.js           # Shared utility functions (URL validation, rotation logic)
├── styles.css         # Popup styling
├── icon16.png         # Extension icon (16x16)
├── icon48.png         # Extension icon (48x48)
├── icon128.png        # Extension icon (128x128)
└── README.md          # This file
```

## Browser Compatibility

- Chrome (Manifest V3 support required)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Limitations

- Cannot rotate Chrome internal pages (chrome://, chrome-extension://, etc.)
- Rotation is applied per-tab and resets when navigating to a new page
- Some websites with complex CSS may display differently after rotation
