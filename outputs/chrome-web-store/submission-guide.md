# Chrome Web Store submission

## Package

Upload semifull-0.1.0.zip as the extension package. It contains only manifest.json, content.js, content.css and the four icons referenced by the manifest. Do not upload the entire repository or the images folder as the extension ZIP.

## Store listing

Name: Semifull

Summary: Expand YouTube within your browser tab. Keep tabs and taskbar visible. Press G to toggle or Esc to exit.

Description:

Semifull gives YouTube a simple windowed fullscreen mode. The video fills your browser's page area while your tabs, address bar and taskbar remain accessible.

Click the window icon immediately to the left of YouTube's fullscreen button, or press G to enter and exit. Press Esc to return to the normal page.

Features:
- One additional player button, with no extra menus.
- G to toggle; Esc to exit.
- YouTube's playback controls, captions and settings stay available.
- Video proportions are preserved.
- The original page scroll position is restored when you exit.

Works on desktop YouTube watch pages and live streams. Shorts and embedded players are not supported. G is ignored while typing in text fields. To keep the taskbar always visible, disable your operating system's taskbar auto-hide setting.

No account, analytics or data collection. Semifull is an independent extension and is not affiliated with YouTube or Google.

Language: English
Category: Choose the available category that best describes a video/player utility.
Support URL: Use your repository's GitHub Issues page once it is public and Issues are enabled.
Privacy policy URL: Publish PRIVACY.md on a publicly accessible page, then enter that working URL. The local file path cannot be used.

## Upload images separately

- extension-icon-128.png: listing icon.
- promo-small-440x280.png: required promotional image.
- promo-marquee-1400x560.png: optional marquee image.
- screenshot-live-youtube-1280x800.png: actual YouTube page with Semifull's content script and styles loaded by the test harness. This capture excludes browser chrome and the taskbar; it shows the expanded player and Semifull control.

The browser drawing in the promo is an illustration. Do not use it as the only proof of the actual extension experience. You may replace the supplied screenshot with a fresh screenshot from your own installed Chrome extension, resized to 1280x800 without distorting it.

## Privacy fields

Single purpose:
Expand YouTube's video player to fill the browser tab while preserving access to browser tabs and the desktop taskbar.

Site access justification:
Access to https://www.youtube.com/* is needed to locate the player, add the Semifull button and tooltip, handle G/Esc shortcuts, and apply or remove the page layout styles. It runs on all paths of this one host because YouTube navigates between pages without reloading the tab. It does not transmit page data.

Remote code: No.
Data collection: No user data is collected. Complete the dashboard's data-use declarations consistently with the privacy policy.

## Reviewer instructions

No account or credentials required.
1. Open any public YouTube watch page in Chrome.
2. Locate the Semifull icon immediately to the left of fullscreen.
3. Click it or press G. The player should fill the page area, without native fullscreen.
4. Press G again or Esc to exit.
5. Confirm normal playback, captions/settings and video navigation continue to work.

## Before submitting

- Register your developer account, pay the registration fee, and complete any account verification requested by the dashboard.
- Verify the developer contact details and your public support/privacy URLs.
- Smoke-test the exact ZIP in desktop Chrome, including playback, captions, live streams, navigation and G/Esc.
- Upload the ZIP, fill out Store listing, Privacy and Distribution, and submit for review.

The local automated checks passed in Edge. A live YouTube layout check passed with the content files injected by the browser harness; an installed-extension review in Chrome, account setup and store review are separate steps. Google decides approval and review timing.

Official guidance:
https://developer.chrome.com/docs/webstore/publish
https://developer.chrome.com/docs/webstore/images
https://developer.chrome.com/docs/webstore/register
