# Simulatore di Investimento — Metodologia e Calcoli

Documento tecnico per la verifica dei calcoli del simulatore integrato nella landing page Elba Luce Villas.
Aggiornato con i valori attivi nel file `components/sections/InvestmentSimulatorModal.tsx`.

---

## 1. Rendita Lorda Annua

```
rendita_lorda = notti_mese × 12 × tariffa_notte
```

**Esempio** (valori default):
```
20 notti/mese × 12 mesi × €850/notte = €204,000 / anno
```

**Fonte tariffa di riferimento:**  
Casevacanza.it (2024) riporta una tariffa media per ville di lusso sull'Isola d'Elba di circa **€1,060/notte** in alta stagione.
Il simulatore usa €850/notte come default conservativo (tasso di riempimento medio, non solo alta stagione).

---

## 2. Costi Stimati Annui

### 2.1 Gestione Locativa (22% del lordo)

```
costo_gestione = rendita_lorda × 0.22
```

Include: commissione piattaforme (Airbnb/Vrbo: ~15%), property manager locale (~7%), check-in/out, pulizie straordinarie.

**Fonte:** Media di mercato italiana per gestione locazione breve con piattaforme online.  
Range tipico: 18–28%. Valore usato: **22%** (conservativo-medio).

Riferimento: [Confturismo — Affitti Brevi 2023](https://www.confturismo.it)

---

### 2.2 Cedolare Secca (21% del lordo)

```
costo_fiscale = rendita_lorda × 0.21
```

**Imposta sostitutiva IRPEF** prevista per le locazioni brevi (≤ 30 giorni) stipulate da persone fisiche.

**Base normativa:**
- **D.L. 50/2017, art. 4** (Decreto Manovra Correttiva 2017) — introduce la cedolare secca del 21% sugli affitti brevi.
- **Legge di Bilancio 2024 (L. 213/2023), art. 1 c. 63–67** — per i soggetti con più di un immobile in affitto breve, l'aliquota sale al 26% dal secondo immobile.

Il simulatore applica **21%** (prima abitazione in affitto breve, caso prevalente dell'investitore singolo).

**Importante:** la cedolare secca si calcola sul **lordo** senza possibilità di dedurre spese. È un regime sostitutivo all'IRPEF ordinaria. Non si applica all'IVA o ad altre imposte.

---

### 2.3 Manutenzione Ordinaria (1.2% del prezzo)

```
costo_manutenzione = prezzo_acquisto × 0.012
```

Include: piccole riparazioni, verniciatura periodica, sostituzione attrezzature, manutenzione impianti.

**Fonte:**  
Standard internazionale per immobili residenziali di pregio: **1–2% del valore annuo**.  
[Globalpropertyguide.com](https://www.globalpropertyguide.com/europe/italy/gross-rental-yields) — Italy property cost guide.  
Valore usato: **1.2%** (lusso, struttura nuova o recente, conservativo).

---

### 2.4 Assicurazione Immobile (0.4% del prezzo)

```
costo_assicurazione = prezzo_acquisto × 0.004
```

Polizza incendio, furto, responsabilità civile verso terzi (ospiti), eventi atmosferici.

**Fonte:** Preventivi medi mercato italiano per immobili vacanza di lusso.  
Range: 0.3–0.6% del valore assicurato. Valore usato: **0.4%**.

---

### 2.5 IMU Seconda Casa (~0.2% del prezzo)

```
costo_imu = prezzo_acquisto × 0.002
```

**IMU (Imposta Municipale Propria)** — dovuta sulla seconda casa non adibita ad abitazione principale.

**Calcolo reale IMU:**
```
base_imponibile = rendita_catastale × rivalutazione_catastale × moltiplicatore
IMU = base_imponibile × aliquota_comunale
```

Il valore catastale di un immobile è tipicamente **molto inferiore** al valore di mercato (spesso 5–10× inferiore).  
Per un immobile da €850,000 di mercato, la rendita catastale potrebbe corrispondere a una base imponibile di ~€80,000–120,000. Con aliquota massima 10.6‰, IMU effettiva: €850–1,270.

Il simulatore usa **0.2% del prezzo di mercato** come stima semplificata e prudenziale.

**Base normativa:** D.Lgs. 23/2011 art. 8; aggiornamenti L. 160/2019. Aliquote decise dal Comune di Porto Azzurro / Rio nell'Elba (0.86–1.06%).

---

### 2.6 Costi Fissi Annui (€5,200)

```
costi_fissi = €5,200 / anno
```

| Voce | Stima annua |
|---|---|
| Manutenzione piscina | €2,000 |
| Giardinaggio | €1,200 |
| Utenze base (acqua, luce vuoto) | €1,200 |
| Gestione TARI e tasse locali | €800 |
| **Totale** | **€5,200** |

Stima conservativa per villa con piscina privata su Isola d'Elba. Costi reali dipendono dalla dimensione della proprietà.

---

### 2.7 Totale Costi

```
totale_costi = costo_gestione + costo_fiscale + costo_manutenzione
             + costo_assicurazione + costo_imu + costi_fissi
```

---

## 3. Rendita Netta Annua

```
rendita_netta = rendita_lorda - totale_costi
```

**Esempio** (default):
```
€204,000 − (€44,880 + €42,840 + €10,200 + €3,400 + €1,700 + €5,200)
= €204,000 − €108,220
= €95,780 netti / anno
```

---

## 4. Rendimento (Yield)

### Rendimento Lordo

```
yield_lordo = (rendita_lorda / prezzo_acquisto) × 100
```

**Esempio:**
```
(€204,000 / €850,000) × 100 = 24.0% lordo
```

⚠️ Il rendimento lordo non tiene conto dei costi. È una metrica comparativa grezza.

### Rendimento Netto

```
yield_netto = (rendita_netta / prezzo_acquisto) × 100
```

**Esempio:**
```
(€95,780 / €850,000) × 100 = 11.3% netto
```

**Benchmark di mercato:**  
Globalpropertyguide.com (2024): ville di lusso toscane/elba: **4–10% lordo**, **2–6% netto** mediamente.  
Il simulatore permette di sperimentare scenari ottimistici (alta occupazione, tariffe premium) e conservativi.

---

## 5. Break-Even (Anni per rientrare dell'investimento)

Usato solo in modalità **acquisto diretto**.

```
anni_rientro = prezzo_acquisto / rendita_netta
```

Si assume reinvestimento costante della rendita netta nel rimborso del capitale iniziale.

**Esempio:**
```
€850,000 / €95,780 = ~8.9 anni
```

**Nota:** non considera la rivalutazione dell'immobile nel tempo (storicamente +1.5–3%/anno per Elba luxury).

---

## 6. Modalità Mutuo — Formula PMT

### Calcolo rata mensile

Formula standard **PMT (Payment)**:

```
rata_mensile = (C × r × (1+r)^n) / ((1+r)^n − 1)
```

dove:
- `C` = capitale finanziato = `prezzo - acconto`
- `r` = tasso mensile = `tasso_annuo / 12 / 100`
- `n` = numero rate = `anni × 12`

**Esempio** (acconto 30%, tasso 4.5%, 20 anni):
```
C = €850,000 × 0.70 = €595,000
r = 4.5 / 12 / 100 = 0.00375
n = 20 × 12 = 240

rata = (595,000 × 0.00375 × (1.00375)^240) / ((1.00375)^240 − 1)
     = (595,000 × 0.00375 × 2.4514) / (2.4514 − 1)
     = 5,467.5 / 1.4514
     ≈ €3,767 / mese
```

**Fonte:** Formula PMT standard, identica a Excel/Fogli Google. Verificabile con `=PMT(4.5%/12; 240; -595000)`.

### Cash Flow Annuo

```
cash_flow = rendita_netta - (rata_mensile × 12)
```

**Esempio:**
```
€95,780 - (€3,767 × 12) = €95,780 - €45,204 = +€50,576 / anno
```

### Anni per rientrare dell'acconto

```
anni_rientro_acconto = acconto / cash_flow
```

**Esempio:**
```
€255,000 / €50,576 ≈ 5.0 anni
```

---

## 7. Riepilogo Costanti

| Costante | Valore | Voce |
|---|---|---|
| `MANAGEMENT_FEE_PCT` | 22% | Gestione locativa + piattaforme |
| `CEDOLARE_SECCA_PCT` | 21% | Imposta sostitutiva affitti brevi |
| `MAINTENANCE_PCT` | 1.2% | Manutenzione ordinaria annua |
| `INSURANCE_PCT` | 0.4% | Assicurazione immobile |
| `IMU_EFFECTIVE_PCT` | 0.2% | IMU stimata su valore di mercato |
| `FIXED_ANNUAL_COSTS` | €5,200 | Piscina, giardino, utenze, TARI |

---

## 8. Fonti Principali

1. **Casevacanza.it** — Tariffe medie affitti di lusso Isola d'Elba (dati stagione 2023–2024)
2. **Globalpropertyguide.com** — Italy Gross Rental Yields: https://www.globalpropertyguide.com/europe/italy
3. **D.L. 50/2017, art. 4** — Disciplina delle locazioni brevi, cedolare secca 21%
4. **Legge 213/2023 (Legge di Bilancio 2024)** — Modifica aliquota cedolare secca per pluriproprietari al 26%
5. **D.Lgs. 23/2011** — Istituzione IMU e disciplina seconda casa
6. **Confturismo / STR (2023)** — Costi gestione locazione breve in Italia, range 18–28%
7. **Formula PMT** — Standard internazionale, verificabile con Excel `=PMT(r/12; n*12; -C)`

---

## 9. Avvertenze

- Il simulatore fornisce **stime orientative** basate su medie di mercato.
- I costi reali (in particolare IMU, manutenzione, gestione) variano significativamente per ogni proprietà.
- La cedolare secca si applica solo se il proprietario sceglie questo regime e il contratto rientra nella definizione di locazione breve (≤30 giorni, uso abitativo, anche tramite piattaforme).
- Non costituisce consulenza fiscale, legale o finanziaria.
- Per una valutazione precisa, consultare un commercialista abilitato e un agente immobiliare locale.

---

*Documento generato per il progetto Elba Luce Villas. Per aggiornamenti ai calcoli, modificare `InvestmentSimulatorModal.tsx` e aggiornare questo documento contestualmente.*

---

## 10. Architettura Tecnica del Simulatore — Know-How

Questa sezione documenta la struttura del componente per riutilizzarlo in altri progetti (immobiliare, energia, finanza, leasing, ecc.).

---

### 10.1 Struttura del File

```
components/sections/InvestmentSimulatorModal.tsx   ← componente unico self-contained
app/globals.css                                    ← .simulator-slider, .sim-scroll
```

Il simulatore è **completamente self-contained**: trigger button + Dialog + tutta la logica sono in un unico file. Il parent (`InvestmentSection.tsx`) importa solo `<InvestmentSimulatorModal />` senza passare props.

---

### 10.2 Stack e Dipendenze

| Dipendenza | Versione | Utilizzo |
|---|---|---|
| Next.js App Router | 16 | Server component può importare il client component |
| `"use client"` | — | Necessario: useState, useRef, useEffect, Framer Motion |
| Framer Motion | 12 | Animazioni, AnimatePresence, useSpring, useTransform |
| shadcn/ui `Dialog` | base-ui/react | Modal full-screen, `showCloseButton={false}` |
| lucide-react | — | Icone: Calculator, ChevronDown, TrendingUp, X, Info |
| Tailwind CSS v4 | — | Styling, `max-lg:hidden` per mobile tabs |

---

### 10.3 Pattern Architetturale

```
InvestmentSimulatorModal
│
├── CONSTANTS         (percentuali, valori fissi — modificare per ogni progetto)
├── Types             (Inputs, Results, Mode)
├── Pure functions    (pmt, compute, eur, yrs)
│
├── Sub-components    (definiti nello stesso file)
│   ├── AnimatedEur   (numero animato con useSpring)
│   ├── SimSlider     (slider con fill CSS custom property)
│   ├── YieldGauge    (barra 0–12% con colori semantici)
│   ├── CostRow       (voce costo con barra proporzionale)
│   └── Tile          (metric card, variante accent/warn)
│
└── Main component
    ├── State         (open, mode, inputs, costsOpen, mobileTab, scroll hints)
    ├── Effects       (scroll hint left, scroll hint right, reset tab on open)
    ├── Trigger       (button che apre il Dialog)
    └── Dialog
        ├── Header    (brand + mode toggle desktop + close)
        ├── Mode bar  (toggle diretto/mutuo — mobile)
        ├── Tab bar   (Parametri / Risultati — mobile only, lg:hidden)
        └── Body grid (lg: 2 colonne | mobile: 1 colonna con tabs)
            ├── LEFT  (sliders + scroll hint)
            └── RIGHT (risultati + scroll hint)
```

---

### 10.4 Il Pattern dello Slider

Il problema classico degli `input[type=range]` è il fill parziale: il browser non lo supporta nativamente su tutti i browser. La soluzione usata:

```css
/* globals.css */
.simulator-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  /* Fill via CSS custom property — aggiornata da React al cambio valore */
  background: linear-gradient(
    to right,
    rgba(255,255,255,.65) 0%,
    rgba(255,255,255,.65) var(--slider-pct, 0%),
    rgba(255,255,255,.1)  var(--slider-pct, 0%),
    rgba(255,255,255,.1)  100%
  );
  padding: 10px 0; /* aumenta l'area di touch senza cambiare il look */
}

.simulator-slider::-webkit-slider-runnable-track {
  height: 2px;
  background: transparent; /* il background è sull'input, non sul track */
}

.simulator-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  margin-top: -8px; /* centra il thumb: -(thumbH - trackH) / 2 = -(18-2)/2 */
}
```

```tsx
// Nel componente React
function SimSlider({ value, min, max, ... }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <input
      type="range"
      className="simulator-slider w-full"
      style={{ "--slider-pct": `${pct}%` } as unknown as CSSProperties}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}
```

**Riutilizzo**: copiare `.simulator-slider` in `globals.css` e il componente `SimSlider`. Funziona su qualsiasi sfondo — cambiare solo i colori `rgba(255,255,255,...)` con quelli del progetto.

---

### 10.5 Il Pattern del Numero Animato

Ogni volta che un valore cambia (slider mosso), i numeri nel pannello risultati contano fluidamente dal vecchio al nuovo valore tramite una spring fisica di Framer Motion:

```tsx
import { useSpring, useTransform, motion } from "framer-motion"
import { useEffect } from "react"

function AnimatedEur({ value }: { value: number }) {
  const reduced = useReducedMotion()

  // Spring fisica: stiffness e damping controllano velocità e rimbalzo
  const spring  = useSpring(value, { stiffness: 90, damping: 20 })

  // Quando il valore cambia, la spring si muove verso il nuovo target
  useEffect(() => { spring.set(value) }, [value, spring])

  // useTransform crea un MotionValue derivato — formattato come valuta
  const display = useTransform(spring, (v) =>
    new Intl.NumberFormat("it-IT", {
      style: "currency", currency: "EUR", maximumFractionDigits: 0
    }).format(Math.round(v))
  )

  // Se l'utente ha impostato prefers-reduced-motion, mostra il valore statico
  if (reduced) return <span>{eur(value)}</span>

  // motion.span è necessario per consumare un MotionValue come testo
  return <motion.span>{display}</motion.span>
}
```

**Adattare per altri formati:**

```tsx
// Percentuale
const display = useTransform(spring, (v) => `${v.toFixed(1)}%`)

// Anni
const display = useTransform(spring, (v) => `${Math.round(v)} anni`)

// Numero generico con separatore italiano
const display = useTransform(spring, (v) =>
  new Intl.NumberFormat("it-IT").format(Math.round(v))
)
```

---

### 10.6 Il Pattern della Logica di Calcolo Separata

Tutta la matematica è in **funzioni pure** fuori dal componente React — nessun hook, nessun side effect. Questo le rende testabili e portabili:

```tsx
// Tipi
interface Inputs { price: number; nightsPerMonth: number; nightlyRate: number; ... }
interface Results { grossIncome: number; netIncome: number; netYield: number; ... }
type Mode = "direct" | "mortgage"

// Costanti di mercato — l'unica cosa che cambia tra progetti
const MANAGEMENT_FEE_PCT = 0.22
const CEDOLARE_SECCA_PCT  = 0.21
// ...

// Funzione pura: nessuna dipendenza da React, testabile con Jest/Vitest
function compute(inp: Inputs, mode: Mode): Results {
  const grossIncome    = inp.nightsPerMonth * 12 * inp.nightlyRate
  const managementCost = grossIncome * MANAGEMENT_FEE_PCT
  // ...
  return { grossIncome, netIncome, netYield, ... }
}
```

Nel componente si usa semplicemente:

```tsx
const R = compute(inputs, mode)
// R.netIncome, R.netYield, R.paybackYears, ecc.
```

**Vantaggi**: si possono testare i calcoli senza montare React, si possono esportare in un file `lib/simulator.ts` separato se il progetto cresce, e si possono riusare in API route per calcoli server-side.

---

### 10.7 Il Pattern dei Pannelli Scrollabili Senza Scrollbar

```css
/* globals.css */
.sim-scroll { scrollbar-width: none; -ms-overflow-style: none; }
.sim-scroll::-webkit-scrollbar { display: none; }
```

```tsx
{/* Wrapper relativo — prende l'altezza dalla griglia */}
<div className="relative">

  {/* Contenuto scrollabile — occupa tutto il wrapper */}
  <div ref={scrollRef} className="sim-scroll absolute inset-0 overflow-y-auto px-8 py-9">
    {/* contenuto */}
  </div>

  {/* Gradiente fisso — fuori dal div scrollabile, non scorre */}
  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16
                  bg-gradient-to-t from-[#0d1a18] to-transparent" />

  {/* Hint "scorri" — appare solo quando c'è overflow e non si è in fondo */}
  <AnimatePresence>
    {showHint && (
      <motion.div
        key="hint"
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
        className="pointer-events-none absolute bottom-3 left-0 right-0
                   flex flex-col items-center gap-1"
      >
        <span className="text-[0.58rem] uppercase tracking-[0.3em] text-white/65">scorri</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown className="size-3 text-white/55" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

```tsx
// Hook per gestire lo stato dell'hint
useEffect(() => {
  const el = scrollRef.current
  if (!el || !open) return
  const check = () => {
    const canScroll = el.scrollHeight > el.clientHeight + 4
    const atBottom  = el.scrollTop + el.clientHeight >= el.scrollHeight - 16
    setShowHint(canScroll && !atBottom)
  }
  const t = setTimeout(check, 200) // attende animazioni di entrata
  el.addEventListener("scroll", check, { passive: true })
  const ro = new ResizeObserver(check) // detecta contenuto che cambia altezza
  ro.observe(el)
  return () => { clearTimeout(t); el.removeEventListener("scroll", check); ro.disconnect() }
}, [open, /* trigger esterno, es: costsOpen, mode */])
```

---

### 10.8 Il Pattern della Tab Bar Mobile (con Framer Motion layoutId)

Per evitare scroll verticale eccessivo su mobile quando ci sono due pannelli affiancati su desktop:

```tsx
type Tab = "params" | "results"
const [mobileTab, setMobileTab] = useState<Tab>("params")

// Reset quando il modal si apre
useEffect(() => { if (open) setMobileTab("params") }, [open])
```

```tsx
{/* Tab bar — visibile solo sotto lg */}
<div className="relative flex shrink-0 border-b border-white/8 lg:hidden">
  {(["params", "results"] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setMobileTab(tab)}
      className={cn(
        "relative flex flex-1 flex-col items-center gap-0.5 py-3 transition-colors",
        mobileTab === tab ? "text-white" : "text-white/30",
      )}
    >
      <span className="text-[0.6rem] uppercase tracking-[0.2em]">
        {tab === "params" ? "Parametri" : "Risultati"}
      </span>

      {/* Valore chiave nel tab inattivo — crea curiosità nell'utente */}
      {tab === "results" && (
        <span className={cn(
          "font-heading leading-none transition-all duration-300",
          mobileTab === "results" ? "text-[1.4rem] text-white" : "text-[1.15rem] text-white/55",
        )}>
          <AnimatedEur value={R.netIncome} />
        </span>
      )}

      {/* Underline animato che scivola tra i tab con layoutId */}
      {mobileTab === tab && (
        <motion.div
          layoutId="sim-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-px bg-white/40"
        />
      )}
    </button>
  ))}
</div>

{/* Pannelli — nascosti su mobile con max-lg:hidden in base al tab attivo */}
<div className={cn("relative ...", mobileTab === "results" && "max-lg:hidden")}>
  {/* pannello sinistra */}
</div>
<div className={cn("relative ...", mobileTab === "params" && "max-lg:hidden")}>
  {/* pannello destra */}
</div>
```

**Il trucco del `layoutId`**: Framer Motion tiene traccia dell'elemento con quel `layoutId` e quando si sposta tra i tab anima automaticamente la posizione. Non serve scrivere nessuna logica di animazione manuale.

---

### 10.9 Adattare il Simulatore ad Altri Settori

| Settore | Cosa cambiare |
| --- | --- |
| **Immobiliare residenziale** | Costanti fiscali (cedolare 21%), costi gestione, valori default |
| **Immobiliare commerciale** | Aggiungere IRAP, IVA, contratti 6+6 invece di affitti brevi |
| **Energia solare (ROI pannelli)** | `grossIncome` = risparmio bolletta + incentivi; costi = manutenzione, assicurazione |
| **Leasing auto aziendale** | `pmt()` riutilizzabile direttamente; aggiungere valore residuo |
| **Crowdfunding immobiliare** | Aggiungere quota percentuale investor, rendimento distribuito |
| **B&B / hotel boutique** | Aggiungere costo del lavoro, IVA su fatturato |

Le costanti da aggiornare sono sempre all'inizio del file, identificate con commenti che citano le fonti — questo pattern rende la manutenzione immediata.
