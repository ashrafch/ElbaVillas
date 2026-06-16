# AGENTS.md

Guida tecnica per agenti AI e sviluppatori che lavorano su Elba Luce Villas.
Per la gestione degli asset visuali, leggere anche `ASSET_GUIDE.md`.

---

## Project Overview

Elba Luce Villas è una landing page editoriale premium per un complesso di ville esclusive sull'Isola d'Elba.

Obiettivi principali:

- Presentare architettura, natura, location, lifestyle e potenziale di investimento.
- Raccogliere lead qualificati via form email.
- Restare deployabile su Vercel senza backend complesso.
- Mantenere il codice modulare, tipato e facilmente estendibile.

L'identità visiva è: lusso sobrio, mediterraneo, editoriale, architettonico, spazioso e calmo.

---

## Stack

Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui (base-nova) · Framer Motion 12 · React Hook Form · Zod · lucide-react · next/image · Resend (email) · Vercel

Non aggiungere database, auth, admin area o CMS a meno di richiesta esplicita.

---

## Architecture

```
app/
  page.tsx            ← composizione pagina (server component)
  layout.tsx          ← root layout, metadata, font
  globals.css         ← design tokens CSS, keyframe animations
  api/lead/route.ts   ← POST endpoint form lead
components/
  layout/             ← Header, Footer, MobileMenu
  motion/             ← FadeIn, RevealText, ParallaxImage, MagneticButton,
                         ScrollProgress, VideoBackground, MarqueeText
  sections/           ← tutte le sezioni della homepage
  forms/              ← LeadForm
  ui/                 ← shadcn/ui components
lib/
  site.ts             ← config globale sito (nome, nav, contatti)
  villas.ts           ← dati delle 4 ville
  gallery.ts          ← dati galleria
  faqs.ts             ← domande frequenti
  validations.ts      ← schema Zod per lead form
  email.ts            ← invio email via Resend
  rate-limit.ts       ← rate limiting in-memory
  utils.ts            ← cn() helper
types/
  villa.ts, lead.ts, site.ts
public/
  images/             ← asset statici ottimizzati
  videos/             ← video web-ready
assets/               ← (gitignored) file originali del cliente
```

---

## Ordine Sezioni Pagina

```
HeroSection              ← video background, headline, CTA
MarqueeText strip        ← keyword brand in scorrimento
ProjectIntroSection      ← descrizione progetto
KeyFiguresSection        ← 4 numeri chiave
VillasOverviewSection    ← griglia 4 ville
DroneVideoSection        ← video drone full-bleed
ImmersiveGallerySection  ← galleria con lightbox
ArchitectureSection      ← materiali e design
LocationSection          ← mappa e POI
LifestyleSection         ← mosaico immagini + tag lifestyle
InvestmentSection        ← stats + motivazioni investimento
ContactLeadSection       ← form lead
FaqSection               ← accordion domande
```

---

## Sistema di Stile

### Palette colori

| Ruolo | Valore | Utilizzo |
|---|---|---|
| Scuro primario | `#172522` | Bg dark, header, testo su chiaro |
| Sabbia calda | `#efe7d8` | Bg sezioni alternate chiare |
| Bianco caldo | `#f7f1e7` | Bg ArchitectureSection |
| `--background` | `oklch(0.985 0.012 83)` | Bg base pagina |
| `--foreground` | `oklch(0.19 0.018 73)` | Testo principale |
| `--accent` | `oklch(0.56 0.075 153)` | Verde mediterraneo, label sezione |
| `--primary` | `oklch(0.31 0.04 189)` | Verde scuro, bottoni, link |
| `--muted-foreground` | `oklch(0.43 0.025 75)` | Sottotitoli, descrizioni |

### Font

| Variabile CSS | Font | Classe Tailwind | Utilizzo |
|---|---|---|---|
| `--font-heading` | Cormorant Garamond | `.font-heading` | H1–H3, numeri grandi, nomi ville |
| `--font-sans` | Geist | default | Corpo testo, UI, label |

### Tipografia — Scale

- **Titoli sezione:** `font-heading text-4xl md:text-6xl font-medium`
- **Overline (label piccola sopra titolo):** `text-xs uppercase tracking-[0.28em] text-accent`
- **Corpo:** `text-base sm:text-lg leading-7 sm:leading-8 text-muted-foreground`
- **Label UI:** `text-xs uppercase tracking-[0.14em–0.22em]`

### Container e Spaziatura

- **Container:** `.container-premium` → `width: min(100% - 2rem, 1180px); margin-inline: auto`
- **Padding sezioni standard:** `py-20 sm:py-24 md:py-32`
- **Gap griglie:** `gap-10 lg:gap-16`

### Ritmo Visivo Sezioni

Le sezioni si alternano tra background scuro e chiaro per creare respiro:

```
Hero            → scuro (#172522)
MarqueeStrip    → sabbia (#efe7d8)
ProjectIntro    → chiaro (background)
KeyFigures      → sabbia (#efe7d8)
VillasOverview  → sabbia (#efe7d8)
DroneVideo      → scuro (#0d1e1a / #172522)
Gallery         → chiaro (background)
Architecture    → caldo (#f7f1e7)
Location        → chiaro (background)
Lifestyle       → scuro (#172522)
Investment      → scuro (#172522)
Contact         → chiaro (background)
FAQ             → chiaro (background)
```

