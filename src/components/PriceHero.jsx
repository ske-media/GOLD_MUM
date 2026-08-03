import { formatMoney, formatPercent } from '../utils/format'
import { Skeleton } from './Skeleton'

function Trend({ changePercent }) {
  if (changePercent == null) return null

  const up = changePercent >= 0
  const color = up ? 'text-sage' : 'text-brick'

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <span className="text-sm tracking-wide" aria-hidden="true">
        {up ? '↑' : '↓'}
      </span>
      <span className="font-display text-xl tracking-wide">
        {formatPercent(changePercent)}
      </span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
        aujourd&apos;hui
      </span>
    </div>
  )
}

export default function PriceHero({ quote, loading, currency }) {
  if (loading || !quote) {
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

  return (
    <section className="animate-fade-up-delay-1">
      <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-ivory-faint">
        Or fin · 24 carats
      </p>

      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <h2 className="font-display text-[4.25rem] leading-none tracking-tight text-ivory sm:text-[5rem]">
          {formatMoney(quote.pricePerGram, currency)}
        </h2>
        <span className="mb-2 text-sm tracking-[0.12em] text-ivory-muted">
          / g
        </span>
      </div>

      <div className="mt-4">
        <Trend changePercent={quote.changePercent} />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            1 gramme
          </p>
          <p className="font-display text-2xl tracking-wide text-ivory">
            {formatMoney(quote.pricePerGram, currency)}
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
            1 kilogramme
          </p>
          <p className="font-display text-2xl tracking-wide text-gold-soft">
            {formatMoney(quote.pricePerKg, currency, { compact: true })}
          </p>
        </div>
      </div>
    </section>
  )
}
