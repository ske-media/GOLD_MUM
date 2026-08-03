const MOTES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 37) % 88)}%`,
  top: `${8 + ((i * 53) % 84)}%`,
  size: 1 + (i % 3) * 0.55,
  delay: `${(i * 0.45) % 6}s`,
  duration: `${10 + (i % 5) * 2.2}s`,
  opacity: 0.12 + (i % 4) * 0.05,
}))

export default function GoldDust() {
  return (
    <div className="gold-dust" aria-hidden="true">
      {MOTES.map((mote) => (
        <span
          key={mote.id}
          className="gold-mote"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
            opacity: mote.opacity,
          }}
        />
      ))}
    </div>
  )
}
