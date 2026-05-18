# Anthony's Navy Journey

A family guide to **Anthony Joseph Crimi's** Navy journey — built to share with mom, dad, grandparents, aunts, uncles, and anyone else who loves him.

⚓ Shipped: **May 5, 2026** · Graduates: **July 9, 2026**
🏠 Ship 3, USS Hopper · Division 931 · Aviation Ordnanceman · E-2

---

## What this is

A single-page mobile-first React app with **11 sections**:

1. **Decode** — the four pieces of his address
2. **Division 931** — the performing division he was hand-picked for
3. **USS Hopper** — Admiral Grace Hopper's amazing story
4. **Aviation Ordnanceman** — the centennial year of the AO rating
5. **The Promotion** — E-2 confirmed
6. **Timeline** — the live 66-day countdown
7. **Pass-in-Review** — the ceremony walkthrough
8. **Sailor Lore** — fun Navy terminology
9. **Good Company** — famous Sailors who came before
10. **What's Next** — Pensacola and the Blue Angels
11. **For the Family** — the silver dollar tradition + saints + closing

The countdown is **live**: it updates every time anyone opens the page. After graduation day, it switches to "A Sailor for N days."

---

## How to deploy (the easy way — 5 minutes)

You don't need to know how to code. There are two paths:

### Option A: Netlify drag-and-drop (zero command line needed)

1. Download this whole folder as a ZIP from GitHub (green "Code" button → "Download ZIP")
2. Unzip it on your computer
3. Open Terminal (Mac) or Command Prompt (Windows)
4. Run these three commands one at a time:
   ```bash
   cd path/to/anthony-navy-journey
   npm install
   npm run build
   ```
5. A new `dist/` folder appears. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the `dist/` folder onto the page.
6. Done. Netlify gives you a URL like `https://something-something.netlify.app` — share that with family.

### Option B: Netlify + GitHub (auto-deploys every time you edit)

1. Create a free Netlify account
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub
4. Pick the `anthony-navy-journey` repo
5. Netlify reads `netlify.toml` and figures out the rest. Click Deploy.
6. Every time you push a change to GitHub, the live site auto-updates.

---

## How to edit (when Anthony gets news, promotions, etc.)

Open `src/App.jsx`. The whole app is in this one file by design — every section is its own labeled component near the top of the file. Find the section you want to update with **Ctrl+F** (or **⌘+F** on Mac).

### Common edits

**Updating his rank (E-2 → E-3 at graduation)**

Search for `"E-2 CONFIRMED"`. Update the giant `E-2` to `E-3` and the body copy to match. Same in the Hero badge: search for `AIRMAN APPRENTICE · E-2` and change to `AIRMAN · E-3`.

**Updating his graduation date (if it shifts)**

At the top of the file, find:
```js
const SHIP_DATE = new Date("2026-05-05T00:00:00");
const GRAD_DATE = new Date("2026-07-09T00:00:00");
const TOTAL_DAYS = 66;
```
Change those three values. The countdown recalculates automatically.

**Adding a new section** (for example, when he gets his fleet assignment)

1. Find an existing section like `function PensacolaDeep()` and copy the whole function.
2. Rename it (e.g., `function FleetAssignmentDeep`).
3. Edit the content inside.
4. At the bottom of the file, find the `App` function and add `<FleetAssignmentDeep />` in the list.
5. Update the section number label (e.g., `"12 / FLEET"`).

**Changing colors / fonts / styling**

The `C` object near the top (line ~10) has every color used. The `F` object has the three fonts. Change once, change everywhere.

---

## Future expansion ideas

As Anthony's career unfolds, add new sections:

- **A-school in Pensacola** — when he starts in July, add a section on the Blue Angels practice schedule, beach photos, A-school progress
- **First duty assignment** — when he gets his orders (which carrier, which squadron)
- **Carrier qualifications** — first cat shot, first trap (these are huge AO milestones)
- **Promotion to E-3, E-4, etc.** — flip the rank everywhere
- **Family photo gallery** — could add an image-grid section
- **Letters from Anthony** — could add a section that showcases his updates

The architecture is designed for this. Each section is a self-contained React function — copy, rename, edit content, add to App.

---

## Tech stack

- React 18
- Vite (build tool)
- No Tailwind, no router, no UI library — pure React with inline styles
- All fonts loaded from Google Fonts (Bebas Neue, EB Garamond, JetBrains Mono)
- Mobile-first, works on every modern browser, no app install needed

---

## Repo structure

```
anthony-navy-journey/
├── index.html              # Vite entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Build config
├── netlify.toml            # Netlify deployment config
├── .gitignore              # Files Git should ignore
├── README.md               # This file
└── src/
    ├── main.jsx            # React entry point (don't edit)
    └── App.jsx             # THE APP — edit this for content changes
```

---

## License & spirit

This is for the Crimi family. Built with love, accuracy, and respect for the Navy and for Anthony.

**Aude et Effice — Dare and Do.**
⚓ IYAOYAS · Anchors Aweigh

---

*Built with Claude. Last updated: May 2026.*
