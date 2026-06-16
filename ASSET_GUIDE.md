# ASSET_GUIDE.md

Guida completa per sostituire i placeholder con materiali reali e costruire progressivamente l'identità visiva del progetto.

---

## Stato Corrente degli Asset

| Asset | File | Stato | Note |
|---|---|---|---|
| Hero video | `public/videos/elba-hero.mp4` | ✅ Reale | Video WhatsApp 09.01.08 |
| Drone video | `public/videos/elba-drone.mp4` | ✅ Reale | Video WhatsApp 09.01.09 |
| Hero still (poster/fallback) | `public/images/hero/elba-villas-hero.svg` | 🔲 Placeholder SVG | Sostituire con `.webp` |
| Villa Azzurra | `public/images/villas/villa-azzurra.svg` | 🔲 Placeholder SVG | Render o foto |
| Villa Ginestra | `public/images/villas/villa-ginestra.svg` | 🔲 Placeholder SVG | Render o foto |
| Villa Maestrale | `public/images/villas/villa-maestrale.svg` | 🔲 Placeholder SVG | Render o foto |
| Villa Tramonto | `public/images/villas/villa-tramonto.svg` | 🔲 Placeholder SVG | Render o foto |
| Gallery: costa | `public/images/gallery/elba-coastline.svg` | 🔲 Placeholder SVG | Foto drone/costa |
| Gallery: living | `public/images/gallery/living-light.svg` | 🔲 Placeholder SVG | Render interno |
| Gallery: piscina | `public/images/gallery/private-pool.svg` | 🔲 Placeholder SVG | Foto/render piscina |
| Gallery: pietra | `public/images/gallery/stone-detail.svg` | 🔲 Placeholder SVG | Foto materiale |
| Gallery: planimetria | `public/images/gallery/plan-placeholder.svg` | 🔲 Placeholder SVG | PDF / immagine tecnica |
| Architettura 1 | `public/images/architecture/stone-detail.svg` | 🔲 Placeholder SVG | Foto dettaglio |
| Architettura 2 | `public/images/architecture/architecture-elba.svg` | 🔲 Placeholder SVG | Render / foto esterna |
| Logo / brand | (nessuno — testo) | 🔲 Solo testo | Da aggiungere se disponibile |
| OpenGraph image | generata da `app/opengraph-image.tsx` | 🔲 Generata via codice | Da aggiornare se cambia l'identità |

---

## Priorità di Sostituzione

### Priorità 1 — Impatto visivo immediato
1. **Hero still** (`public/images/hero/`) — poster del video e fallback reduced-motion
2. **Villa cards** × 4 (`public/images/villas/`) — sezione più vista dopo l'hero

### Priorità 2 — Completezza visiva
3. **Gallery** × 5 (`public/images/gallery/`) — sezione immersiva
4. **Architecture** × 2 (`public/images/architecture/`) — usate anche in ProjectIntroSection

### Priorità 3 — Identità e branding
5. **Logo / wordmark** — da aggiungere nell'header se disponibile
6. **OpenGraph image** — per link share sui social, aggiornare in `app/opengraph-image.tsx`

---

## Formati e Dimensioni

### Immagini

| Uso | Formato | Dimensioni consigliate | Max peso |
|---|---|---|---|
| Hero still / poster | `.webp` | 2400 × 1400 px | 350 KB |
| Villa card | `.webp` | 1400 × 1680 px (5:6) | 200 KB |
| Gallery landscape | `.webp` | 1800 × 1200 px | 250 KB |
| Gallery portrait | `.webp` | 1200 × 1500 px | 200 KB |
| Material detail | `.webp` | 1400 × 1400 px | 180 KB |
| Architecture | `.webp` | 1400 × 1750 px (4:5) | 220 KB |
| OG image | `.png` o `.jpg` | 1200 × 630 px | 150 KB |

