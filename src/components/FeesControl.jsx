export default function FeesControl({
  mode,
  onModeChange,
  percent,
  onPercentChange,
  fixed,
  onFixedChange,
  currency,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-ivory-faint">
          Frais estimés
        </p>
        <div className="flex gap-1 rounded-full border border-line p-0.5">
          {[
            { id: 'percent', label: '%' },
            { id: 'fixed', label: currency },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onModeChange(opt.id)}
              className={[
                'rounded-full px-2.5 py-1 text-[10px] tracking-[0.12em] transition-colors duration-300',
                mode === opt.id
                  ? 'bg-gold-mist text-gold'
                  : 'text-ivory-faint hover:text-ivory-muted',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'percent' ? (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <label htmlFor="fees-percent" className="text-xs text-ivory-muted">
              Courtage / stockage
            </label>
            <span className="font-display text-lg text-gold">
              {Number(percent).toFixed(1)}%
            </span>
          </div>
          <input
            id="fees-percent"
            type="range"
            min="0"
            max="15"
            step="0.1"
            value={percent}
            onChange={(e) => onPercentChange(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-ink-lift accent-gold"
          />
        </div>
      ) : (
        <div className="space-y-2">
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
              className="w-full border-b border-line bg-transparent py-2 pr-12 font-display text-2xl text-ivory outline-none transition-colors focus:border-gold/50"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs tracking-[0.16em] text-ivory-faint">
              {currency}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
