# Piano di riprogettazione — committa.it

Sito statico Hugo pubblicato su GitHub Pages (custom domain `committa.it`).
Obiettivo: passare dal prototipo attuale (tema placeholder `hugo-universal-theme`) a un **tema custom leggero**, multi-pagina, stile **Trust & Authority**, che presenti l'attività principale (Industria 4.0 / WMS / MES / HMI / integrazione sistemi / consulenza / formazione / assistenza) e l'attività secondaria **LIRA** come prodotto a sé.

I loghi esistenti (`MainLogo`, `InvertedLogo`, `Symbol` — sia PNG che SVG in `static/images/`) sono mantenuti. La cartella `static/` non viene toccata: gli asset esistenti restano serviti a `/images/...`.

---

## 0. Decisioni preliminari

| Voce | Decisione |
|---|---|
| Tema | Custom leggero: rimuovo submodule `themes/hugo-universal-theme` e creo `layouts/` proprietari (`baseof.html` + partials). Nessuna dipendenza da terzi. |
| Architettura pagine | Multi-pagina: `/`, `/servizi/`, `/chi-sono/`, `/lira/`, `/contatti/`. |
| Stile | **Trust & Authority** (palette navy + accent blu) — vedi § 1. |
| Contributi esterni | Nessun framework JS. CSS nativo + CSS variables, ~5–8 KB minified. Font Google via `@import` o `<link>`. |
| Build | `hugo --gc --minify` → `public/` (gitignored). Nessuna CI nel repo. |
| Compatibilità | Browser moderni (ultimi 2 major). `prefers-reduced-motion` e `prefers-color-scheme: dark` onorati. |
| Italiano | Tutto il copy è italiano (`defaultContentLanguage = "it"`). |

---

## 1. Design System

Tokens derivati dalla raccomandazione `ui-ux-pro-max` (dominio: consulenza B2B / Industria 4.0), adattati al brand Committa.

### 1.1 Palette

| Ruolo | Token | Valore chiaro | Valore scuro |
|---|---|---|---|
| Primary (navy) | `--color-primary` | `#0F172A` | `#E2E8F0` |
| On Primary | `--color-on-primary` | `#FFFFFF` | `#0F172A` |
| Secondary | `--color-secondary` | `#334155` | `#94A3B8` |
| Accent / CTA | `--color-accent` | `#0369A1` | `#38BDF8` |
| Background | `--color-bg` | `#F8FAFC` | `#0B1220` |
| Surface | `--color-surface` | `#FFFFFF` | `#111827` |
| Foreground | `--color-fg` | `#020617` | `#E2E8F0` |
| Muted | `--color-muted` | `#E8ECF1` | `#1E293B` |
| Border | `--color-border` | `#E2E8F0` | `#334155` |
| Destructive | `--color-destructive` | `#DC2626` | `#F87171` |
| Ring (focus) | `--color-ring` | `#0369A1` | `#38BDF8` |

Accessibilità: ogni accoppiamento testo/sfondo ≥ 4.5:1 (WCAG AA, navy su bianco = 16.4:1; accent blu su bianco = 5.4:1).

### 1.2 Tipografia

- **Heading:** Poppins (500/600/700) — moderno, professionale, adatto a B2B.
- **Body:** Open Sans (400/500/600) — leggibile, friendly.
- Scala modulare (ratio 1.250):
  - `--fs-300`: 0.8rem (caption)
  - `--fs-400`: 1rem (body)
  - `--fs-500`: 1.25rem (lead)
  - `--fs-600`: 1.5rem (h4)
  - `--fs-700`: 1.875rem (h3)
  - `--fs-800`: 2.25rem (h2)
  - `--fs-900`: 3rem (h1)
- Line-height body 1.6, heading 1.15.
- Font loading via `<link rel="preconnect">` + `<link rel="stylesheet">` (single roundtrip).

### 1.3 Spaziature e layout

- Scala spaziatura: `--space-1: 0.5rem` … `--space-12: 3rem` (sistema a 4px grid).
- Container max-width `1200px`, gutter `clamp(1rem, 4vw, 2rem)`.
- Breakpoint: `640 / 768 / 1024 / 1280px` (mobile-first).
- Radius: `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 16px`.
- Ombre: `--shadow-1` (cards leggero), `--shadow-2` (hero overlay).

