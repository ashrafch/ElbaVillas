import {
  ACESFilmicToneMapping, DirectionalLight, Fog, HemisphereLight, Mesh, MeshStandardMaterial,
  PerspectiveCamera, PCFShadowMap, PointLight, RepeatWrapping, Scene, SRGBColorSpace, TextureLoader,
  TOUCH, Vector3, WebGLRenderer,
} from "three"
import type { Object3D } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js"

import { horizontalFit, modeAt, tourView, type Home, type MasterplanView } from "@/lib/masterplan"
import { createPovLook } from "./pov-look"
import { cameraFor, masterplan } from "./scene-data"
import { addSky, colorSea } from "./scene-materials"
import { createTour } from "./tour-camera"

type Marker = { x: number; y: number; visible: boolean }
type Status = "ready" | "unavailable"

function disposeScene(node: Object3D) {
  node.traverse((object) => {
    if (!(object instanceof Mesh)) return
    object.geometry.dispose()
    for (const material of [object.material].flat()) material.dispose()
  })
}

export function createMasterplan(
  host: HTMLDivElement,
  initialView: MasterplanView,
  onMarkers: (markers: Marker[]) => void,
  onStatus: (status: Status) => void,
) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.23
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  host.append(renderer.domElement)
  renderer.domElement.setAttribute("aria-hidden", "true")

  const scene = new Scene()
  scene.fog = new Fog("#b7c9c3", 165, 680)
  addSky(scene)
  scene.add(new HemisphereLight("#f1f0e3", "#989475", 2.0))
  const sun = new DirectionalLight("#ffe0b2", 2.7)
  sun.position.set(-89, 115, 107)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -112, right: 112, top: 105, bottom: -105, far: 356 })
  sun.shadow.camera.updateProjectionMatrix()
  sun.shadow.normalBias = 0.11
  sun.shadow.bias = -0.0006
  sun.shadow.radius = 2.5
  scene.add(sun)
  const roomLight = new PointLight("#ffdec0", 0, 13, 2)
  scene.add(roomLight)

  const camera = new PerspectiveCamera(43, 1, 0.07, 1800)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = false
  controls.enableDamping = true
  controls.dampingFactor = 0.12
  controls.rotateSpeed = 0.58
  controls.touches.ONE = TOUCH.ROTATE
  renderer.domElement.style.touchAction = "pan-y"
  const pov = createPovLook(renderer.domElement)
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const projected = new Vector3()
  const markerPositions = masterplan.plots.map((plot) => new Vector3().fromArray(plot.marker))
  const time = { value: 0 }
  const seaPhoto = new TextureLoader().load("/images/wave/sea.jpg")
  seaPhoto.wrapS = seaPhoto.wrapT = RepeatWrapping
  seaPhoto.colorSpace = SRGBColorSpace
  const fromPosition = new Vector3()
  const fromTarget = new Vector3()
  const nextPosition = new Vector3()
  const nextTarget = new Vector3()
  const gaze = new Vector3()
  let currentView = initialView
  let currentFov = 43
  let currentFit = horizontalFit(initialView.mode)
  let fromFov = 43
  let fromFit = currentFit
  let nextFov = 43
  let nextFit = currentFit
  let duration = 0
  let transitionStart = 0
  let guided = false
  let guideProgress = 0
  let requestedProgress = 0
  let bridgeStart = -Infinity
  let route: { plot: number; home: Home; sample: ReturnType<typeof createTour> } | undefined
  let model: Object3D | undefined
  let frame = 0
  let closed = false
  let contextLost = false
  let onScreen = true
  let lastDraw = 0

  function updateProjection() {
    const radians = Math.PI / 180
    const fit = 2 * Math.atan(Math.tan(currentFit * radians / 2) / camera.aspect) / radians
    camera.fov = Math.min(96, Math.max(fit, currentFov))
    camera.updateProjectionMatrix()
  }

  function configureView(view: MasterplanView) {
    const overview = view.mode === "overview"
    const plan = view.mode === "plan"
    controls.minPolarAngle = overview ? 0.24 : plan ? 0.15 : 0.61
    controls.maxPolarAngle = overview ? 1.12 : plan ? 0.85 : 1.43
    controls.minDistance = overview ? 105 : plan ? 16 : 23
    controls.maxDistance = overview ? 250 : plan ? 45 : 66
    markerPositions.forEach((_, i) => {
      const roof = model?.getObjectByName(`roof-${String(i + 1).padStart(2, "0")}`)
      if (roof) roof.visible = !plan || view.plot !== i
    })
    renderer.shadowMap.needsUpdate = true
  }

  function setView(view: MasterplanView, immediate = false) {
    const previous = currentView
    currentView = view
    const pose = cameraFor(view)
    guided = false
    controls.enabled = false
    configureView(view)
    nextPosition.fromArray(pose.position)
    nextTarget.fromArray(pose.target)
    nextFov = pose.fov
    nextFit = horizontalFit(view.mode)
    fromPosition.copy(camera.position)
    fromTarget.copy(controls.target)
    fromFov = currentFov
    fromFit = currentFit
    transitionStart = performance.now()
    duration = immediate || motion.matches ? 0
      : previous.mode === "overview" || view.mode === "overview" ? 1450 : 800
    pov.enable(false)
  }

  function follow(progress: number, plot: number, home: Home, immediate = false) {
    if (!route || route.plot !== plot || route.home !== home) route = { plot, home, sample: createTour(plot, home) }
    const view = tourView(modeAt(progress), plot, home)
    if (currentView.mode !== view.mode) configureView(view)
    route.sample(guideProgress, nextPosition, nextTarget)
    const movedOffRoute = controls.enabled &&
      (camera.position.distanceToSquared(nextPosition) + controls.target.distanceToSquared(nextTarget) > 0.12)
    if (!immediate && (movedOffRoute || (!guided && currentView.mode === "plan"))) {
      fromPosition.copy(camera.position)
      fromTarget.copy(controls.target)
      fromFov = currentFov
      fromFit = currentFit
      bridgeStart = performance.now()
    }
    currentView = view
    requestedProgress = progress
    controls.enabled = false
    guided = true
    if (immediate) {
      guideProgress = progress
      bridgeStart = -Infinity
      const sample = route.sample(progress, nextPosition, nextTarget)
      camera.position.copy(nextPosition)
      controls.target.copy(nextTarget)
      currentFov = sample.fov
      currentFit = sample.fit
      pov.enable(false)
    }
  }

  function draw(now: number) {
    if (closed) return
    frame = requestAnimationFrame(draw)
    if (!model || !onScreen || contextLost) return
    const delta = Math.min(240, now - lastDraw)
    lastDraw = now
    let settled = true
    let visibleMode = currentView.mode
    if (!controls.enabled) {
      if (guided && route) {
        const ease = motion.matches ? 1 : 1 - Math.exp(-delta / 76)
        guideProgress += (requestedProgress - guideProgress) * ease
        const atDestination = Math.abs(guideProgress - requestedProgress) < 0.00013
        if (atDestination) guideProgress = requestedProgress
        const { fov, fit, settled: atStop } = route.sample(guideProgress, nextPosition, nextTarget)
        const bridge = motion.matches ? 1 : Math.min(1, Math.max(0, (now - bridgeStart) / 540))
        const blend = bridge * bridge * (3 - 2 * bridge)
        camera.position.lerpVectors(fromPosition, nextPosition, blend)
        controls.target.lerpVectors(fromTarget, nextTarget, blend)
        currentFov = fromFov + (fov - fromFov) * blend
        currentFit = fromFit + (fit - fromFit) * blend
        visibleMode = modeAt(guideProgress)
        settled = atStop && atDestination && bridge === 1
      } else {
        const progress = duration ? Math.min(1, (now - transitionStart) / duration) : 1
        const eased = progress * progress * (3 - 2 * progress)
        camera.position.lerpVectors(fromPosition, nextPosition, eased)
        controls.target.lerpVectors(fromTarget, nextTarget, eased)
        currentFov = fromFov + (nextFov - fromFov) * eased
        currentFit = fromFit + (nextFit - fromFit) * eased
        settled = progress === 1
      }
      const canOrbit = visibleMode === "overview" || visibleMode === "facade" || visibleMode === "plan"
      pov.enable(!canOrbit && settled)
      camera.lookAt(pov.look(camera.position, controls.target, gaze, motion.matches))
      updateProjection()
      controls.enabled = settled && canOrbit
    }
    if (controls.enabled) controls.update()
    const indoor = visibleMode === "living" || visibleMode === "stairs" || visibleMode === "suite" || visibleMode === "bath"
    roomLight.intensity += ((indoor ? 26 : 0) - roomLight.intensity) * (motion.matches ? 1 : 0.2)
    if (roomLight.intensity > 0.01) {
      roomLight.position.copy(camera.position).lerp(controls.target, 0.23)
      roomLight.position.y += 0.96
    }
    if (!motion.matches) time.value = now * 0.001
    renderer.render(scene, camera)
    if (currentView.mode === "overview") {
      onMarkers(markerPositions.map((point) => {
        projected.copy(point).project(camera)
        return { x: (projected.x + 1) * 50, y: (1 - projected.y) * 50,
          visible: Math.abs(projected.x) < 0.95 && Math.abs(projected.y) < 0.95 && projected.z < 1 }
      }))
    }
  }

  const resize = new ResizeObserver(() => {
    const { clientWidth: width, clientHeight: height } = host
    if (!width || !height) return
    renderer.setSize(width, height)
    camera.aspect = width / height
    updateProjection()
  })
  const intersection = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting })
  resize.observe(host)
  intersection.observe(host)
  renderer.shadowMap.autoUpdate = false
  setView(initialView, true)
  const loseContext = (event: Event) => {
    event.preventDefault()
    contextLost = true
    onStatus("unavailable")
  }
  renderer.domElement.addEventListener("webglcontextlost", loseContext)
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load("/masterplan/elba-coast.glb", ({ scene: asset }) => {
    if (closed) return disposeScene(asset)
    model = asset
    asset.traverse((object) => {
      if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return
      const name = object.material.name
      object.receiveShadow = !object.material.transparent
      object.castShadow = !object.material.transparent && name !== "water"
      if (name === "water") colorSea(object.material, time, seaPhoto)
    })
    scene.add(asset)
    if (guided && route) {
      guideProgress = requestedProgress
      bridgeStart = -Infinity
      const sample = route.sample(guideProgress, nextPosition, nextTarget)
      camera.position.copy(nextPosition)
      controls.target.copy(nextTarget)
      currentFov = sample.fov
      currentFit = sample.fit
      configureView(currentView)
    } else {
      setView(currentView, true)
    }
    onStatus("ready")
  }, undefined, () => { if (!closed) onStatus("unavailable") })
  frame = requestAnimationFrame(draw)

  return {
    setView,
    follow,
    zoom(factor: number) {
      if (!controls.enabled) return
      projected.copy(camera.position).sub(controls.target)
      const distance = Math.min(controls.maxDistance, Math.max(controls.minDistance, projected.length() * factor))
      camera.position.copy(projected.setLength(distance).add(controls.target))
      controls.update()
    },
    dispose() {
      closed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      controls.dispose()
      pov.dispose()
      renderer.domElement.removeEventListener("webglcontextlost", loseContext)
      sun.shadow.dispose()
      disposeScene(scene)
      seaPhoto.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
