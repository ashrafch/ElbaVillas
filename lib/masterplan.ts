export const interiorViews = [
  { id: "living", label: "Living", level: "Piano terra" },
  { id: "suite", label: "Camera", level: "Primo piano" },
  { id: "bath", label: "Bagno", level: "Primo piano" },
  { id: "terrace", label: "Loggia", level: "Primo piano" },
  { id: "plan", label: "Dall’alto", level: "Primo piano" },
] as const

export type InteriorView = (typeof interiorViews)[number]["id"] | "stairs"
export type Home = "A" | "B"

export type MasterplanView =
  | { mode: "overview" }
  | { mode: "facade"; plot: number }
  | { mode: InteriorView; plot: number; home: Home }

export const chapters = [
  { mode: "overview", progress: 0, label: "Vista aerea" },
  { mode: "facade", progress: 0.22, label: "Facciata" },
  { mode: "living", progress: 0.43, label: "Piano terra" },
  { mode: "stairs", progress: 0.58, label: "Scala" },
  { mode: "suite", progress: 0.71, label: "Primo piano" },
  { mode: "bath", progress: 0.81, label: "Bagno" },
  { mode: "terrace", progress: 0.95, label: "Loggia" },
] as const

export type TourMode = (typeof chapters)[number]["mode"]

export function tourView(mode: TourMode, plot: number, home: Home): MasterplanView {
  if (mode === "overview") return { mode }
  if (mode === "facade") return { mode, plot }
  return { mode, plot, home }
}

export function modeAt(progress: number): TourMode {
  for (let i = 1; i < chapters.length; i++) {
    const previous = chapters[i - 1]
    if (progress < previous.progress + (chapters[i].progress - previous.progress) * 0.58) return previous.mode
  }
  return "terrace"
}

export function horizontalFit(mode: MasterplanView["mode"]) {
  if (mode === "overview") return 51
  if (mode === "facade") return 43
  return 39
}

export function posterFor(view: MasterplanView) {
  if (view.mode === "overview") return "/masterplan/overview.jpg"
  if (view.mode === "facade") return `/masterplan/facade-${String(view.plot + 1).padStart(2, "0")}.jpg`
  return `/masterplan/${view.mode}-${view.home.toLowerCase()}.jpg`
}
