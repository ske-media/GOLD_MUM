export default function CurrencyToggle({ currency, onChange }) {
  const index = currency === 'EUR' ? 1 : 0

  return (
    <div
      className="relative inline-flex shrink-0 items-center rounded-full border border-line bg-ink-soft/90 p-0.5 backdrop-blur-md shadow-[0_0_30px_-18px_rgba(196,165,116,0.55)]"
      role="group"
      aria-label="Devise"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-gold-mist shadow-[0_0_22px_-4px_rgba(196,165,116,0.7)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {['CHF', 'EUR'].map((code) => {
        const active = currency === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            aria-pressed={active}
            className={[
              'relative z-10 min-h-10 min-w-[3.5rem] rounded-full px-3.5 py-2 text-xs font-medium tracking-[0.14em]',
              active
                ? 'text-gold'
                : 'text-ivory-muted hover:text-ivory',
            ].join(' ')}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
