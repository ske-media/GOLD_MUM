import { useInView } from '../hooks/useInView'

export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
}) {
  const { ref, visible } = useInView()

  return (
    <div
      ref={ref}
      className={[
        'reveal',
        `reveal-${variant}`,
        visible ? 'is-visible' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
