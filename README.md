```markdown
# ProSide-AI - Chrome Extension (full scaffold)

Files in this package:
- manifest.json
- inject.js
- background.js
- sidebar.html
- sidebar.css
- sidebar.js
- code.html (Options page / Admin UI)
- README.md
- icons/icon16.png, icons/icon48.png, icons/icon128.png (please add)

Quick start (local):
1. Download/clone this folder to your computer.
2. Make sure icons/ contains icon16.png, icon48.png, icon128.png.
3. Open Chrome → chrome://extensions/ → enable "Developer mode".
4. Click "Load unpacked" and select the folder containing these files.
5. Open any page and you should see the sidebar injected on the right.
6. Click the settings button in the sidebar (⚙️) to open the full management UI (code.html).

Notes:
- The Options page is `code.html` (the UI you provided). It is connected in manifest.json as the options page.
- sendToAI in sidebar.js uses OpenAI when the tool selected is `openai`. You must add your OpenAI API key in storage via the options UI (not fully wired in the admin UI).
- OCR uses Tesseract.js via CDN. PDF text extraction uses pdf.js via CDN.
- For production usage, do not store secret keys in client-side extension files. Use a secure server/proxy to hide API keys.
```
