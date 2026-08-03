import AnimatedMoney from './AnimatedMoney'
import {
  formatDisplayDate,
  formatGrams,
  formatPercent,
  todayISO,
} from '../utils/format'
import FeesControl from './FeesControl'
import { Skeleton } from './Skeleton'

function ResultRow({ label, value, accent = false, muted = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-ivory-faint">
        {label}
      </span>
      <span
        className={[
          'font-display text-xl tracking-wide tabular-nums',
          accent ? 'text-gold' : muted ? 'text-ivory-muted' : 'text-ivory',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  )
}

export default function Calculator({
  currency,
  date,
  onDateChange,
  grams,
  onGramsChange,
  feeMode,
  onFeeModeChange,
  feePercent,
  onFeePercentChange,
  feeFixed,
  onFeeFixedChange,
  loading,
  error,
  result,
}) {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">
          Voyage dans le temps
        </p>
        <h3 className="font-display text-3xl font-medium tracking-wide text-ivory">
          Calculateur de plus-value
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-ivory-muted">
          Choisissez une date et une quantité. La plus-value se calcule
          instantanément par rapport au cours actuel.
        </p>
      </header>

      <div className="soft-panel space-y-6 rounded-sm border border-line bg-ink-soft/40 p-5 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="field-line space-y-2">
            <label
              htmlFor="purchase-date"
              className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint"
            >
              Date d&apos;achat
            </label>
            <input
              id="purchase-date"
              type="date"
              max={todayISO()}
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full border-b border-transparent bg-transparent py-2 font-display text-xl text-ivory outline-none"
            />
          </div>

          <div className="field-line space-y-2">
            <label
              htmlFor="grams"
              className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint"
            >
              Quantité
            </label>
            <div className="relative">
              <input
                id="grams"
                type="number"
                min="0.1"
                step="0.1"
                value={grams}
                onChange={(e) => onGramsChange(Number(e.target.value) || 0)}
                className="w-full border-b border-transparent bg-transparent py-2 pr-10 font-display text-xl text-ivory outline-none"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tracking-[0.16em] text-ivory-faint">
                g
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <FeesControl
            mode={feeMode}
            onModeChange={onFeeModeChange}
            percent={feePercent}
            onPercentChange={onFeePercentChange}
            fixed={feeFixed}
            onFixedChange={onFeeFixedChange}
            currency={currency}
          />
        </div>
      </div>

      <div className="min-h-[12rem]">
        {loading && (
          <div className="space-y-4 transition-opacity duration-300" aria-busy="true">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        )}

        {!loading && error && (
          <p className="crossfade text-sm leading-relaxed text-brick">{error}</p>
        )}

        {!loading && !error && result && (
          <div
            key={`${result.date}-${result.grams}-${currency}-${Math.round(result.netGain)}`}
            className="stagger-children space-y-1 divide-y divide-line"
          >
            <p className="pb-4 text-xs text-ivory-muted">
              {formatGrams(result.grams)} g · acquis le{' '}
              {formatDisplayDate(result.date)}
            </p>

            <ResultRow
              label="Valeur à l'achat"
              value={
                <AnimatedMoney
                  value={result.purchaseValue}
                  currency={currency}
                  duration={700}
                />
              }
              muted
            />
            <ResultRow
              label="Valeur actuelle"
              value={
                <AnimatedMoney
                  value={result.currentValue}
                  currency={currency}
                  duration={800}
                />
              }
            />
            <ResultRow
              label="Plus-value brute"
              value={
                <span>
                  <AnimatedMoney
                    value={result.grossGain}
                    currency={currency}
                    duration={850}
                  />
                  <span className="text-ivory-muted">
                    {' '}
                    ({formatPercent(result.grossPercent)})
                  </span>
                </span>
              }
              accent={result.grossGain >= 0}
            />
            {result.fees > 0 && (
              <ResultRow
                label="Frais déduits"
                value={
                  <AnimatedMoney
                    value={result.fees}
                    currency={currency}
                    duration={700}
                  />
                }
                muted
              />
            )}
            <div className="net-glow pt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
                Plus-value nette
              </p>
              <p
                className={[
                  'font-display text-4xl tracking-wide',
                  result.netGain >= 0 ? 'text-sage' : 'text-brick',
                ].join(' ')}
              >
                <AnimatedMoney
                  value={result.netGain}
                  currency={currency}
                  duration={1000}
                />
              </p>
              <p className="mt-1 text-sm text-ivory-muted">
                {formatPercent(result.netPercent)}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
