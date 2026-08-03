/** Courte explication sous un libellé — discrète, sans surcharge. */
export default function Hint({ children, className = '' }) {
  return (
    <p
      className={[
        'text-[11px] leading-relaxed text-ivory-faint/90',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}
