"use client"

import { type CSSProperties, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { Calculator, ChevronDown, Info, TrendingUp, X } from "lucide-react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ─── Market constants ─────────────────────────────────────────────────────────
// Sources: Tuscany luxury yields 4-10% gross (globalpropertyguide.com),
// Elba luxury avg €1,060/notte (casevacanza.it), Italian property mgmt 20-25%,
// Cedolare secca 21% (D.L. 50/2017 art.4), IMU seconda casa ~0.86% catastale.

const MANAGEMENT_FEE_PCT = 0.22   // Gestione locativa + piattaforma
const CEDOLARE_SECCA_PCT = 0.21   // Imposta sostitutiva affitti brevi
const MAINTENANCE_PCT    = 0.012  // Manutenzione ordinaria annua
const INSURANCE_PCT      = 0.004  // Assicurazione immobile
const IMU_EFFECTIVE_PCT  = 0.002  // IMU effettiva su valore di mercato
const FIXED_ANNUAL_COSTS = 5200   // Piscina, giardino, utenze, pulizie

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "direct" | "mortgage"

interface Inputs {
  price: number
  nightsPerMonth: number
  nightlyRate: number
  downPaymentPct: number
  interestRate: number
  loanYears: number
}

interface Results {
  grossIncome: number
  managementCost: number
  taxCost: number
  maintenanceCost: number
  insuranceCost: number
  imuCost: number
  fixedCosts: number
  totalCosts: number
  netIncome: number
  grossYield: number
  netYield: number
  paybackYears: number
  downPayment: number
  monthlyMortgage: number
  annualMortgage: number
  cashFlow: number
  equityPayback: number
}

// ─── PMT mortgage formula ─────────────────────────────────────────────────────

function pmt(principal: number, annualRatePct: number, years: number): number {
  if (annualRatePct === 0) return principal / (years * 12)
  const r = annualRatePct / 100 / 12
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ─── Core calculation ─────────────────────────────────────────────────────────

function compute(inp: Inputs, mode: Mode): Results {
  const grossIncome     = inp.nightsPerMonth * 12 * inp.nightlyRate
  const managementCost  = grossIncome * MANAGEMENT_FEE_PCT
  const taxCost         = grossIncome * CEDOLARE_SECCA_PCT
  const maintenanceCost = inp.price * MAINTENANCE_PCT
  const insuranceCost   = inp.price * INSURANCE_PCT
  const imuCost         = inp.price * IMU_EFFECTIVE_PCT
  const totalCosts      = managementCost + taxCost + maintenanceCost + insuranceCost + imuCost + FIXED_ANNUAL_COSTS
  const netIncome       = grossIncome - totalCosts
  const grossYield      = inp.price > 0 ? (grossIncome / inp.price) * 100 : 0
  const netYield        = inp.price > 0 ? (netIncome / inp.price) * 100 : 0
  const paybackYears    = netIncome > 0 ? inp.price / netIncome : Infinity
  const downPayment     = inp.price * (inp.downPaymentPct / 100)
  const loanAmount      = inp.price - downPayment
  const monthlyMortgage = mode === "mortgage" ? pmt(loanAmount, inp.interestRate, inp.loanYears) : 0
  const annualMortgage  = monthlyMortgage * 12
  const cashFlow        = mode === "mortgage" ? netIncome - annualMortgage : 0
  const equityPayback   = mode === "mortgage" && cashFlow > 0 ? downPayment / cashFlow : Infinity
  return {
    grossIncome, managementCost, taxCost, maintenanceCost, insuranceCost,
    imuCost, fixedCosts: FIXED_ANNUAL_COSTS, totalCosts, netIncome,
    grossYield, netYield, paybackYears,
    downPayment, monthlyMortgage, annualMortgage, cashFlow, equityPayback,
  }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

const eur = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)

const yrs = (n: number) => {
  if (!isFinite(n) || n <= 0) return "—"
  if (n < 1) return "< 1 anno"
  if (n > 99) return "> 99 anni"
  return `${Math.round(n)} anni`
}

// ─── Animated number counter ─────────────────────────────────────────────────

function AnimatedEur({ value }: { value: number }) {
  const reduced = useReducedMotion()
  const spring  = useSpring(value, { stiffness: 90, damping: 20 })
  const display = useTransform(spring, (v) => eur(Math.round(v)))

  useEffect(() => { spring.set(value) }, [value, spring])

  if (reduced) return <span>{eur(value)}</span>
  return <motion.span>{display}</motion.span>
}

// ─── Slider ───────────────────────────────────────────────────────────────────

function SimSlider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number
  step: number; format: (v: number) => string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-white/45">{label}</span>
        <span className="font-heading text-lg leading-none text-white tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="simulator-slider w-full"
        style={{ "--slider-pct": `${pct}%` } as unknown as CSSProperties}
      />
      <div className="mt-1.5 flex justify-between text-[0.58rem] tabular-nums text-white/20">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

// ─── Yield gauge ─────────────────────────────────────────────────────────────

function YieldGauge({ netYield }: { netYield: number }) {
  const MAX = 12
  const fill = Math.max(0, Math.min((netYield / MAX) * 100, 100))
  const color =
    netYield < 2   ? "bg-amber-400/60"   :
    netYield >= 5  ? "bg-emerald-400/50" :
                     "bg-white/50"

  return (
    <div className="mt-3 space-y-1">
      <div className="relative h-0.5 w-full overflow-hidden bg-white/10">
        <motion.div
          className={cn("absolute left-0 top-0 h-full", color)}
          animate={{ width: `${fill}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-[0.55rem] text-white/20">
        <span>0%</span>
        <span>basso · medio · ottimo</span>
        <span>12%</span>
      </div>
    </div>
  )
}

// ─── Cost row ─────────────────────────────────────────────────────────────────

function CostRow({
  label, value, sub, totalCosts,
}: { label: string; value: number; sub?: string; totalCosts: number }) {
  const pct = totalCosts > 0 ? (value / totalCosts) * 100 : 0
  return (
    <div className="py-3 border-b border-white/6 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[0.68rem] text-white/55">{label}</span>
          {sub && <span className="text-[0.55rem] text-white/25">{sub}</span>}
        </div>
        <span className="text-[0.68rem] tabular-nums text-white/60">{eur(value)}</span>
      </div>
      <div className="h-px bg-white/8 overflow-hidden">
        <motion.div
          className="h-full bg-white/25"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// ─── Metric tile ─────────────────────────────────────────────────────────────

function Tile({
  label, value, accent = false, warn = false,
}: { label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className={cn(
      "flex flex-col gap-1.5 border px-4 py-3.5",
      accent ? "border-white/18 bg-white/5" : "border-white/8",
    )}>
      <span className="text-[0.58rem] uppercase tracking-[0.2em] text-white/35">{label}</span>
      <span className={cn(
        "font-heading text-xl leading-none",
        warn ? "text-amber-300/80" : "text-white",
      )}>
        {value}
      </span>
    </div>
  )
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULTS: Inputs = {
  price: 850000,
  nightsPerMonth: 20,
  nightlyRate: 850,
  downPaymentPct: 30,
  interestRate: 4.5,
  loanYears: 20,
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function InvestmentSimulatorModal() {
  const [open, setOpen]           = useState(false)
  const [mode, setMode]           = useState<Mode>("direct")
  const [inputs, setInputs]       = useState<Inputs>(DEFAULTS)
  const [costsOpen, setCostsOpen] = useState(false)
  const [mobileTab, setMobileTab]               = useState<"params" | "results">("params")
  const [showScrollHint, setShowScrollHint]     = useState(false)
  const [showRightHint, setShowRightHint]       = useState(false)
  const leftScrollRef  = useRef<HTMLDivElement>(null)
  const rightScrollRef = useRef<HTMLDivElement>(null)

  // Reset tab to params when modal opens
  useEffect(() => { if (open) setMobileTab("params") }, [open])

  // Left scroll hint — re-runs on mode change (mortgage adds sliders)
  useEffect(() => {
    const el = leftScrollRef.current
    if (!el || !open) return
    const check = () => {
      const canScroll = el.scrollHeight > el.clientHeight + 4
      const atBottom  = el.scrollTop + el.clientHeight >= el.scrollHeight - 16
      setShowScrollHint(canScroll && !atBottom)
    }
    const t = setTimeout(check, 200)
    el.addEventListener("scroll", check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { clearTimeout(t); el.removeEventListener("scroll", check); ro.disconnect() }
  }, [open, mode])

  // Right scroll hint — re-runs when costs accordion opens/closes
  useEffect(() => {
    const el = rightScrollRef.current
    if (!el || !open) return
    const check = () => {
      const canScroll = el.scrollHeight > el.clientHeight + 4
      const atBottom  = el.scrollTop + el.clientHeight >= el.scrollHeight - 16
      setShowRightHint(canScroll && !atBottom)
    }
    const t = setTimeout(check, 350) // accordion animation is 0.25s
    el.addEventListener("scroll", check, { passive: true })
    return () => { clearTimeout(t); el.removeEventListener("scroll", check) }
  }, [open, costsOpen])

  const set = (key: keyof Inputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }))

  const R = compute(inputs, mode)
  const cashPositive = R.cashFlow >= 0

  return (
    <>
      {/* ── Trigger ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex h-12 items-center justify-center gap-2.5 border border-white/20 px-6 text-[0.7rem] uppercase tracking-[0.18em] text-white/65 transition-all duration-200 hover:border-white/45 hover:text-white sm:px-8"
      >
        <Calculator className="size-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
        Simula il tuo investimento
      </button>

      {/* ── Modal ──────────────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 flex max-h-none max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#0d1a18] p-0 text-white shadow-none ring-0 data-open:zoom-in-100 sm:max-w-none"
          style={{ width: "100vw", height: "100dvh" }}
        >
          <DialogTitle className="sr-only">Simulatore di investimento Elba Luce Villas</DialogTitle>

          {/* ── Sticky header ─────────────────────────────── */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0d1a18]/95 px-5 py-3.5 backdrop-blur-sm sm:px-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="size-3.5 text-white/35" />
              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/30">Elba Luce Villas</p>
                <p className="font-heading text-base leading-tight text-white">Simulatore Investimento</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mode toggle — desktop */}
              <div className="hidden items-center gap-px border border-white/12 p-0.5 sm:flex">
                {(["direct", "mortgage"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "px-3.5 py-1.5 text-[0.6rem] uppercase tracking-[0.16em] transition-all",
                      mode === m ? "bg-white text-[#172522]" : "text-white/40 hover:text-white/65",
                    )}
                  >
                    {m === "direct" ? "Acquisto diretto" : "Con mutuo"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center border border-white/15 text-white/45 transition hover:border-white/40 hover:text-white"
                aria-label="Chiudi"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Mode toggle — mobile */}
          <div className="flex shrink-0 gap-px border-b border-white/10 bg-[#0d1a18] p-3 lg:hidden">
            {(["direct", "mortgage"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-2 text-[0.6rem] uppercase tracking-[0.14em] transition-all",
                  mode === m ? "bg-white text-[#172522]" : "border border-white/12 text-white/40",
                )}
              >
                {m === "direct" ? "Diretto" : "Con mutuo"}
              </button>
            ))}
          </div>

          {/* Tab bar — mobile only */}
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
                {tab === "results" && (
                  <span className={cn(
                    "font-heading leading-none transition-all duration-300",
                    mobileTab === "results"
                      ? "text-[1.4rem] text-white"
                      : "text-sm text-white/25",
                  )}>
                    <AnimatedEur value={R.netIncome} />
                  </span>
                )}
                {mobileTab === tab && (
                  <motion.div
                    layoutId="sim-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white/40"
                  />
                )}
              </button>
            ))}
          </div>

          {/* ── Body — 2-col on desktop, scrollable each ──── */}
          <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_400px]">

            {/* LEFT — inputs */}
            <div className={cn("relative border-r border-white/8", mobileTab === "results" && "max-lg:hidden")}>
            <div ref={leftScrollRef} className="sim-scroll absolute inset-0 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">
              <p className="mb-7 text-[0.6rem] uppercase tracking-[0.28em] text-white/25">Parametri</p>
              <div className="space-y-7">
                <SimSlider
                  label="Prezzo di acquisto"
                  value={inputs.price} min={400000} max={2500000} step={50000}
                  format={eur} onChange={set("price")}
                />
                <SimSlider
                  label="Notti in affitto al mese"
                  value={inputs.nightsPerMonth} min={5} max={28} step={1}
                  format={(v) => `${v} notti`} onChange={set("nightsPerMonth")}
                />
                <SimSlider
                  label="Tariffa media per notte"
                  value={inputs.nightlyRate} min={300} max={2000} step={50}
                  format={eur} onChange={set("nightlyRate")}
                />

                {mode === "mortgage" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-7 border-t border-white/10 pt-7"
                  >
                    <p className="text-[0.6rem] uppercase tracking-[0.28em] text-white/25">Mutuo</p>
                    <SimSlider
                      label="Acconto iniziale"
                      value={inputs.downPaymentPct} min={20} max={50} step={5}
                      format={(v) => `${v}% — ${eur(inputs.price * v / 100)}`}
                      onChange={set("downPaymentPct")}
                    />
                    <SimSlider
                      label="Tasso d'interesse annuo"
                      value={inputs.interestRate} min={2.5} max={7} step={0.1}
                      format={(v) => `${v.toFixed(1)}%`} onChange={set("interestRate")}
                    />
                    <SimSlider
                      label="Durata del mutuo"
                      value={inputs.loanYears} min={10} max={30} step={5}
                      format={(v) => `${v} anni`} onChange={set("loanYears")}
                    />
                  </motion.div>
                )}
              </div>

              <p className="mt-8 flex items-start gap-2 text-[0.58rem] leading-relaxed text-white/22">
                <Info className="mt-px size-3 shrink-0" />
                Stime basate su medie di mercato (Casevacanza.it, Globalpropertyguide.com,
                D.L.&nbsp;50/2017 cedolare secca). Non costituisce consulenza finanziaria o fiscale.
                Vedi CALCOLI_SIMULATORE.md per la metodologia completa.
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d1a18] to-transparent" />
            <AnimatePresence>
              {showScrollHint && (
                <motion.div
                  key="scroll-hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1"
                >
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/40">scorri</span>
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="size-2.5 text-white/35" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>

            {/* RIGHT — results */}
            <div className={cn("relative bg-[#090f0e]", mobileTab === "params" && "max-lg:hidden")}>
            <div ref={rightScrollRef} className="sim-scroll absolute inset-0 overflow-y-auto px-5 py-7 sm:px-8 sm:py-9">

              {/* 1. NET INCOME — always at top */}
              <div className="mb-6 border-b border-white/8 pb-6">
                <p className="mb-1 text-[0.6rem] uppercase tracking-[0.22em] text-white/30">
                  Rendita netta annua
                </p>
                <p className={cn(
                  "font-heading text-[2.6rem] leading-none",
                  R.netIncome < 0 ? "text-amber-300/75" : "text-white",
                )}>
                  <AnimatedEur value={R.netIncome} />
                </p>
                <YieldGauge netYield={R.netYield} />
                {R.netIncome < 0 && (
                  <p className="mt-2 text-[0.62rem] text-amber-300/55">
                    Rendita insufficiente a coprire i costi — abbassa il prezzo o aumenta le notti
                  </p>
                )}
              </div>

              {/* 2. METRICS GRID — always visible */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                <Tile label="Rendimento netto" value={`${R.netYield.toFixed(1)}%`} />
                <Tile label="Rendimento lordo" value={`${R.grossYield.toFixed(1)}%`} />
                {mode === "direct" ? (
                  <Tile label="Break-even" value={yrs(R.paybackYears)} accent />
                ) : (
                  <>
                    <Tile label="Rata mensile" value={eur(R.monthlyMortgage)} />
                    <Tile
                      label="Cash flow annuo"
                      value={cashPositive ? eur(R.cashFlow) : `−${eur(Math.abs(R.cashFlow))}`}
                      accent={cashPositive} warn={!cashPositive}
                    />
                  </>
                )}
                {mode === "mortgage" && isFinite(R.equityPayback) && R.equityPayback > 0 && (
                  <Tile
                    label="Rientro acconto"
                    value={yrs(R.equityPayback)}
                    accent
                  />
                )}
              </div>

              {/* 3. GROSS INCOME — secondary */}
              <div className="mb-1 border-t border-white/8 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25">
                    Rendita lorda annua
                  </span>
                  <span className="font-heading text-xl text-white/60">
                    <AnimatedEur value={R.grossIncome} />
                  </span>
                </div>
                <p className="mt-0.5 text-[0.58rem] text-white/20 tabular-nums">
                  {inputs.nightsPerMonth * 12} notti × {eur(inputs.nightlyRate)}
                </p>
              </div>

              {/* 4. COST ACCORDION — expands downward, below the metrics */}
              <div className="mt-3 border-t border-white/8 pt-4">
                <button
                  type="button"
                  onClick={() => setCostsOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-1 text-left"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25">
                    Costi stimati annui
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base text-white/50 tabular-nums">
                      <AnimatedEur value={R.totalCosts} />
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 text-white/30 transition-transform duration-200",
                        costsOpen && "rotate-180",
                      )}
                    />
                  </div>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: costsOpen ? "auto" : 0, opacity: costsOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <CostRow label="Gestione locativa" value={R.managementCost} sub="22% lordo" totalCosts={R.totalCosts} />
                    <CostRow label="Cedolare secca" value={R.taxCost} sub="21% lordo" totalCosts={R.totalCosts} />
                    <CostRow label="Manutenzione" value={R.maintenanceCost} sub="1.2% prezzo" totalCosts={R.totalCosts} />
                    <CostRow label="Assicurazione" value={R.insuranceCost} sub="0.4% prezzo" totalCosts={R.totalCosts} />
                    <CostRow label="IMU e tasse locali" value={R.imuCost} sub="~0.2% prezzo" totalCosts={R.totalCosts} />
                    <CostRow label="Utenze, piscina, giardino" value={R.fixedCosts} totalCosts={R.totalCosts} />
                  </div>
                </motion.div>
              </div>

              {/* 5. CTA */}
              <a
                href="#contatti"
                onClick={() => setOpen(false)}
                className="mt-7 flex h-12 w-full items-center justify-center bg-white text-[0.68rem] uppercase tracking-[0.18em] text-[#172522] transition hover:bg-[#ede7d9]"
              >
                Richiedi il dossier riservato →
              </a>
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#090f0e] to-transparent" />
            <AnimatePresence>
              {showRightHint && (
                <motion.div
                  key="right-scroll-hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-none absolute bottom-3 left-0 right-0 flex flex-col items-center gap-1"
                >
                  <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/40">scorri</span>
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <ChevronDown className="size-2.5 text-white/35" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
