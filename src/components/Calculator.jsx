import AnimatedMoney from './AnimatedMoney'
import Hint from './Hint'
import InfoTip from './InfoTip'
import {
  formatDisplayDate,
  formatGrams,
  formatPercent,
  todayISO,
} from '../utils/format'
import FeesControl from './FeesControl'
import { Skeleton } from './Skeleton'

function ResultRow({ label, value, hint, accent = false, muted = false }) {
  return (
    <div className="py-3.5">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-muted">
          {label}
          {hint && <InfoTip label={label}>{hint}</InfoTip>}
        </span>
        <span
          className={[
            'font-display text-[1.35rem] leading-tight tracking-wide tabular-nums break-words sm:text-right sm:text-2xl',
            accent ? 'text-gold' : muted ? 'text-ivory-muted' : 'text-ivory',
          ].join(' ')}
        >
          {value}
        </span>
      </div>
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
      <header className="space-y-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
          Voyage dans le temps
        </p>
        <h3 className="font-display text-[clamp(1.75rem,6vw,2.15rem)] font-medium leading-tight tracking-wide text-ivory">
          Calculateur de plus-value
        </h3>
        <p className="max-w-md text-[15px] leading-relaxed text-ivory-muted">
          Simulez un achat passé au cours spot, puis mesurez le gain ou la
          perte face au prix d’aujourd’hui — comme un deal d’or physique.
        </p>
      </header>

      <div className="soft-panel space-y-6 rounded-sm border border-line bg-ink-soft/55 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-6">
          <div className="field-line space-y-2">
            <label
              htmlFor="purchase-date"
              className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-muted"
            >
              Date d&apos;achat
              <InfoTip label="date d'achat">
                Jour où vous auriez acheté. On récupère le cours spot historique
                de cette date (hors week-ends / jours fériés de marché).
              </InfoTip>
            </label>
            <input
              id="purchase-date"
              type="date"
              max={todayISO()}
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full min-w-0 border-b border-transparent bg-transparent py-2 font-display text-xl text-ivory outline-none"
            />
            <Hint>Cours historique à cette date.</Hint>
          </div>

          <div className="field-line space-y-2">
            <label
              htmlFor="grams"
              className="inline-flex items-center text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-muted"
            >
              Quantité
              <InfoTip label="quantité">
                Poids d’or fin en grammes. Ex. : un lingot de 100 g, une pièce
                d’environ 10 g, ou votre stock total.
              </InfoTip>
            </label>
            <div className="relative">
              <input
                id="grams"
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                value={grams}
                onChange={(e) => onGramsChange(Number(e.target.value) || 0)}
                className="w-full min-w-0 border-b border-transparent bg-transparent py-2 pr-10 font-display text-xl text-ivory outline-none"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm tracking-[0.12em] text-ivory-muted">
                g
              </span>
            </div>
            <Hint>Poids en or fin (grammes).</Hint>
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
          <p className="crossfade text-[15px] leading-relaxed text-brick">{error}</p>
        )}

        {!loading && !error && result && (
          <div
            key={`${result.date}-${result.grams}-${currency}-${Math.round(result.netGain)}`}
            className="stagger-children space-y-1 divide-y divide-line"
          >
            <p className="pb-4 text-[14px] leading-relaxed text-ivory-muted">
              {formatGrams(result.grams)} g · acquis le{' '}
              {formatDisplayDate(result.date)}
            </p>

            <ResultRow
              label="Valeur à l'achat"
              hint="Ce que valait votre quantité au cours spot du jour d’achat."
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
              hint="Ce que vaut la même quantité au cours spot d’aujourd’hui."
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
              hint="Gain ou perte avant frais. C’est l’écart pur du marché."
              value={
                <span className="inline-flex flex-wrap items-baseline gap-x-2">
                  <AnimatedMoney
                    value={result.grossGain}
                    currency={currency}
                    duration={850}
                  />
                  <span className="text-[0.95rem] text-ivory-muted">
                    ({formatPercent(result.grossPercent)})
                  </span>
                </span>
              }
              accent={result.grossGain >= 0}
            />
            {result.fees > 0 && (
              <ResultRow
                label="Frais déduits"
                hint="Courtage, premium ou stockage estimés que vous avez saisis — soustraits du gain."
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
            <div className="net-glow pt-5">
              <p className="mb-2 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.14em] text-ivory-muted">
                Plus-value nette
                <InfoTip label="plus-value nette">
                  Le vrai résultat du deal : plus-value brute moins vos frais.
                  C’est l’ordre de grandeur après coûts réels.
                </InfoTip>
              </p>
              <p
                className={[
                  'font-display text-[clamp(2rem,8vw,2.75rem)] leading-tight tracking-wide break-words',
                  result.netGain >= 0 ? 'text-sage' : 'text-brick',
                ].join(' ')}
              >
                <AnimatedMoney
                  value={result.netGain}
                  currency={currency}
                  duration={1000}
                />
              </p>
              <p className="mt-1.5 text-[15px] text-ivory-muted">
                {formatPercent(result.netPercent)}
              </p>
              <Hint className="mt-3 max-w-md">
                Estimation indicative — le prix réel d’achat/revente peut
                inclure un premium face au spot.
              </Hint>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
