import { useEffect, useState } from 'react'

/** Suit le pointeur pour un halo doré discret (désactivé tactile / reduced-motion). */
export function usePointerGlow(enabled = true) {
  const [pos, setPos] = useState({ x: 50, y: 20, active: false })

  useEffect(() => {
    if (!enabled) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return undefined

    let frame = 0
    let next = { x: 50, y: 20 }

    const onMove = (e) => {
      next = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      }
      if (!frame) {
        frame = requestAnimationFrame(() => {
          setPos({ ...next, active: true })
          frame = 0
        })
      }
    }

    const onLeave = () => setPos((p) => ({ ...p, active: false }))

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [enabled])

  return pos
}
