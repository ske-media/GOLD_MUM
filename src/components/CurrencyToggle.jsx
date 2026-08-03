export default function CurrencyToggle({ currency, onChange }) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-ink-soft/80 p-0.5"
      role="group"
      aria-label="Devise"
    >
      {['CHF', 'EUR'].map((code) => {
        const active = currency === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            className={[
              'min-w-[3.25rem] rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-[0.18em] transition-all duration-300',
              active
                ? 'bg-gold-mist text-gold'
                : 'text-ivory-faint hover:text-ivory-muted',
            ].join(' ')}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
