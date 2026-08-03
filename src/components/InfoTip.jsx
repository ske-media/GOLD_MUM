import { useEffect, useId, useRef, useState } from 'react'

/** Pastille « ? » qui dévoile une brève définition au tap. */
export default function InfoTip({ label, children }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={rootRef} className="relative inline-flex shrink-0 items-center align-middle">
      <button
        type="button"
        className={[
          'ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-medium leading-none tracking-normal transition-all duration-300',
          open
            ? 'border-gold/55 bg-gold-mist text-gold'
            : 'border-ivory-faint/40 text-ivory-muted hover:border-gold/45 hover:text-gold',
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
          className="absolute left-1/2 top-full z-30 mt-2 w-[min(18rem,calc(100vw-2.5rem))] -translate-x-1/2 rounded-sm border border-line bg-ink-soft p-3.5 text-[13px] font-normal leading-relaxed tracking-normal text-ivory shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md crossfade sm:left-0 sm:translate-x-0"
        >
          {children}
        </span>
      )}
    </span>
  )
}
