# Age Today

A Chrome extension that calculates someone's current age from a birth date.

## Features

- **Natural language input** — type dates in any format: "Mar 28 1986", "3/28/86", "1986-03-28", "28 March 1986", etc.
- **Auto-fill from selection** — select a date on any page, click the extension, and it auto-fills
- **Copy shortcuts** — click the copy button or use keyboard shortcuts to copy the age
  - `Cmd+C` / `Ctrl+C` — copy as number
  - `Shift+Cmd+C` / `Shift+Ctrl+C` — copy as word (ages 0-9)
## Development

```
npm install
npm run build
```

This bundles `src.js` into `popup.js` using esbuild.

To test locally:
1. Run `npm run build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select this directory

## Publishing

1. Bump `version` in `manifest.json`
2. Run `npm run build`
3. ZIP the extension files (exclude `node_modules/`, `src.js`, `package.json`, `package-lock.json`)
4. Upload to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole)

## Privacy

Age Today does not collect, store, or transmit any data. See [privacy-policy.md](privacy-policy.md).

---

Made for [AFC](https://advocatesforchildren.org/donate/) <3
