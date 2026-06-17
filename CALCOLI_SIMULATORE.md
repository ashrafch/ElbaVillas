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
