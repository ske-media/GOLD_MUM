import { useRef } from 'react'
import AnimatedMoney from './AnimatedMoney'
import { formatPercent } from '../utils/format'
import { Skeleton } from './Skeleton'

function Trend({ changePercent }) {
  if (changePercent == null) return null

  const up = changePercent >= 0
  const color = up ? 'text-sage' : 'text-brick'

  return (
    <div className={`trend-pop flex items-center gap-2 ${color}`}>
      <span className="trend-arrow text-sm tracking-wide" aria-hidden="true">
        {up ? '↑' : '↓'}
      </span>
      <span className="font-display text-xl tracking-wide tabular-nums">
        {formatPercent(changePercent)}
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
        aujourd&apos;hui
      </span>
    </div>
  )
}

export default function PriceHero({ quote, loading, currency, refreshing }) {
  const tiltRef = useRef(null)

  const onMove = (e) => {
    const node = tiltRef.current
    if (!node || window.matchMedia('(pointer: coarse)').matches) return
    const rect = node.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    node.style.setProperty('--tilt-y', `${px * 4}deg`)
    node.style.setProperty('--tilt-x', `${py * -3}deg`)
  }

  const onLeave = () => {
    const node = tiltRef.current
    if (!node) return
    node.style.setProperty('--tilt-y', '0deg')
    node.style.setProperty('--tilt-x', '0deg')
  }

  if (!quote) {
    return (
      <section className="animate-fade-up-delay-1 space-y-8" aria-busy="true">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-16 w-56 max-w-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex gap-10 border-t border-line pt-8">
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>
      </section>
    )
  }

  const displayCurrency = quote.currency || currency
  const isStale = quote.currency && quote.currency !== currency

  return (
    <section
      className={[
        'price-reveal',
        refreshing || isStale
          ? 'opacity-55 transition-opacity duration-500'
          : 'opacity-100 transition-opacity duration-500',
      ].join(' ')}
      aria-busy={loading || refreshing || isStale}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ivory-faint">
        Or fin · 24 carats
      </p>

      <div
        ref={tiltRef}
        className="price-halo tilt-price flex flex-wrap items-end gap-x-3 gap-y-1"
      >
        <h2 className="font-display text-[4.25rem] leading-none tracking-tight text-ivory sm:text-[5rem]">
          <AnimatedMoney
            value={quote.pricePerGram}
            currency={displayCurrency}
            duration={1100}
          />
        </h2>
        <span className="mb-2 text-sm tracking-[0.12em] text-ivory-muted">
          / g
        </span>
      </div>

      <div className="mt-4">
        <Trend changePercent={quote.changePercent} />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
        <div className="crossfade" style={{ animationDelay: '0.08s' }}>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            1 gramme
          </p>
          <p className="font-display text-2xl tracking-wide text-ivory">
            <AnimatedMoney
              value={quote.pricePerGram}
              currency={displayCurrency}
            />
          </p>
        </div>
        <div className="crossfade" style={{ animationDelay: '0.16s' }}>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            1 kilogramme
          </p>
          <p className="font-display text-2xl tracking-wide text-gold-soft">
            <AnimatedMoney
              value={quote.pricePerKg}
              currency={displayCurrency}
              compact
              duration={1200}
            />
          </p>
        </div>
      </div>
    </section>
  )
}
