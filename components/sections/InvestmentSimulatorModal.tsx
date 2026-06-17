"use client"

import { useState } from "react"
import { X, TrendingUp, Calculator, Info } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ─── Market constants — researched from Italian luxury rental market ──────────
// Sources: Tuscany luxury villa yields 4-10% gross (propertyguide.com),
// Elba luxury avg €1,060/night (casevacanza.it), Italian property management 20-25%,
// Cedolare secca 21% (legge italiana affitti brevi), IMU second home ~0.86% catastale.

const MANAGEMENT_FEE_PCT  = 0.22   // Property management + platform: 22% of gross
const CEDOLARE_SECCA_PCT  = 0.21   // Italian flat rental tax on gross income
const MAINTENANCE_PCT     = 0.012  // Annual maintenance: 1.2% of purchase price
const INSURANCE_PCT       = 0.004  // Annual insurance: 0.4% of purchase price
const IMU_EFFECTIVE_PCT   = 0.002  // IMU approx effective rate on market value
const FIXED_ANNUAL_COSTS  = 5200   // Pool, garden, utilities, cleaning fixtures (€/yr)

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
  loanAmount: number
  monthlyMortgage: number
  annualMortgage: number
  cashFlow: number
  equityPayback: number
}

// ─── Mortgage PMT ─────────────────────────────────────────────────────────────