Non mettere due sezioni chiare o due sezioni scure consecutive senza motivazione visiva.

---

## Mappa Componente → Asset

| Componente | File asset | Config data |
|---|---|---|
| `HeroSection` | `public/videos/elba-hero.mp4` (video) + `public/images/hero/elba-villas-hero.svg` (poster) | — |
| `VillaCard` | `villa.image` per ogni villa | `lib/villas.ts` |
| `DroneVideoSection` | `public/videos/elba-drone.mp4` | — |
| `ImmersiveGallerySection` | `item.src` per ogni item | `lib/gallery.ts` |
| `ArchitectureSection` | `public/images/architecture/*.svg` | hardcoded nel componente |
| `LifestyleSection` | `public/images/gallery/elba-coastline.svg` + `living-light.svg` + `private-pool.svg` | hardcoded nel componente |
| `ProjectIntroSection` | `public/images/architecture/architecture-elba.svg` + `stone-detail.svg` | hardcoded nel componente |

Per aggiornare le immagini hardcodate nei componenti usare `ASSET_GUIDE.md`.

---

## Data Rules

I contenuti in v1 sono in TypeScript, non in un CMS:

- `lib/site.ts` — nome sito, nav, contatti, social
- `lib/villas.ts` — 4 ville con specs, immagini, highlights, stato
- `lib/gallery.ts` — 5 item galleria con categoria
- `lib/faqs.ts` — 7 FAQ

Non hardcodare contenuto ripetuto nei componenti quando appartiene a questi file.

---

## Form Rules

Il form usa React Hook Form + Zod. Validazione sia client-side che in `/app/api/lead/route.ts`.

Campi: `firstName`, `lastName`, `email`, `phone`, `budget`, `interest`, `message`, `privacyAccepted`, `website` (honeypot).

Se il honeypot è compilato: restituire success silenzioso. Se le env var Resend mancano: mock mode con log server-side. Non salvare lead in database in v1.

---

## Component Rules

- Server components by default — aggiungere `"use client"` solo per: animazioni Framer Motion, stato form, mobile menu, lightbox, browser API.
- Non rendere l'intera homepage un client component.
- Componenti piccoli, tipati, leggibili.
- I motion primitives in `components/motion/` sono wrapper riusabili — usarli invece di copiare logica di animazione.

---

## Video Assets

Due video reali in `public/videos/`:

- `elba-hero.mp4` — sfondo ambient dell'HeroSection (autoplay, muted, loop).
- `elba-drone.mp4` — video cinematico full-bleed nella DroneVideoSection (autoplay muted, utente può togliere mute).

Entrambi usano `preload="metadata"`. Non cambiarlo in `preload="auto"`.

I file originali sono in `assets/` (gitignored). Non commitare file da `assets/` direttamente.

Se arrivano versioni HD, ottimizzare prima con FFmpeg (vedi `ASSET_GUIDE.md`) poi sostituire i file in `public/videos/`.

---

## Accessibility And Performance

- HTML semantico, `alt` text significativo su tutte le immagini.
- Focus states visibili, interazioni keyboard-friendly.
- Reduced-motion support: `VideoBackground` e `MarqueeText` rispettano `prefers-reduced-motion`.
- `next/image` per tutte le immagini (non `<img>` raw salvo eccezioni giustificate).
- No layout shift: aspect ratio espliciti su contenitori immagini/video.
- Non aggiungere scroll effect pesanti (parallasse fine su immagini è OK).

---

## SEO

- Metadata via Next.js Metadata API in `app/layout.tsx`.
- Un solo `<h1>` nella pagina (in HeroSection).
- Heading hierarchy: H1 → H2 per sezioni → H3 per feature/card.
- `sitemap.xml` e `robots.txt` già generati via `app/sitemap.ts` e `app/robots.ts`.
- OG image generata da `app/opengraph-image.tsx` — aggiornare se cambia l'identità visiva.

---

## Deployment

- Deploy su Vercel — ogni push a `main` triggera un deployment automatico.
- Build command: `npm run build` (Next.js static export + API route).
- Env vars richieste (opzionali per mock mode): `RESEND_API_KEY`, `LEAD_RECEIVER_EMAIL`, `NEXT_PUBLIC_SITE_URL`.
- Documentate in `.env.example`.

---

## Task Workflow

1. Leggere prima i file rilevanti.
2. Fare il cambiamento più piccolo e completo.
3. Mantenere lo stile coerente con il sistema di stile sopra.
4. Preservare l'architettura dei contenuti statici.
5. Eseguire `npm run build` prima di committare.
6. Commit descrittivi: cosa cambia e perché.
7. Push su `main` → deploy automatico Vercel.

---

## Do Not Do

- No database, auth, admin panel, CMS.
- No librerie non necessarie.
- No promesse di rendimento finanziario false.
- No secret esposti al client.
- No componenti enormi (>200 righe).
- No refactor non richiesti.
- No `preload="auto"` sui video.
- Non committare file da `assets/` (gitignored per design).
