import { useEffect, useRef, useState } from 'react'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatMoney } from '../utils/format'

export default function AnimatedMoney({
  value,
  currency,
  compact = false,
  duration = 900,
  className = '',
}) {
  const animated = useAnimatedNumber(value ?? 0, { duration })
  const ready = value != null && !Number.isNaN(value)
  const prev = useRef(value)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (value == null || prev.current === value) return undefined
    prev.current = value
    setPulse(true)
    const t = setTimeout(() => setPulse(false), 700)
    return () => clearTimeout(t)
  }, [value])

  return (
    <span
      className={[
        'tabular-nums inline-block will-change-transform',
        pulse ? 'value-pulse' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {ready ? formatMoney(animated, currency, { compact }) : '—'}
    </span>
  )
}