### 1.4 Icone

SVG inline da **Lucide** (set open source, stroke 1.5). Nessun emoji come icona. Esempi per i servizi: `code-2`, `database`, `server`, `life-buoy`, `cpu`, `plug`, `graduation-cap`.

### 1.5 Motion

- Durate: hover 150ms, reveal 250ms, hero 300ms.
- Solo `transform`/`opacity`/`filter` (GPU-composited).
- `@media (prefers-reduced-motion: reduce)` disabilita tutte le transizioni decorative.
- Reveal su scroll con `IntersectionObserver` (nativo, ~1KB).

### 1.6 Dark mode

- Default: tema chiaro.
- Toggle in topbar (icona sole/luna Lucide).
- Persistenza in `localStorage`, defaults a `prefers-color-scheme`.
- Tutti i loghi hanno versione invert (`InvertedLogo.png/svg`) già pronta per il footer/hero scuri.

---

## 2. Architettura informativa

### 2.1 Sitemap

```
/                    homepage
  ├─ #servizi        anchor nella home (link in nav)
  ├─ #chi-sono       anchor nella home
  └─ /lira/          pagina dedicata prodotto secondario
/servizi/            pagina servizi (approfondimento)
/chi-sono/           pagina bio (approfondimento)
/lira/               pagina LIRA
/contatti/           pagina contatti (form + recapiti)
404.html             pagina di errore
sitemap.xml          (autogenerata da Hugo)
robots.txt           (statico)
```

Razionale: multi-pagina migliora SEO (titoli H1 dedicati, meta description per pagina, URL condivisibili per LIRA e servizi) e dà a LIRA lo spazio narrativo che serve. La home resta una "vetrina" ancorata che reindirizza alle pagine di dettaglio.

### 2.2 Topbar / navigazione

- Sinistra: logo `MainLogo.svg` (versione chiara) o `InvertedLogo.svg` (header in dark mode / hero scuro).
- Centro/destra: **Home · Servizi · Chi sono · LIRA · Contatti**
- Topbar sottile con contatto mail a destra (come ora).
- Sticky header con transizione bg `transparent → surface` allo scroll (cambiando logo chiaro → scuro se hero scuro).
- Mobile: hamburger → drawer verticale, animazione 250ms, chiusura al tap sul backdrop.
- CTA primaria sempre visibile in header: **"Contattaci"** → `/contatti/`.

### 2.3 Footer

- 3 colonne: brand + tagline | navigazione | contatti (email, P.IVA se presente, area geografica).
- Logo secondario `Symbol.svg` come watermark discreto.
- Riga di chiusura: copyright + link a privacy (se prevista, vedi § 7).

---

## 3. Layout di pagina per pagina (con copy italiano)

Convenzioni di copy:
- H1 unico per pagina.
- H2 per le sezioni; ogni CTA è un verbo alla 2ª persona ("Contattaci", "Scopri LIRA", "Parla con noi").
- Boldmidtione dei nomi clienti come elenco compatto (vantaggio competitivo → esporlo).

---

### 3.1 Homepage (`/`)

**H1 (hero):** Soluzioni software su misura per l'industria 4.0.

**Sub (hero lead):** Sviluppo, integrazione e assistenza di sistemi per automazione industriale, WMS, MES e HMI. Quindici anni di lavoro sul campo per alcune delle più grandi multinazionali del food & beverage e beyond.

**CTA primaria:** Contattaci → `/contatti/`
**CTA secondaria:** Scopri i servizi → `/servizi/`

**Sezione "Servizi" (`#servizi`)** — 4 card + 1 CTA a LIRA.

| Card | Titolo | Descrizione (≤ 25 parole) | Icona |
|---|---|---|---|
| 1 | Sviluppo software personalizzato | Software su misura dall'analisi dei requisiti al supporto post-implementazione, con tecnologie e metodologie aggiornate. | `code-2` |
| 2 | Progettazione e gestione database | Progettazione, implementazione e manutenzione di database stabili, sicuri e performanti — sempre aggiornati. | `database` |
| 3 | Infrastrutture server | Progettazione, installazione e configurazione di infrastrutture server scalabili, dimensionate per prestazioni e sicurezza. | `server` |
| 4 | Assistenza tecnica | Supporto dedicato, troubleshooting di emergenza e consulenza su best practice per garantire continuità operativa. | `life-buoy` |

