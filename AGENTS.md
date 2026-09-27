# AGENTS.md

Static marketing site for Committa (Hugo, no Node/npm). Multilingual IT/EN.

## Commands

- Build: `hugo --gc --minify` (outputs `public/`)
- Dev server: `hugo server` (add `-D` to include drafts)
- Hugo is **not installed locally**; CI pins `hugo` **extended 0.159.2** (`.github/workflows/deploy.yml`). Match that version when building/verifying.
- No linter/test suite/package.json. Verification = a successful `hugo` build.

## Deploy

Push to `main` → GitHub Actions builds and publishes `public/` to the `gh-pages` branch via `peaceiris/actions-gh-pages` (custom domain `committa.it`). Never commit `public/`, `resources/`, or `.hugo_build.lock` (gitignored).

## i18n: IT is default at root, EN at `/en/`

`defaultContentLanguageInSubdir = false`, so Italian pages live at `/servizi/`, English at `/en/servizi/`.

Three parallel sources that must be kept in sync for **every** page:
1. `content/<page>.md` (IT) + `content/<page>.en.md` (EN) — front matter metadata only; linked by `translationKey`.
2. `i18n/it.toml` + `i18n/en.toml` — UI copy. Both files must define the same `[keys]`.
3. `data/it/...` + `data/en/...` — structured arrays (servizi, team, lira, clienti). Trees are filename-identical; layouts read them via `{{ index hugo.Data .Site.Language.Lang }}`, so a missing EN file silently yields empty output.

To add a page: create both content files with matching `translationKey`, a matching menu entry under `[languages.<lang>.menu.main]` in `hugo.toml`, and its i18n keys in both TOMLs.

## Workflow

- Dopo aver implementato o modificato UI web, verifica con il subagent `dev-browser` prima di dichiarare il lavoro concluso.

## Gotchas

- **Icons:** `layouts/partials/card.html` has a hardcoded Lucide SVG dict. An unknown `icon:` name silently falls back to `code-2`. Register new icons there.
- **Language redirect:** `layouts/partials/head.html` has an inline script that redirects non-IT browsers to `/en/` using `localStorage.lang`; the toggle lives in `layouts/partials/header.html`. Change both together.
- **Contact form:** posts to Web3Forms; key in `hugo.toml` → `[languages.*.params].web3forms_access_key`. Submit/status strings in `assets/js/contact.js` are hardcoded Italian, so the EN form still shows Italian status text.
- **Assets:** `assets/css|js` are minified + fingerprinted through Hugo pipes (`head.html`, `scripts.html`). `static/` is copied verbatim; images are referenced as `images/...`.
- **Legacy files:** root `index.html`, `style.css`, and `undraw_*.svg` are pre-Hugo GitHub Pages leftovers, not part of the Hugo build. Editing them has no effect on the site.
- `AGENTS.md` is versioned in the repo (project-level agent instructions).
