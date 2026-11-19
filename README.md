# Intelligent Games for You

The website of **Intelligent Games 4U Limited**, with three free Bible-based games:

| Folder | Game | Teaches |
| --- | --- | --- |
| `ark-builder/` | Noah's Ark Builder | Geometry, measurement and patterns (Levels 1-2 free, Level 3 paid unlock) |
| `angel-academy-naija/` | Angel Academy Naija: STEM Quest | The STEM skills Nigeria needs, from every angel appearance in the Bible |
| `crowns-and-character/` | Crowns & Character: Choosing Good Leaders | Choosing good leaders, from Jethro, Jotham's parable and the line of Jotham (Matthew 1:9-10) |

Published with GitHub Pages from `IntelligentGames123/IntelligentGamesforYou` at
**https://intelligentgames123.github.io/IntelligentGamesforYou/**. There is no build step.

This is Intelligent Games 4U's own site: payments, donations, hosting, counts and branding are the company's own, separate from GiggleByte.

## Run it locally

```
py -m http.server 8780
```

Then open http://localhost:8780. Local visits are never counted.

## Settings

| File | What to set |
| --- | --- |
| `js/config.js` | Paystack `donateLink`, Ark Builder `unlockLink` and price, GoatCounter account |
| `angel-academy-naija/js/config.js` | The same Paystack `donateLink` and GoatCounter account |
| `crowns-and-character/js/config.js` | The same Paystack `donateLink` and GoatCounter account |

`angel-academy-naija/` is a copy of the game's own repository. Make changes there first, then copy the files here.

## Counts

Visits to the home page and each game's player count go to the company's GoatCounter account, `intelligentgames4u`. Create it at goatcounter.com with the company email, as a new account rather than a site under another account. Then tick **Allow adding visitor counts on your website** in its settings.

## Before launch

- [ ] Create the GoatCounter account `intelligentgames4u` and allow visitor counts.
- [ ] Create the Paystack donation page and Ark unlock page, then paste the links into all three config files.
- [ ] Set the Ark unlock page's redirect to `.../IntelligentGamesforYou/ark-builder/unlocked.html`.
- [ ] Check the Bible references, 3MTT names and INEC voter facts.
- [ ] Turn on GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.
