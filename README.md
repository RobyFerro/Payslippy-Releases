# Payslippy-Releases · gh-pages

Branch che ospita la landing page di **DocuMiner** pubblicata via GitHub Pages.

URL pubblico: https://robyferro.github.io/Payslippy-Releases/

Sito statico (HTML/CSS/JS vanilla, nessun build step). Per modificarlo basta editare i file in questo branch e fare push.

Struttura:
- `index.html` — pagina principale
- `assets/css/styles.css` — stili
- `assets/js/app.js` — fetch latest release + interazioni
- `assets/img/` — immagini e screenshot
- `.nojekyll` — disabilita Jekyll su GitHub Pages

## Immagini richieste in `assets/img/`

Tutti gli screenshot sono mostrati dentro un "window frame" con `aspect-ratio: 16/9` e `object-fit: cover`. Le dimensioni indicate sono **2x retina** per garantire nitidezza su display HiDPI; PNG con sfondo opaco vanno bene, niente trasparenza richiesta.

| File | Dimensione consigliata | Aspect ratio | Dove appare | Note |
|---|---|---|---|---|
| `logo.png` | **128 × 128** | 1:1 | Topbar, footer, brand mark | Renderizzato a 26–32 px, 128 px copre retina |
| `favicon.ico` | **32 × 32** (multi-size: 16/32/48) | 1:1 | Tab del browser | Formato `.ico` multi-resolution |
| `og-cover.png` | **1200 × 630** | 1.91:1 | Open Graph / Twitter preview | Standard social, include nome prodotto e claim |
| `hero-screen.png` | **2400 × 1350** | 16:9 | Hero — finestra principale | Screenshot di DocuMiner con un PDF aperto e bounding box colorati sui campi |
| `export-excel.png` | **1600 × 900** | 16:9 | Sezione "Quando ti servono fuori" | Foglio Excel con i dati esportati, tipo cedolino o fatture |
| `graph-screen.png` | **1600 × 900** | 16:9 | Deep-dive "Editor dei flussi" | Programming Graph Engine con nodi collegati e badge di test |
| `ai-screen.png` | **1600 × 900** | 16:9 | Deep-dive "Assistente AI" | Chat con prompt in italiano + grafo generato visibile |

Note operative:
- I file mancanti vengono rimossi a runtime via `onerror="this.remove()"` e al loro posto compare un placeholder a griglia, quindi il sito non si rompe finché le immagini non ci sono.
- Lo screenshot `hero-screen.png` è il più visibile: vale la pena curarlo (composizione, colori coerenti col tema verde scuro `#0A1614`).
- Se passi sopra i 500 KB per immagine, ottimizza con `squoosh.app` o equivalente prima di committare.
