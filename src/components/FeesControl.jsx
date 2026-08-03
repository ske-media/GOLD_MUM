import { useEffect, useRef } from 'react'
import Hint from './Hint'
import InfoTip from './InfoTip'

export default function FeesControl({
  mode,
  onModeChange,
  percent,
  onPercentChange,
  fixed,
  onFixedChange,
  currency,
}) {
  const rangeRef = useRef(null)
  const progress = Math.min(100, (Number(percent) / 15) * 100)

  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.style.setProperty('--range-progress', `${progress}%`)
    }
  }, [progress])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
          Frais estimés
          <InfoTip label="frais estimés">
            Dans un deal d’or, le spot n’est pas le prix final. On ajoute souvent
            courtage (commission), premium (écart pièce/lingot) et stockage.
          </InfoTip>
        </p>
        <div className="relative flex gap-1 rounded-full border border-line p-0.5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-gold-mist transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(${mode === 'fixed' ? '100%' : '0%'})`,
            }}
          />
          {[
            { id: 'percent', label: '%' },
            { id: 'fixed', label: currency },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onModeChange(opt.id)}
              className={[
                'relative z-10 rounded-full px-2.5 py-1 text-[10px] tracking-[0.12em] transition-colors duration-300',
                mode === opt.id
                  ? 'text-gold'
                  : 'text-ivory-faint hover:text-ivory-muted',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Hint>
        Ajustez pour coller à votre scénario : 1–3 % est fréquent chez un
        revendeur ; un forfait pour un coffre.
      </Hint>

      <div key={mode} className="crossfade">
        {mode === 'percent' ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <label htmlFor="fees-percent" className="text-xs text-ivory-muted">
                Courtage / stockage
              </label>
              <span className="font-display text-lg text-gold tabular-nums transition-all duration-300">
                {Number(percent).toFixed(1)}%
              </span>
            </div>
            <input
              ref={rangeRef}
              id="fees-percent"
              type="range"
              min="0"
              max="15"
              step="0.1"
              value={percent}
              onChange={(e) => onPercentChange(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-transparent"
              style={{ '--range-progress': `${progress}%` }}
            />
          </div>
        ) : (
          <div className="field-line space-y-2">
            <label htmlFor="fees-fixed" className="text-xs text-ivory-muted">
              Montant fixe
            </label>
            <div className="relative">
              <input
                id="fees-fixed"
                type="number"
                min="0"
                step="1"
                value={fixed}
                onChange={(e) => onFixedChange(Number(e.target.value) || 0)}
                className="w-full border-b border-transparent bg-transparent py-2 pr-12 font-display text-2xl text-ivory outline-none"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tracking-[0.16em] text-ivory-faint">
                {currency}
              </span>
            </div>
            <Hint>Ex. : frais de transaction ou de coffre annuels.</Hint>
          </div>
        )}
      </div>
    </div>
  )
}