**Strumento consigliato per ottimizzare:** [Squoosh](https://squoosh.app) — WebP quality 82-88 è un buon compromesso.

### Video

| Uso | File | Formato | Max peso |
|---|---|---|---|
| Hero background | `elba-hero.mp4` | H.264 mp4 | 15-20 MB |
| Drone section | `elba-drone.mp4` | H.264 mp4 | 15-25 MB |

**Note video:**
- I video attuali sono ~2 MB (WhatsApp-compressed) — qualità sufficiente per ora.
- Se arrivano versioni ad alta risoluzione, comprimere con HandBrake o FFmpeg prima di sostituire:
  ```bash
  ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1920:-2 output.mp4
  ```
- `preload="metadata"` è già impostato — non cambiarlo in `auto`.

---

## Come Sostituire un Asset

### 1. Immagini (foto / render)

**Passo 1 — Preparare il file:**
- Ridimensionare alle dimensioni consigliate
- Convertire in `.webp`
- Nominare in minuscolo senza spazi: `villa-azzurra-principale.webp`

**Passo 2 — Copiare in `public/`:**
```
public/images/villas/villa-azzurra.webp   ← sostituisce villa-azzurra.svg
public/images/hero/elba-villas-hero.webp  ← sostituisce elba-villas-hero.svg
```

**Passo 3 — Aggiornare il riferimento in codice:**

Per le **ville** → modificare `lib/villas.ts`:
```ts
// Prima:
image: "/images/villas/villa-azzurra.svg",
// Dopo:
image: "/images/villas/villa-azzurra.webp",
```

Per la **gallery** → modificare `lib/gallery.ts`:
```ts
// Prima:
src: "/images/gallery/elba-coastline.svg",
// Dopo:
src: "/images/gallery/elba-coastline.webp",
```

Per **hero still / architettura / lifestyle** → modificare direttamente il componente:
- Hero poster: `components/sections/HeroSection.tsx` → prop `poster` di `VideoBackground`
- Architecture: `components/sections/ArchitectureSection.tsx` → `<Image src="..."`
- Lifestyle mosaic: `components/sections/LifestyleSection.tsx` → `<Image src="..."`

**Passo 4 — Testare:**
```bash
npm run build
```
Aprire il sito locale con `npm run dev` e verificare su mobile (Chrome DevTools, larghezza 390px).

### 2. Video

**Passo 1 — Ottimizzare il video** (se oltre 25 MB):
```bash
ffmpeg -i originale.mp4 -vcodec libx264 -crf 28 -preset slow -vf scale=1920:-2 -movflags +faststart output.mp4
```

**Passo 2 — Copiare in `public/videos/`:**
```
public/videos/elba-hero.mp4    ← video hero background
public/videos/elba-drone.mp4   ← video sezione drone
```

**Passo 3:** Nessun cambio di codice se si mantengono i nomi.

**Passo 4 — Aggiornare anche il poster:** Se cambia il fermo immagine migliore del video, aggiornare la prop `poster` in `HeroSection.tsx` e in `DroneVideoSection.tsx`.

### 3. Logo / wordmark

Se arriva un logo vettoriale:

**Opzione A — SVG inline:**
Salvare in `public/images/brand/logo.svg` e modificare l'anchor in `components/layout/Header.tsx`:
```tsx
// Prima (solo testo):
<a href="#" className="font-heading text-2xl tracking-wide">
  {siteConfig.name}
</a>

// Dopo (con logo SVG):
import Image from "next/image"
// ...
<a href="#" aria-label={siteConfig.name}>
  <Image src="/images/brand/logo.svg" alt="Elba Luce Villas" width={160} height={40} priority />
</a>
```

**Opzione B — Next.js Image con versione chiara/scura:**
Usare due file (`logo-white.svg` e `logo-dark.svg`) e mostrare quello corretto in base allo stato scroll dell'header (già tracciato via `scrolled` state in `Header.tsx`).

---

## Convenzioni di Naming

```
kebab-case-minuscolo.webp         ✅
Villa Azzurra Piscina.JPG         ❌
villa_azzurra_piscina.jpg         ❌ (underscore)
```

Esempi corretti:
```
villa-azzurra-piscina.webp
villa-ginestra-terrazza.webp
elba-coastline-sunset.webp
stone-detail-basamento.webp
architecture-south-facade.webp
plan-villa-tramonto.webp
```

---

## Sistema di Stile — Riferimento Rapido

Non modificare questi valori senza aggiornare l'intera identità visiva.

### Colori principali

| Token | Valore | Uso |
|---|---|---|
| `#172522` | Verde scuro profondo | Background sezioni dark, header, testo |
| `#efe7d8` | Sabbia calda | Background sezioni chiare alternate |
| `#f7f1e7` | Bianco caldo | Background ArchitectureSection |
| `oklch(0.985 0.012 83)` | `--background` | Background base pagina |
| `oklch(0.56 0.075 153)` | `--accent` | Verde mediterraneo, badge, label sezione |
| `oklch(0.31 0.04 189)` | `--primary` | Verde scuro primario, bottoni |

### Font

| Variabile | Font | Uso |
|---|---|---|
| `--font-heading` / `.font-heading` | Cormorant Garamond | Titoli H1–H3, numeri grandi |
| `--font-sans` | Geist | Tutto il corpo testo |
| `--font-mono` | Geist Mono | Non usato in produzione |

**Regola:** le dimensioni titoli vanno da `text-4xl` (mobile) a `text-6xl`/`text-7xl` (desktop) usando `font-heading`. Il corpo testo usa `text-base` / `text-lg` con `leading-7`/`leading-8`.

### Spacing e Container

- Container: `container-premium` → `width: min(100% - 2rem, 1180px); margin-inline: auto`
- Section padding standard: `py-20 sm:py-24 md:py-32`
- Gap griglia: `gap-10 lg:gap-16`

---

## Workflow Git per gli Asset

### Regola: i file originali NON vanno in git

La cartella `assets/` è in `.gitignore`. I file originali del cliente (con nomi come `WhatsApp Video...`) restano solo in locale.

**Quello che VA in git** è la versione web ottimizzata in `public/`:
```
public/videos/elba-hero.mp4    ✅ in git
public/images/villas/villa-azzurra.webp  ✅ in git
```

**Quello che NON va in git:**
```
assets/WhatsApp Video 2026-06-16 at 09.01.08.mp4  ❌ ignorato
assets/foto-originale-4k.heic  ❌ ignorato
```

### Flusso per aggiungere asset reali

```bash
# 1. Ottimizzare e rinominare il file
# 2. Copiare in public/ con il nome corretto
# 3. Aggiornare il riferimento in codice (lib/villas.ts, lib/gallery.ts, o componente)
# 4. Verificare build
npm run build
# 5. Commit e push (Vercel deploya automaticamente)
git add public/images/villas/villa-azzurra.webp lib/villas.ts
git commit -m "Replace villa-azzurra placeholder with real render"
git push
```

---

## Checklist Prima di Ogni Pubblicazione Asset

- [ ] File ottimizzato (peso ≤ soglia nella tabella sopra)
- [ ] Nomi in kebab-case senza spazi
- [ ] `alt` text aggiornato (in `lib/villas.ts`, `lib/gallery.ts`, o nel componente)
- [ ] Ritaglio corretto su mobile (testare a 390 px di larghezza)
- [ ] Testo sull'hero leggibile con il nuovo asset (contrasto overlay)
- [ ] `npm run build` verde
- [ ] OG image aggiornata se cambia il look principale
