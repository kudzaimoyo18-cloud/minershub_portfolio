"use client"

import createGlobe, { type COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

// Randomly scattered markers across UAE and Oman region
const generateRandomMarkers = (count: number) => {
  const markers = []
  for (let i = 0; i < count; i++) {
    // Generate random coordinates in UAE/Oman region
    const lat = 22 + Math.random() * 4 // 22-26°N
    const lng = 53 + Math.random() * 8 // 53-61°E
    const size = 0.05 + Math.random() * 0.05 // 0.05-0.1 size
    markers.push({ location: [lat, lng], size })
  }
  return markers
}

const GLOBE_CONFIG = {
  width: 600,
  height: 600,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0,
  dark: 1, // Dark mode (black globe)
  diffuse: 0.6, // Higher diffuse for cleaner surface (no grid effect)
  mapSamples: 16000,
  mapBrightness: 1.8,
  baseColor: [0, 0, 0], // Black globe
  markerColor: [1, 0.84, 0], // Gold markers (#FFD700)
  glowColor: [1, 0.84, 0], // Gold glow
  markers: generateRandomMarkers(15), // 15+ random markers scattered across UAE/Oman
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: any
}) {
  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      // Manual rotation only - no auto-rotation when not interacting
      if (!pointerInteracting.current) phi += 0
      state.phi = phi + r
      state.width = width * 2
      state.height = width * 2
    },
    [r],
  )

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "1"))
    return () => globe.destroy()
  }, [])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        style={{
          filter: "drop-shadow(0 0 40px rgba(255, 215, 0, 0.3))", // Gold glow effect (#FFD700)
          cursor: "grab",
        }}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