function pmt(principal: number, annualRatePct: number, years: number): number {
  if (annualRatePct === 0) return principal / (years * 12)
  const r = annualRatePct / 100 / 12
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ─── Core calculation ─────────────────────────────────────────────────────────

function compute(inputs: Inputs, mode: Mode): Results {
  const { price, nightsPerMonth, nightlyRate, downPaymentPct, interestRate, loanYears } = inputs

  const grossIncome     = nightsPerMonth * 12 * nightlyRate
  const managementCost  = grossIncome * MANAGEMENT_FEE_PCT
  const taxCost         = grossIncome * CEDOLARE_SECCA_PCT
  const maintenanceCost = price * MAINTENANCE_PCT
  const insuranceCost   = price * INSURANCE_PCT
  const imuCost         = price * IMU_EFFECTIVE_PCT
  const totalCosts      = managementCost + taxCost + maintenanceCost + insuranceCost + imuCost + FIXED_ANNUAL_COSTS
  const netIncome       = grossIncome - totalCosts
  const grossYield      = price > 0 ? (grossIncome / price) * 100 : 0
  const netYield        = price > 0 ? (netIncome / price) * 100 : 0
  const paybackYears    = netIncome > 0 ? price / netIncome : Infinity

  const downPayment     = price * (downPaymentPct / 100)
  const loanAmount      = price - downPayment
  const monthlyMortgage = mode === "mortgage" ? pmt(loanAmount, interestRate, loanYears) : 0
  const annualMortgage  = monthlyMortgage * 12
  const cashFlow        = mode === "mortgage" ? netIncome - annualMortgage : 0
  const equityPayback   = mode === "mortgage" && cashFlow > 0 ? downPayment / cashFlow : Infinity

  return {
    grossIncome, managementCost, taxCost, maintenanceCost, insuranceCost,
    imuCost, fixedCosts: FIXED_ANNUAL_COSTS, totalCosts, netIncome,
    grossYield, netYield, paybackYears,
    downPayment, loanAmount, monthlyMortgage, annualMortgage, cashFlow, equityPayback,
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderField({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  format: (v: number) => string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.68rem] uppercase tracking-[0.18em] text-white/50">{label}</span>
        <span className="font-heading text-xl text-white">{format(value)}</span>
      </div>
      <div className="relative h-px bg-white/15">
        <div className="absolute left-0 top-0 h-px bg-white/60 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-track w-full cursor-pointer"
        style={{ accentColor: "white" }}
      />
      <div className="flex justify-between text-[0.58rem] text-white/25">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

function CostRow({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/6">
      <div>
        <span className="text-xs text-white/50">{label}</span>
        {sub && <span className="ml-1.5 text-[0.58rem] text-white/25">({sub})</span>}
      </div>
      <span className="text-xs text-white/65 tabular-nums">{eur(value)}</span>
    </div>
  )
}

function MetricCard({ label, value, highlight = false, warn = false }: {
  label: string; value: string; highlight?: boolean; warn?: boolean
}) {
  return (
    <div className={cn(
      "flex flex-col gap-1 border p-4",
      highlight ? "border-white/20 bg-white/5" : "border-white/10 bg-transparent",
    )}>
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{label}</span>
      <span className={cn(
        "font-heading text-2xl",
        warn ? "text-amber-300/80" : "text-white",
      )}>{value}</span>
    </div>
  )
}

// ─── Default inputs ───────────────────────────────────────────────────────────

const DEFAULTS: Inputs = {
  price: 850000,
  nightsPerMonth: 20,
  nightlyRate: 850,
  downPaymentPct: 30,
  interestRate: 4.5,
  loanYears: 20,
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function InvestmentSimulatorModal() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("direct")
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const [showCosts, setShowCosts] = useState(false)

  const set = (key: keyof Inputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }))

  const R = compute(inputs, mode)
  const cashFlowPositive = R.cashFlow >= 0

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-5 inline-flex items-center gap-2.5 text-[0.7rem] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white/90"
      >
        <Calculator className="size-3.5 transition-transform group-hover:scale-110" />
        <span className="relative">
          Simula il tuo investimento
          <span className="absolute -bottom-px left-0 h-px w-0 bg-white/40 transition-all duration-300 group-hover:w-full" />
        </span>
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-0 flex max-h-none max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto rounded-none border-0 bg-[#0d1a18] p-0 text-white shadow-none ring-0 data-open:zoom-in-100 sm:max-w-none"
          style={{ width: "100vw", height: "100dvh" }}
        >
          <DialogTitle className="sr-only">Simulatore di investimento Elba Luce Villas</DialogTitle>

          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1a18]/95 px-6 py-4 backdrop-blur-sm sm:px-10">
            <div className="flex items-center gap-4">
              <TrendingUp className="size-4 text-white/40" />
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">Elba Luce Villas</p>
                <p className="font-heading text-lg leading-none text-white">Simulatore Investimento</p>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="hidden items-center gap-1 border border-white/12 p-0.5 sm:flex">
              {(["direct", "mortgage"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.18em] transition-all",
                    mode === m ? "bg-white text-[#172522]" : "text-white/45 hover:text-white/70",
                  )}
                >
                  {m === "direct" ? "Acquisto diretto" : "Con mutuo"}
                </button>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="flex size-10 items-center justify-center border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white"
              aria-label="Chiudi"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Mobile mode toggle */}
          <div className="flex items-center gap-1 border-b border-white/10 p-4 sm:hidden">
            {(["direct", "mortgage"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex-1 py-2 text-[0.62rem] uppercase tracking-[0.14em] transition-all",
                  mode === m ? "bg-white text-[#172522]" : "border border-white/15 text-white/45",
                )}
              >
                {m === "direct" ? "Diretto" : "Con mutuo"}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="grid flex-1 gap-0 lg:grid-cols-[1fr_420px]">

            {/* ── Left: Inputs ─────────────────────────────────── */}
            <div className="border-r border-white/8 px-6 py-8 sm:px-10 sm:py-10">
              <p className="mb-8 text-[0.62rem] uppercase tracking-[0.28em] text-white/30">
                Parametri
              </p>

              <div className="space-y-8">
                <SliderField
                  label="Prezzo di acquisto"
                  value={inputs.price}
                  min={400000} max={2500000} step={50000}
                  format={(v) => eur(v)}
                  onChange={set("price")}
                />
                <SliderField
                  label="Notti in affitto al mese"
                  value={inputs.nightsPerMonth}
                  min={5} max={28} step={1}
                  format={(v) => `${v} notti`}
                  onChange={set("nightsPerMonth")}
                />
                <SliderField
                  label="Tariffa media per notte"
                  value={inputs.nightlyRate}
                  min={300} max={2000} step={50}
                  format={(v) => eur(v)}
                  onChange={set("nightlyRate")}
                />

                {mode === "mortgage" && (
                  <div className="space-y-8 border-t border-white/10 pt-8">
                    <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/30">Mutuo</p>
                    <SliderField
                      label="Acconto iniziale"
                      value={inputs.downPaymentPct}
                      min={20} max={50} step={5}
                      format={(v) => `${v}% — ${eur(inputs.price * v / 100)}`}
                      onChange={set("downPaymentPct")}
                    />
                    <SliderField
                      label="Tasso d'interesse annuo"
                      value={inputs.interestRate}
                      min={2.5} max={7} step={0.1}
                      format={(v) => `${v.toFixed(1)}%`}
                      onChange={set("interestRate")}
                    />
                    <SliderField
                      label="Durata del mutuo"
                      value={inputs.loanYears}
                      min={10} max={30} step={5}
                      format={(v) => `${v} anni`}
                      onChange={set("loanYears")}
                    />
                  </div>
                )}

                <p className="flex items-start gap-2 pt-2 text-[0.62rem] leading-relaxed text-white/25">
                  <Info className="mt-px size-3 shrink-0" />
                  Stime basate su dati medi di mercato per ville di lusso all&apos;Isola d&apos;Elba
                  (Casevacanza.it, Globalpropertyguide.com, normativa cedolare secca 21%).
                  Non costituisce consulenza finanziaria o fiscale.
                </p>
              </div>
            </div>

            {/* ── Right: Results ───────────────────────────────── */}
            <div className="bg-[#0a1512] px-6 py-8 sm:px-10 sm:py-10">
              <p className="mb-8 text-[0.62rem] uppercase tracking-[0.28em] text-white/30">
                Proiezione annuale
              </p>

              {/* Gross income */}
              <div className="mb-6 border-b border-white/10 pb-6">
                <p className="mb-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/35">
                  Rendita lorda annua
                </p>
                <p className="font-heading text-4xl text-white">{eur(R.grossIncome)}</p>
                <p className="mt-1 text-xs text-white/30">
                  {inputs.nightsPerMonth * 12} notti × {eur(inputs.nightlyRate)}
                </p>
              </div>

              {/* Costs breakdown (collapsible) */}
              <div className="mb-6 border-b border-white/10 pb-6">
                <button
                  onClick={() => setShowCosts((v) => !v)}
                  className="mb-3 flex w-full items-center justify-between"
                >
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/35">
                    Costi stimati annui
                  </span>
                  <span className="font-heading text-xl text-white/70">
                    {eur(R.totalCosts)}
                  </span>
                </button>
                {showCosts && (
                  <div className="mt-2">
                    <CostRow label="Gestione locativa" value={R.managementCost} sub="22% del lordo" />
                    <CostRow label="Cedolare secca" value={R.taxCost} sub="21% del lordo" />
                    <CostRow label="Manutenzione" value={R.maintenanceCost} sub="1.2% del prezzo" />
                    <CostRow label="Assicurazione" value={R.insuranceCost} sub="0.4% del prezzo" />
                    <CostRow label="IMU e tasse locali" value={R.imuCost} sub="~0.2% del prezzo" />
                    <CostRow label="Utenze, piscina, giardino" value={R.fixedCosts} />
                  </div>
                )}
                {!showCosts && (
                  <button onClick={() => setShowCosts(true)} className="mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-white/25 hover:text-white/50">
                    Mostra dettaglio →
                  </button>
                )}
              </div>

              {/* Net income highlight */}
              <div className="mb-8 border border-white/15 bg-white/4 p-5">
                <p className="mb-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/40">Rendita netta annua</p>
                <p className={cn("font-heading text-5xl", R.netIncome < 0 && "text-amber-300/70")}>
                  {eur(R.netIncome)}
                </p>
                {R.netIncome < 0 && (
                  <p className="mt-2 text-[0.65rem] text-amber-300/60">
                    Rendita insufficiente a coprire i costi con questi parametri
                  </p>
                )}
              </div>

              {/* Key metrics grid */}
              <div className="mb-6 grid grid-cols-2 gap-2">
                <MetricCard label="Rendimento netto" value={`${R.netYield.toFixed(1)}%`} />
                <MetricCard label="Rendimento lordo" value={`${R.grossYield.toFixed(1)}%`} />
                {mode === "direct" ? (
                  <MetricCard label="Break-even" value={yrs(R.paybackYears)} highlight />
                ) : (
                  <>
                    <MetricCard
                      label="Rata mensile mutuo"
                      value={eur(R.monthlyMortgage)}
                    />
                    <MetricCard
                      label="Cash flow annuo"
                      value={cashFlowPositive ? eur(R.cashFlow) : `-${eur(Math.abs(R.cashFlow))}`}
                      highlight={cashFlowPositive}
                      warn={!cashFlowPositive}
                    />
                  </>
                )}
              </div>

              {mode === "mortgage" && isFinite(R.equityPayback) && R.equityPayback > 0 && (
                <div className="mb-6 border border-white/10 p-4">
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/35">Rientro sull&apos;acconto</p>
                  <p className="font-heading text-2xl text-white mt-1">{yrs(R.equityPayback)}</p>
                  <p className="mt-1 text-[0.58rem] text-white/25">Anni per recuperare l&apos;acconto versato di {eur(R.downPayment)}</p>
                </div>
              )}

              {/* CTA */}
              <a
                href="#contatti"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-12 w-full items-center justify-center bg-white text-[0.7rem] uppercase tracking-[0.18em] text-[#172522] transition hover:bg-[#ede7d9]"
              >
                Richiedi il dossier riservato →
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
