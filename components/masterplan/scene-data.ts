import masterplan from "@/lib/masterplan-views.json"
import type { MasterplanView } from "@/lib/masterplan"

export { masterplan }

export function cameraFor(view: MasterplanView) {
  if (view.mode === "overview") return masterplan.overview
  const plot = masterplan.plots[view.plot]
  return view.mode === "facade" ? plot.facade : plot[view.home][view.mode]
}
