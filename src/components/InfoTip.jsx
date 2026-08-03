import { useId, useState } from 'react'

/** Pastille « ? » qui dévoile une brève définition au tap. */
export default function InfoTip({ label, children }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        type="button"
        className={[
          'ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[9px] leading-none tracking-normal transition-all duration-300',
          open
            ? 'border-gold/50 bg-gold-mist text-gold'
            : 'border-line text-ivory-faint hover:border-gold/40 hover:text-gold-soft',
        ].join(' ')}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Explication : ${label}`}
        onClick={() => setOpen((v) => !v)}
      >
        ?
      </button>
      {open && (
        <span
          id={id}
          role="note"
          className="absolute left-0 top-full z-20 mt-2 w-[min(16.5rem,70vw)] rounded-sm border border-line bg-ink-soft/95 p-3 text-[11px] font-normal leading-relaxed tracking-normal text-ivory-muted shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md crossfade"
        >
          {children}
        </span>
      )}
    </span>
  )
}
