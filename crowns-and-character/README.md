# Crowns & Character: Choosing Good Leaders

**By Intelligent Games 4U Limited.** In this Bible-based game, children and young people learn how to choose good leaders, and how to become one. Their guide is Jotham, who told the parable of the trees (Judges 9). The game follows the line of kings from Matthew 1:9-10: Uzziah, Jotham, Ahaz, Hezekiah, Manasseh, Amon and Josiah. Every level is set in everyday Nigerian life and ends with a faith lesson, a personal benefit and a leadership and career benefit.

It is non-partisan: no party or politician is named.

## Levels

| Realm | Level | Passage | Skill |
| --- | --- | --- | --- |
| How to Choose | Jethro's Advice | Exodus 18 | Delegation & leader qualities |
| How to Choose | The Trees Choose a King | Judges 9 | Spotting power-seekers |
| How to Choose | The Heart, Not the Height | 1 Samuel 16 | Character over looks |
| The Jotham Line | Uzziah: Strong Until Proud | 2 Chronicles 26 | Humility & correction |
| The Jotham Line | Jotham: Prepared His Ways | 2 Chronicles 27 | Consistency & honest records |
| The Jotham Line | Ahaz: Fear Makes Bad Choices | Isaiah 7; 2 Kings 16 | Decisions under pressure |
| The Jotham Line | Hezekiah: Open the Doors | 2 Kings 18-20 | Reform & long-term planning |
| The Jotham Line | Manasseh: Can a Leader Change? | 2 Chronicles 33 | Repentance & trust |
| The Jotham Line | Josiah: Young and Faithful | 2 Kings 22-23 | Acting on the truth |
| Servant Leaders | Choose Seven of Honest Report | Acts 6; Mark 10 | Voting wisely |

## Files

The engine is shared with Angel Academy Naija.

| File | Purpose |
| --- | --- |
| `levels.json` | All levels, the Jotham line and leadership role cards |
| `js/config.js` | Paystack donation link, funds, GoatCounter account, event dates |
| `js/minigames.js` | Mini-games: `order`, `sort`, `choice`, `numeric`, `chart` (and others) |
| `js/app.js` | Screens, progress (on the device), read-aloud, parent gate, dashboard, CSV export |
| `js/player-count.js` | Anonymous player count (once per device) |
| `sw.js` | Offline cache. Bump `CACHE_NAME` when files change |

Run it with `py -m http.server` and open the page. Double-clicking `index.html` will not load the levels.

## Before launch

- [ ] Check every Bible reference and quote (KJV).
- [ ] Check the INEC voter facts (age 18, PVC) against INEC's website.
- [ ] Paste the Paystack donation link into `js/config.js`.