Card opzionale a sé ("Prodotto"): **LIRA** → "La tua AI sul tuo patrimonio documentali. On-premise, verificabile, senza allucinazioni." CTA: Scopri LIRA → `/lira/`.

**Sezione "Chi sono in breve" (`#chi-sono`)** — due colonne: a sinistra testo breve, a destra lista clienti.

> Marco Baccarani, sviluppatore software con oltre 15 anni di esperienza nell'Industria 4.0, nella gestione della supply chain e nella logistica. Un percorso internazionale, clienti multinazionali, soluzioni complesse consegnate end-to-end.

CTA: Conosci Marco → `/chi-sono/`

**Sezione "Clienti per cui ho lavorato"** — banda loghi / elenco testuale: Nestlé · Coca-Cola · Danone · Barilla · Keurig Dr Pepper · Tetra Pak · Sofidel · Constellation Brands · Philip Morris International.

**Sezione contatti (preview)** — 2 righe + CTA "Parla con noi" → `/contatti/`.

---

### 3.2 Pagina Servizi (`/servizi/`)

**H1:** Servizi
**Lead:** Quattro aree di competenza, una sola riferente: il tuo progetto.

La pagina riprende e **espande** i 4 servizi della homepage. Per ciascuno:

- H2 + icona + descrizione lunga (paragrafo riadattato dal brief).
- Eventuali bullet annidati per aree di dettaglio (vedi attività principale, § 4).

**Sezione aggiuntiva: "Cosa posso fare concretamente"** — mappatura dell'attività principale (vedi § 4):
- Sviluppo per WMS / MES / HMI
- Integrazione ERP ↔ WMS ↔ MES ↔ HMI, PLC, robot, sensori IoT
- Automazione flussi dati
- Assistenza, manutenzione, aggiornamenti
- Consulenza, analisi processi, formazione del personale

Questa è la sezione "verticale" della pagina, con divisori per macroarea.

**CTA finale:** Parla con noi del tuo progetto → `/contatti/`

---

### 3.3 Pagina Chi sono (`/chi-sono/`)

**H1:** Marco Baccarani
**Lead:** Sviluppatore software — Industria 4.0, supply chain e logistica.

Corpo: la bio completa in terza persona fornita nel brief, suddivisa in paragrafi brevi (max 4 righe ciascuno) con un H2 a metà:
- "Un percorso internazionale"
- "Clienti che si fidano di me" (segue elenco multinazionali come card o lista)
- "Il mio impegno" (ultimo paragrafo — qualità, innovazione, collaborazione)

