"use client"

import { useCallback, useEffect, useRef } from "react"

import { chapters, type TourMode } from "@/lib/masterplan"

export function useScrollJourney(onProgress: (progress: number) => void) {
  const track = useRef<HTMLElement>(null)
  const pinned = useRef<HTMLDivElement>(null)

  const seek = useCallback((mode: TourMode, behavior: ScrollBehavior = "smooth") => {
    const section = track.current
    const stage = pinned.current
    if (!section || !stage) return false
    const distance = section.offsetHeight - stage.offsetHeight
    if (distance < 2) return false
    const progress = chapters.find(chapter => chapter.mode === mode)!.progress
    window.scrollTo({
      top: window.scrollY + section.getBoundingClientRect().top + distance * progress,
      behavior,
    })
    return true
  }, [])

  useEffect(() => {
    const section = track.current
    const stage = pinned.current
    if (!section || !stage) return
    let frame = 0
    let previous = 0
    function update() {
      frame = 0
      if (!section || !stage) return
      const distance = section.offsetHeight - stage.offsetHeight
      if (distance < 2) {
        section.style.removeProperty("--story-progress")
        section.style.removeProperty("--story-outro")
        return
      }
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance))
      if (Math.abs(previous - progress) < 0.0001) return
      previous = progress
      section.style.setProperty("--story-progress", String(progress))
      section.style.setProperty("--story-outro", String(Math.max(0, (progress - 0.966) / 0.034)))
      onProgress(progress)
    }
    function queue() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    addEventListener("scroll", queue, { passive: true })
    addEventListener("resize", queue)
    queue()
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", queue)
      removeEventListener("resize", queue)
    }
  }, [onProgress])

  return { track, pinned, seek }
}
