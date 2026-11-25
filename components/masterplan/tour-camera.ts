import { CatmullRomCurve3, Vector3 } from "three"

import { chapters, horizontalFit, tourView, type Home, type TourMode } from "@/lib/masterplan"

import { cameraFor, masterplan } from "./scene-data"

type CameraPose = { position: number[]; target: number[]; fov: number }

export function createTour(plot: number, home: Home) {
  const location = masterplan.plots[plot]
  const routes: Record<TourMode, CameraPose[]> = {
    overview: [],
    facade: [location.fly],
    ...location[home].path,
  }
  const routeSegments = chapters.slice(1).map((chapter, i) => {
    const previous = chapters[i]
    const start = cameraFor(tourView(previous.mode, plot, home))
    const end = cameraFor(tourView(chapter.mode, plot, home))
    const path = [start, ...routes[chapter.mode], end]
    const curve = (key: "position" | "target") => new CatmullRomCurve3(path.map(pose => new Vector3().fromArray(pose[key])))
    return {
      previous, chapter, start, end,
      curve: curve("position"),
      lookAt: curve("target"),
    }
  })

  return (progress: number, position: Vector3, target: Vector3) => {
    const segment = routeSegments.find(segment => progress <= segment.chapter.progress) ?? routeSegments[routeSegments.length - 1]
    const { previous, chapter, start, end } = segment
    const raw = Math.max(0, Math.min(1, (progress - previous.progress) / (chapter.progress - previous.progress)))
    const blend = raw * raw * (3 - 2 * raw)
    segment.curve.getPoint(blend, position)
    segment.lookAt.getPoint(blend, target)
    return {
      fov: start.fov + (end.fov - start.fov) * blend,
      fit: horizontalFit(previous.mode) + (horizontalFit(chapter.mode) - horizontalFit(previous.mode)) * blend,
      settled: raw < 0.008 || raw > 0.992,
    }
  }
}
