import { Spherical, Vector3 } from "three"

export function createPovLook(canvas: HTMLCanvasElement) {
  const spherical = new Spherical()
  const direction = new Vector3()
  let active = false
  let drag: { id: number; x: number; y: number } | undefined
  let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0

  function down(event: PointerEvent) {
    if (!active || event.button !== 0 || drag) return
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY }
    canvas.setPointerCapture(event.pointerId)
  }

  function move(event: PointerEvent) {
    if (drag?.id !== event.pointerId) return
    targetYaw = Math.max(-1.22, Math.min(1.22, targetYaw - (event.clientX - drag.x) * 0.006))
    targetPitch = Math.max(-0.64, Math.min(0.64, targetPitch + (event.clientY - drag.y) * 0.005))
    drag.x = event.clientX
    drag.y = event.clientY
  }

  function up(event: PointerEvent) {
    if (drag?.id === event.pointerId) drag = undefined
  }

  canvas.addEventListener("pointerdown", down)
  canvas.addEventListener("pointermove", move)
  canvas.addEventListener("lostpointercapture", up)

  return {
    enable(value: boolean) {
      active = value
      if (!value) {
        drag = undefined
        targetYaw = 0
        targetPitch = 0
      }
    },
    look(position: Vector3, target: Vector3, result: Vector3, immediate: boolean) {
      const amount = immediate ? 1 : 0.2
      yaw += (targetYaw - yaw) * amount
      pitch += (targetPitch - pitch) * amount
      spherical.setFromVector3(direction.copy(target).sub(position))
      spherical.theta += yaw
      spherical.phi = Math.max(0.07, Math.min(Math.PI - 0.07, spherical.phi + pitch))
      return result.setFromSpherical(spherical).add(position)
    },
    dispose() {
      canvas.removeEventListener("pointerdown", down)
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("lostpointercapture", up)
    },
  }
}
