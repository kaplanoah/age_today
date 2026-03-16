# Age Today - Chrome Extension

## Building the zip for Chrome Web Store

When asked to create a zip for the Chrome Web Store, run:

```
rm -f age_today.zip && zip -r age_today.zip manifest.json popup.html popup.js background.js icons/
```

Only these files belong in the zip:
- `manifest.json`
- `popup.html`
- `popup.js` (bundled output)
- `background.js` (service worker, not bundled)
- `icons/`

Do NOT include `src.js`, `node_modules/`, `package.json`, or any other dev/repo files.
