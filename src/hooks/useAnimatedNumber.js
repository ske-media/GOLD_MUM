import { useEffect, useRef, useState } from 'react'

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Interpole un nombre vers sa cible avec une courbe expo douce.
 * Respecte prefers-reduced-motion.
 */
export function useAnimatedNumber(target, { duration = 900, decimals = 2 } = {}) {
  const [display, setDisplay] = useState(target ?? 0)
  const frameRef = useRef(0)
  const fromRef = useRef(target ?? 0)
  const startRef = useRef(0)

  useEffect(() => {
    if (target == null || Number.isNaN(target)) return undefined

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setDisplay(target)
      fromRef.current = target
      return undefined
    }

    const from = fromRef.current
    const to = target
    if (from === to) {
      setDisplay(to)
      return undefined
    }

    startRef.current = performance.now()
    cancelAnimationFrame(frameRef.current)

    const tick = (now) => {
      const progress = Math.min(1, (now - startRef.current) / duration)
      const value = from + (to - from) * easeOutExpo(progress)
      setDisplay(value)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        setDisplay(to)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration, decimals])

  return display
}
