/** Courte explication sous un libellé — lisible, sans surcharge. */
export default function Hint({ children, className = '' }) {
  return (
    <p
      className={[
        'text-[13px] leading-relaxed text-ivory-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  )
}
