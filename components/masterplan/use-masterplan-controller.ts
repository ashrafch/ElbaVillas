"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { chapters, modeAt, tourView, type Home, type MasterplanView } from "@/lib/masterplan"

import type { createMasterplan } from "./scene-runtime"
import { useScrollJourney } from "./use-scroll-journey"

type Renderer = ReturnType<typeof createMasterplan>
export const overview: MasterplanView = { mode: "overview" }

function sameView(left: MasterplanView, right: MasterplanView) {
  if (left.mode !== right.mode) return false
  if (left.mode === "overview" || right.mode === "overview") return true
  if (left.plot !== right.plot) return false
  return !("home" in left) || ("home" in right && left.home === right.home)
}

export function useMasterplanController() {
  const [view, setView] = useState<MasterplanView>(overview)
  const [live, setLive] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const dissolve = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const markerButtons = useRef<Array<HTMLButtonElement | null>>([])
  const runtime = useRef<Renderer | null>(null)
  const current = useRef<MasterplanView>(overview)
  const selection = useRef({ plot: 1, home: "A" as Home, progress: 0, manual: false })
  const focusOn = useRef<MasterplanView["mode"] | undefined>(undefined)
  const fade = useRef<Animation | null>(null)

  const describe = useCallback((next: MasterplanView) => {
    if (sameView(current.current, next)) return
    current.current = next
    setView(next)
  }, [])

  const onProgress = useCallback((progress: number) => {
    const active = selection.current
    active.progress = progress
    active.manual = false
    const next = tourView(modeAt(progress), active.plot, active.home)
    describe(next)
    runtime.current?.follow(progress, active.plot, active.home)
  }, [describe])

  const { track, pinned, seek } = useScrollJourney(onProgress)

  const changeView = useCallback((next: MasterplanView, focus = false) => {
    const active = selection.current
    const previous = current.current
    fade.current?.cancel()
    function go(covered = false) {
      if ("plot" in next) active.plot = next.plot
      if ("home" in next) active.home = next.home
      if (focus) focusOn.current = next.mode
      if (next.mode !== "plan" && seek(next.mode, covered ? "instant" : "smooth")) {
        if (covered) {
          const progress = chapters.find(chapter => chapter.mode === next.mode)!.progress
          active.progress = progress
          active.manual = false
          describe(next)
          runtime.current?.follow(progress, active.plot, active.home, true)
        } else {
          onProgress(active.progress)
        }
      } else {
        active.manual = true
        describe(next)
        runtime.current?.setView(next)
      }
    }

    // A different unit is reached through a dissolve, since the shared wall
    // has no opening between the two homes.
    const cover = dissolve.current
    const changesPlace = "home" in previous && previous.mode !== "plan" && "plot" in next &&
      (previous.plot !== next.plot || ("home" in next && previous.home !== next.home))
    if (!changesPlace || !cover || matchMedia("(prefers-reduced-motion: reduce)").matches) return go()
    const coverIn = cover.animate({ opacity: [0, 1] }, { duration: 200, fill: "forwards" })
    fade.current = coverIn
    coverIn.finished.then(() => {
      go(true)
      fade.current = cover.animate({ opacity: [1, 0] }, { duration: 490, delay: 65, fill: "both" })
      coverIn.cancel()
    }).catch(() => {})
  }, [describe, onProgress, seek])

  useEffect(() => {
    if (focusOn.current !== view.mode) return
    focusOn.current = undefined
    title.current?.focus({ preventScroll: true })
  }, [view])

  useEffect(() => {
    let active = true
    import("./scene-runtime").then(({ createMasterplan }) => {
      if (!active || !stage.current) return
      runtime.current = createMasterplan(stage.current, current.current, (positions) => {
        for (const [i, point] of positions.entries()) {
          const marker = markerButtons.current[i]
          if (!marker) continue
          marker.style.left = `${point.x}%`
          marker.style.top = `${point.y}%`
          marker.style.visibility = point.visible ? "visible" : "hidden"
        }
      }, (status) => setLive(status === "ready"))
      const { progress, plot, home, manual } = selection.current
      if (!manual && progress > 0) runtime.current.follow(progress, plot, home)
    }).catch(() => { if (active) setLive(false) })
    return () => {
      active = false
      fade.current?.cancel()
      runtime.current?.dispose()
      runtime.current = null
    }
  }, [])

  return { view, live, stage, dissolve, title, markerButtons, runtime, track, pinned, changeView }
}
