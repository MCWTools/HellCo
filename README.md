# Hell Corp

You died (of fear, by a non-venomous snake). Now you work in Hell's soul-processing office.
Read each soul's file, compare Good vs Evil, stamp where they go. Landscape only, PC + mobile, EN / VI.

## Run locally
Any static server, e.g. `python3 -m http.server 8000` then open http://localhost:8000
(Opening index.html directly also works.)

## Deploy to Vercel
- Drag this folder into https://vercel.com/new  (Framework: Other, no build command, output dir `./`)
- or: `npx vercel --prod` inside this folder.

## Where things are
- `js/config.js`        game name + save key (rename the game here)
- `js/lang/en.js, vi.js` all UI + dialogue text
- `js/data/*`           names, jobs, death grammar, merits/sins, special souls, lore, ranks
- `js/gen/*`            procedural generators (look, identity, death, alignment, soul)
- `js/render/*`         Three.js stage, ugly character builder, office
- `js/game/*`           rules, shop, achievements
- `js/scenes/*`         title, cutscene, office, ending
- `js/ui/*`             dialogue, HUD, dossier, panels, transitions
Progress is saved in localStorage (key in config.js).
