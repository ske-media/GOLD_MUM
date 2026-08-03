import { useRef } from 'react'
import AnimatedMoney from './AnimatedMoney'
import Hint from './Hint'
import InfoTip from './InfoTip'
import { formatPercent } from '../utils/format'
import { Skeleton } from './Skeleton'

function Trend({ changePercent }) {
  if (changePercent == null) return null

  const up = changePercent >= 0
  const color = up ? 'text-sage' : 'text-brick'

  return (
    <div className={`trend-pop flex flex-wrap items-center gap-x-2 gap-y-1 ${color}`}>
      <span className="trend-arrow text-base tracking-wide" aria-hidden="true">
        {up ? '↑' : '↓'}
      </span>
      <span className="font-display text-2xl tracking-wide tabular-nums">
        {formatPercent(changePercent)}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ivory-muted">
        aujourd&apos;hui
      </span>
      <InfoTip label="variation du jour">
        Écart du cours spot par rapport à la clôture de la veille. Positif =
        l’or a monté ; négatif = il a reculé.
      </InfoTip>
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
        <div className="grid grid-cols-1 gap-6 border-t border-line pt-8 min-[380px]:grid-cols-2">
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
          ? 'opacity-80 transition-opacity duration-500'
          : 'opacity-100 transition-opacity duration-500',
      ].join(' ')}
      aria-busy={loading || refreshing || isStale}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ivory-muted">
          Or fin · 24 carats
        </p>
        <InfoTip label="or fin 24 carats">
          Or d’investissement quasi pur (99,9 %). C’est la référence pour
          valoriser lingots et pièces — pas l’or joaillier 18 carats.
        </InfoTip>
      </div>

      <div
        ref={tiltRef}
        className="price-halo tilt-price flex flex-wrap items-end gap-x-3 gap-y-1"
      >
        <h2 className="font-display text-[clamp(2.75rem,12vw,5rem)] leading-[1.05] tracking-tight text-ivory break-words">
          <AnimatedMoney
            value={quote.pricePerGram}
            currency={displayCurrency}
            duration={1100}
          />
        </h2>
        <span className="mb-2 text-base tracking-[0.08em] text-ivory-muted">
          / g
        </span>
      </div>

      <Hint className="mt-3 max-w-md">
        Prix spot : le cours mondial de référence pour 1 gramme d’or pur. Base
        du marché, avant frais d’achat ou de revente.
      </Hint>

      <div className="mt-5">
        <Trend changePercent={quote.changePercent} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-7 border-t border-line pt-8 min-[380px]:grid-cols-2 min-[380px]:gap-5">
        <div className="crossfade space-y-2" style={{ animationDelay: '0.08s' }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ivory-muted">
            1 gramme
          </p>
          <p className="font-display text-[1.65rem] leading-tight tracking-wide text-ivory break-words sm:text-3xl">
            <AnimatedMoney
              value={quote.pricePerGram}
              currency={displayCurrency}
            />
          </p>
          <Hint>Unité courante pour l’or physique.</Hint>
        </div>
        <div className="crossfade space-y-2" style={{ animationDelay: '0.16s' }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ivory-muted">
            1 kilogramme
          </p>
          <p className="font-display text-[1.65rem] leading-tight tracking-wide text-gold break-words sm:text-3xl">
            <AnimatedMoney
              value={quote.pricePerKg}
              currency={displayCurrency}
              compact
              duration={1200}
            />
          </p>
          <Hint>Référence lingot (1&nbsp;000&nbsp;g).</Hint>
        </div>
      </div>
    </section>
  )
}
