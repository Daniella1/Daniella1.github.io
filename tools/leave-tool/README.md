# Leave balance calculator (static page)

Works out how much annual and sick leave you will have on any date, from a payslip.
It is plain HTML, CSS and JavaScript with no server, so it runs on GitHub Pages.

## Put it on your site

1. Copy this whole `leave-tool` folder into your site's repository, for example next to your other pages.
2. Commit and push. It will be at `https://<your-site>/leave-tool/`.
3. Link to it from your site. Keep the folder structure: the page loads files from `vendor/` next to it.

Size is about 17 MB, mostly the text recognition engine (`vendor/core`) and its English data (`vendor/lang`).
These are only downloaded when a visitor adds a screenshot or scanned PDF.

## On a Jekyll site (including GitHub Pages)

Jekyll copies any file that has no front matter (no `---` block at the top) to the built site unchanged.
`index.html` here has none, so the folder works as a standalone page.

1. Put the `leave-tool` folder in the root of your repository, next to `_config.yml`.
2. Link to it: `<a href="{{ '/leave-tool/' | relative_url }}">Leave balance calculator</a>`
3. Do not add front matter to `index.html` and do not wrap it in a layout. A layout would pull in your site's
   scripts and fonts, which breaks the privacy promise on the page and conflicts with its Content Security Policy.
4. Optional: add `exclude: [leave-tool/README.md]` to `_config.yml` so this file is not published.
5. To try it locally with your whole site: `bundle exec jekyll serve`, then open `http://localhost:4000/leave-tool/`.
6. After deploying, view the page source once and check it is this page and nothing else.

To show it inside one of your own pages, link to it or use an iframe (`<iframe src="/leave-tool/" ...>`).
A link is simpler. An iframe on the same site shares your site's storage and scripts.

## Trying it on your computer first

Do not double-click `index.html`. Browsers block the PDF and screenshot readers on pages opened as files
(the page shows a note when this happens). Instead, run a tiny local web server in this folder:

    python -m http.server 8000

then open http://localhost:8000/ in your browser. Press Ctrl+C in the terminal to stop it.

## Privacy

- Nothing is uploaded. Files are read in the visitor's browser and discarded. Only the leave figures
  and settings are saved, in that browser's local storage.
- Every library is hosted here under `vendor/`, so the page loads nothing from other sites.
- `index.html` has a Content Security Policy that only allows files from the same site, so the page cannot
  send data to a third party even by mistake. If you edit the page, keep that tag.
- Do not add analytics or other third-party scripts to this page. They would see what visitors type.
- Visitors are told on the page to crop screenshots to the leave lines and keep personal details out.

## Files

| File | What it is |
| --- | --- |
| `index.html`, `style.css`, `app.js` | The page |
| `engine.js` | Calculation, payslip field detection, local storage |
| `reader.js` | Reads PDFs (pdf.js) and screenshots (Tesseract.js) |
| `holidays-data.js` | Statewide Australian public holidays, 2024 to 2032 |
| `vendor/` | pdf.js, Tesseract.js, its WebAssembly core and English data |
| `licenses/` | Licences for the bundled libraries (all Apache-2.0) |

## Keeping it up to date

- Public holidays: `holidays-data.js` is generated from the Python `holidays` package (MIT). The data
  stops at 2032, and the page says so. Regenerate it yearly to pick up newly announced dates.
- Known limits: text recognition can misread digits, so visitors must check each number. Only two payslip layouts
  have been tested. Local (non-statewide) holidays are not included.


## Using it on a phone

Phones have no Ctrl+V, so step 2 has a "Paste image from clipboard" button. Take a screenshot, tap Copy on it, then tap the button. The page must be served over https (GitHub Pages is). If the browser blocks clipboard access, choose the screenshot from your photos instead (the most reliable route), or press and hold in the paste box and tap Paste.


## Putting it inside your site's layout

`leave-calculator.md` (next to the `leave-tool` folder in this zip) is a normal Jekyll page. It uses your `page` layout, so your header, nav and footer wrap the tool, and it shows the calculator in a frame that grows to fit.

1. Copy the `leave-tool` folder and `leave-calculator.md` into the root of your site repository.
2. Add a link in your nav, for example `/leave-calculator/`.
3. If your site has no `page` layout, change `layout: page` to the layout you use for ordinary pages.
4. Commit and push. The tool also still works on its own at `/leave-tool/index.html`.

The tool's colours and fonts are set in `leave-tool/style.css`, in the block marked "Site theme". Change the values there if you restyle your site.
