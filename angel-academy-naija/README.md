# Angel Academy Naija: STEM Quest

**By Intelligent Games 4U Limited.** In this Bible-based learning game, angels from Scripture bring missions set in everyday Nigerian life. Each mission teaches a STEM skill Nigeria needs: the 3MTT tech tracks plus solar power, agritech, public-health data and civil engineering. Every level ends with a faith lesson, a personal benefit and a career benefit in Nigeria.

The game is a mobile-first, offline PWA, kept light on data for low-cost Android phones. It has no external fonts, libraries or video.

## Run it

There's no build step, but the game must be served over HTTP. For example:

```
py -m http.server 8777
```

Then open http://localhost:8777. Double-clicking `index.html` will not load the levels.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell |
| `levels.json` | 12 playable launch levels, 15 stubs, Nigerian career paths, realms |
| `js/config.js` | **Company settings**: Paystack donation link, funds, sponsor, transparency figures, Nigerian event dates |
| `js/minigames.js` | Mini-game engine: `order`, `sort`, `grid`, `chart`, `choice`, `numeric`, `binary`, `cipher`, `robot` |
| `js/app.js` | Screens, progress (on the device), read-aloud, parent gate, dashboard, CSV export |
| `js/player-count.js` | Anonymous player count shown on the Intelligent Games 4U website (once per device, via the company's own GoatCounter account set in `js/config.js`) |
| `sw.js` | Offline cache. Bump `CACHE_NAME` when files change |
| `privacy.html`, `guides/` | Privacy page (NDPA 2023), parent guide, teacher guide |
| `docs/` | The game build prompt (Word .doc, .txt, .html): every angel appearance in the Bible, the Nigeria STEM skill map, and charity-game lessons |

## Adding a level

Replace a stub in `levels.json`, using any launch level as a template. Give it a Nigerian hero and setting, one skill, three challenges, five quiz questions and three benefit cards. Then remove `"stub": true`.

## Before launch: checklist

- [ ] Create the Paystack donation page (amount left blank; international cards on) and paste its link into `donateLink` in `js/config.js`. Use the same Paystack account as the company website, so donations settle to Intelligent Games 4U Limited's own bank.
- [ ] Find a Play = Give sponsor, then set `community.sponsored` and `sponsorName`.
- [ ] Check all Bible references and quotes (KJV).
- [ ] Check the 3MTT track names, the NCDC/NBS references and the safety advice.
- [ ] Choose which GitHub account will host this repo. **Not GiggleByte-Hub**: this game belongs to Intelligent Games 4U.
- [x] Add a card for this game on the Intelligent Games 4U website (done, with a player counter).
- [ ] Create the free GoatCounter account `intelligentgames4u` (sign up with the company email, not as a site under GiggleByte's account) and tick "Allow adding visitor counts on your website".
