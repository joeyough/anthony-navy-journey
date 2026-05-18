# Setup — Step by Step

Five minutes from "I downloaded this" to "it's live on the internet."

## 1. Get the code

If you're reading this on GitHub:
- Click the green **Code** button
- Click **Download ZIP**
- Save it to your Desktop
- Unzip the folder

## 2. Install Node.js (only need to do once, ever)

Go to [nodejs.org](https://nodejs.org) and download the **LTS** version. Run the installer with defaults. Done.

## 3. Open Terminal

- **Mac:** Press `Cmd + Space`, type "Terminal", hit Enter
- **Windows:** Press the Windows key, type "Command Prompt", hit Enter

## 4. Navigate to the folder

Type `cd ` (with a space after) and then **drag the unzipped folder onto the Terminal window**. The path appears automatically. Hit Enter.

You should see something like:
```
yourname@computer anthony-navy-journey %
```

## 5. Install and build

Type these one at a time, hitting Enter after each:

```
npm install
```
(takes about 30 seconds — lots of text scrolls by, that's normal)

```
npm run build
```
(takes about 10 seconds)

You now have a `dist/` folder with the finished website inside it.

## 6. Put it on the internet

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser
2. Drag the `dist/` folder from your computer onto the Netlify page
3. Done. Netlify shows a URL like `https://random-name-12345.netlify.app`

Click it. Share it. That's the link family bookmarks on their phones.

## 7. (Optional) Get a nicer URL

In Netlify, you can change `random-name-12345` to `anthonys-navy-journey` for free. Site settings → Change site name.

For a real custom domain like `anthonyscrimi.com`, that's about $12/year through Netlify's domain registrar.

---

## When you want to update something

1. Open `src/App.jsx` in any text editor (Notepad works, but [VS Code](https://code.visualstudio.com/) is way nicer and free)
2. Make your edits, save the file
3. Run `npm run build` in Terminal
4. Drag the new `dist/` folder back onto Netlify (or click "Deploys" → "Drag and drop" on your existing site)

That's it. Same URL, updated content.

---

## If something breaks

99% of issues are solved by:
```
rm -rf node_modules
npm install
npm run build
```
(On Windows, instead of `rm -rf`, just delete the `node_modules` folder in File Explorer.)

If it still won't work — the source file `src/App.jsx` is the whole thing. You can always copy that one file into a fresh Claude conversation and ask it to deploy somewhere else.