Format: editoriale, foto placeholder in alto a destra (da sostituire con ritratto personal fornito dall'utente).

**CTA finale:** Lavoriamo insieme → `/contatti/`

---

### 3.4 Pagina LIRA (`/lira/`)

Prodotto a sé — pagina lunga, con ritmo narrativo distinto dalla home aziendale.

**H1 (hero):** LIRA — la tua AI sul tuo patrimonio documentali.
**Sub:** Libreria di Informazioni e Risorse Aziendali. Non un'altra chatbot: una risposta precisa costruita sui tuoi documenti, secondo le tue regole. On-premise, verificabile, senza allucinazioni.
**CTA primaria:** Valuta il tuo caso d'uso → `/contatti/`
**CTA secondaria:** Parla con noi → `mailto:info@committa.it`

**Sezione "Il problema"** (intro in evidenza):
> Le AI generiche sono potenti ma non conoscono la tua azienda. Non sanno cosa c'è nei tuoi contratti, nei tuoi manuali tecnici, nei protocolli che usi da vent'anni. Così generalizzano. Inventano. Allucinano.

**Sezione "La differenza"** (H2: Non la stessa AI di tutti. La tua.)
> Lira non è una piattaforma preconfezionata da adattare a te. È il contrario: la piattaforma si modella sul tuo contesto. La qualità dei risultati è praticamente ineguagliabile da qualunque soluzione out-of-the-box — perché loro partono da internet, noi partiamo dai tuoi documenti.

**Sezione "Quattro pilastri"** — 4 card:
- **Sovranità totale dei dati** — 100% on-premise, conforme GDPR, auditabile; deployment ibrido o cloud quando serve.
- **Scalabile, davvero** — containerizzata e modulare; da una singola macchina a cluster distribuiti; 10k o 10M pagine, la stessa piattaforma.
- **Cucita su misura** — embedding, LLM, chunking, retrieval, connettori, prompt: ogni parametro configurabile sul tuo dominio.
- **Multimodale e verificabile** — testo, tabelle e immagini indicizzati; ogni risposta cita la fonte, riga per riga.

**Sezione "Come funziona"** (H2: Dietro le quinte: l'architettura in due tempi)
- **RAG-U — il motore.** Ingestione (docx, PDF, formati misti), Indicizzazione (vector store on-prem + BM25), Retrieval (semantico + keyword, rerank), Didascalia immagini (vision worker parallelo).
- **Lira Assistant — l'agente.** Chat in linguaggio naturale, citazione fonti, brandizzabile; API OpenAI-compatibile; MCP server per agenti evoluti.

In sintesi, una sola frase: **RAG-U pensa, Lira Assistant parla.**

**Sezione "Confronto"** — tabella 3 colonne (Scenario / Chatbot generica / Lira AI), presa dal brief. Va tenuta: è un pezzo persuasivo forte.

**Sezione "Per chi è"** — bullet list:
- Industrie con patrimonio documentale tecnico enorme e decennale
- Studi legali e compliance dove la precisione non è negoziabile
- R&D e knowledge management
- Settori regolati (sanità, finanza, difesa, energetico)
- Chiunque abbia provato una chatbot off-the-shelf e abbia smesso di crederci

**Sezione "Cosa ricevi"** — bullet list (RAG-U + Lira Assistant + API OpenAI + server MCP + connettori + multimodal + formazione + supporto engineering).

**CTA finale (banner evidenziatore):**
> LIRA: la chatbot smette di essere una promessa generica e diventa una risposta precisa — la risposta esatta, sulla tua documentazione, dentro la tua azienda. **Non la stessa AI di tutti. La tua.**

CTA: **Valutazione gratuita e demo sul tuo campione** → `/contatti/`

---

### 3.5 Pagina Contatti (`/contatti/`)

**H1:** Contatti
**Lead:** Scrivimi per una valutazione gratuita del tuo caso d'uso o del tuo progetto.

Layout 2 colonne:
- Sinistra: form (nome, email aziendale, messaggio, **select motivo**: Servizi / LIRA / Altro). Inoltro via Formspree (configurare `formspree_action` in `hugo.toml`).
- Destra: recapiti · **Email:** info@committa.it · **P.IVA:** (da fornire) · **Area:** Italia (o città, da fornire) · link a social se presenti.

Validazione: inline accanto al campo, focus management con `:focus-visible`, errori con `aria-describedby`, messaggio di conferma in pagina (niente popup).

---

### 3.6 404

Titolo: "Pagina non trovata"
Body: 1 frase + link a Home e a Servizi.

---

## 4. Mappatura del contenuto "Attività principale" nel sito

Il brief elenca 4 macro-aree dell'attività principale. La più ricca (Sviluppo software per automazione industriale, Integrazione sistemi, Assistenza, Consulenza e Formazione) viene dispiegata come sezione verticale di **/servizi/**, mentre la home mostra solo i 4 servizi "commerciali" per non soffocare il visitatore.

| Voce del brief | Dove finisce |
|---|---|
| 4 servizi commerciali (sviluppo personalizzato, database, infrastrutture, assistenza) | Home § Servizi + /servizi/ (espansione) |
| Sviluppo software per WMS/MES/HMI | /servizi/ § "Cosa posso fare" |
| Integrazione e comunicazione tra sistemi (ERP, PLC, sensori IoT) | /servizi/ § "Cosa posso fare" |
| Assistenza tecnica e manutenzione | /servizi/ § "Cosa posso fare" (richiama anche il servizio "Assistenza tecnica") |
| Consulenza tecnica e formazione | /servizi/ § "Cosa posso fare" + voce dedicata nei Servizi |
| Bio in terza persona | /chi-sono/ |
| LIRA (intero) | /lira/ |

---

## 5. Struttura file del tema custom

```
archetypes/
  default.md           (front matter TOML +++)
content/
  _index.md            (homepage — front matter + parametri sezioni)
  servizi.md
  chi-sono.md
  lira.md
  contatti.md
data/
  servizi.yaml         (4 card servizi)
  lira/pilastri.yaml   (4 card LIRA)
  lira/confronto.yaml  (tabella confronto)
  lira/per-chi.yaml    (lista)
  lira/cosa-ricevi.yarml
  clienti.yaml         (elenco multinazionali)
layouts/
  _default/
    baseof.html        (HTML root, head, header, footer, scripts)
    single.html        (fallback per pagine semplici)
  partials/
    head.html
    header.html
    footer.html
    cta.html           (blocco CTA riutilizzabile)
    service-card.html
    pillar-card.html
    comparison-table.html
    contact-form.html
  index.html           (homepage con sezioni #servizi #chi-sono)
  404.html
assets/
  css/
    main.css           (tokens + base)
    components.css     (card, button, form, table)
    utilities.css
  js/
    theme.js           (dark mode toggle + localStorage)
    reveal.js          (IntersectionObserver, ridotto respect)
static/
  images/              (NON toccare — MainLogo, InvertedLogo, Symbol, PNG/SVG)
  favicon.ico         (se non esiste, generato da Symbol.svg)
  robots.txt
hugo.toml
```

Note:

- Hugo Pipelines per CSS/JS: <code>{{ $css := resources.Get "css/main.css" \| \| minify }}</code> ecc. → cache-busting automatico e Fingerprint per CSP.
- `layouts/index.html` usa partials e parametri da `content/_index.md` per i testi hero/lead.
- `data/*.yaml` resta la fonte di contenuti ripetuti (card, pilastri, confronto); un partial itera e renderizza. Stesso principio del tema devcows, ma molto più snello.

---

## 6. Modhe a `hugo.toml`

Da applicare in fase di implementazione (non ora):

- Aggiornare `[menu.main]` con voci: Home, Servizi, Chi sono, LIRA, Contatti.
- Sostituire `[params]` sezione stile con `style = "trust-authority"` (solo selettore logico, non consumato dal tema custom).
- Aggiornare `defaultDescription` e `defaultKeywords` con keyword Industria 4.0, WMS, MES, HMI, RAG, AI on-premise.
- Aggiungere `[params.contact]` con `formspree_action` reale.
- Aggiornare `copyright` a 2026.
- Aggiungere `[params.social]` se previsto (LinkedIn personale probabile).

---

## 7. Asset e privacy

- Mantenere `MainLogo.svg`, `InvertedLogo.svg`, `Symbol.svg` e relative PNG così come sono.
- Generare `favicon.ico` (multi-size) da `Symbol.svg` con script build-step.
- Aggiungere `og:image` (~1200×630): creato da MainLogo + bg navy. Da fornire come file flat in `static/images/og-default.png` — va generato offline (es. Figma / script ImageMagick).
- **Privacy / Cookie policy:** per un sito statico con form Formspree e GA disabilitato, una pagina `/privacy/` semplice è consigliata (GDPR). Da confermare.
- **P.IVA:** da fornire per inserirla in footer (obbligo per attività commerciale in IT).

---

## 8. Piano di implementazione step-by-step

1. **Dismissione del submodule.**
   - `git submodule deinit -f themes/hugo-universal-theme`
   - `git rm themes/hugo-universal-theme`
   - Rimuovere voce `[theme]` da `hugo.toml` (o lasciare blank — il tema custom non ne ha bisogno).
   - Aggiornare `.gitmodules`.

2. **Scaffolding del tema custom.**
   - Creare `layouts/_default/baseof.html` con HTML5 semantico + `<head>` gestito da `partials/head.html`.
   - Definire CSS variabili (tokens §1) in `assets/css/main.css`.
   - Implementare header sticky + drawer mobile + dark mode toggle.

3. **Contenuti.**
   - Riscrivere `content/_index.md` con front matter (title, description, params per hero/lead).
   - Creare `content/servizi.md`, `content/chi-sono.md`, `content/lira.md`, `content/contatti.md`.
   - Convertire i 4 servizi + pilastri LIRA in `data/*.yaml` (fonte "servizi", fonte "pilastri", fonte "confronto", "clienti").

4. **Layout pagine.**
   - `layouts/index.html` (home con hero, servizi, chi-sono-in-breve, clienti, contatti preview).
   - `layouts/_default/single.html` riusato per servizi/chi-sono/contatti (con partial condizionali).
   - `layouts/lira/single.html` (override per la pagina LIRA, dato il ritmo narrativo diverso).
   - `layouts/404.html`.

5. **Partials riutilizzabili.** Card servizi, card pilastri, tabella confronto, form contatti, CTA.

6. **CSS & JS.**
   - Componenti: `.btn`, `.btn--primary`, `.btn--ghost`, `.card`, `.feature`, `.pillar`, `.comparison-table`, `.hero`, `.section`, `.container`, `.grid`.
   - `theme.js` ~20 righe (toggle + localStorage).
   - `reveal.js` ~30 righe (IntersectionObserver).
   - Rispettato `@media (prefers-reduced-motion: reduce)` e `@media (prefers-color-scheme: dark)`.

7. **Bonus.**
   - `robots.txt` statico (consente tutto, punta a sitemap).
   - `sitemap.xml` autogenerato da Hugo.
   - `manifest.webmanifest` (PWA minimale) — opzionale.
   - favicon.

8. **Build & QA.**
   - `hugo server` per dev.
   - `hugo --gc --minify` per build production.
   - Lighthouse su tutte le pagine (mobile + desktop) — target 100 in ogni categoria.
   - Test responsive a 375 / 768 / 1280 / 1440.
   - Verifica contrasti WCAG AA per ogni colore token in chiaro e scuro.
   - Navigazione tastiera completa (Tab visibile, ESC chiude drawer).
   - Test form Formspree (inviando una mail di prova).

9. **Deploy.**
   - Costruire `public/` localmente.
   - Copia mano / script esterno (deploy non è nel repo, vedi AGENTS.md).
   - Verifica su www / apex — `CNAME` già presente.

---

## 9. Aperti / informazioni da parte dell'utente

Queste non bloccano la fase di costruzione del tema custom ma servono prima del deploy:

1. **Formspree form ID** per il form contatti (`formspree_action`).
2. **P.IVA / natura giuridica** da inserire in footer.
3. **Area / città** da mostrare in contatti (Bologna? Italia?).
4. **Ritratto di Marco** per la pagina /chi-sono/ (placeholder in attesa).
5. **og:image** da utilizzare nei social share (creabile da MainLogo + bg navy).
6. **LinkedIn / altri social** personali da linkare in footer (se previsto).
7. **Cookie / privacy policy:** serve una pagina `/privacy/`? (consigliato per GDPR con form attivo).

---

## 10. Anti-patterni da evitare (dalle skill ui-ux)

- ❌ Emoji come icone — uso solo SVG inline (Lucide).
- ❌ Gradienti AI purple/pink (slop generativo).
- ❌ Animazioni solo decorative (hover che non comunica nulla).
- ❌ Animate width/height/`top` (causano layout; usare solo transform/opacity/filter).
- ❌ Disabilitare lo zoom mobile; ❌ `maximum-scale=1`.
- ❌ Testo < 12px nel body; ❌ gray-on-gray.
- ❌ Focus ring rimossi (usare `:focus-visible` ben visibile).
- ❌ Lasciare in uso residui del tema devcows (WIP) senza pulirli.

---

## 11. Riferimenti

- Template token: family Poppins + Open Sans, navy `#0F172A` + accent `#0369A1`.
- Ispirazione ritmica: Linear / Stripe / Vercel landing pages (linear.com, stripe.com, vercel.com) per alternanza di whitespace, tipografia gerarchica e CTA chiare.
- LIRA: tono editoriale + tabella confronto -- riferimento tipo "page prodotto" di aziende AI infrastruttura (Anthropic, Cohere).

---

*Piano redatto sulla base del brief + raccomandazioni ui-ux-pro-max (Trust & Authority / Enterprise Gateway). Pronto per la fase di implementazione.*