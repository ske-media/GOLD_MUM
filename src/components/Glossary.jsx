import { useState } from 'react'

const TERMS = [
  {
    term: 'Prix spot',
    meaning:
      'Cours de référence de l’or sur le marché mondial, en temps réel. C’est la base du deal — pas le prix d’un bijoutier.',
  },
  {
    term: 'Or fin · 24 carats',
    meaning:
      'Or quasi pur (99,9 %). Les lingots et pièces d’investissement se valorisent surtout sur cette pureté.',
  },
  {
    term: 'Gramme / kilogramme',
    meaning:
      'Unités métriques du métal physique. 1 kg = 1 000 g. Ici, pas d’onces troy : tout est en grammes.',
  },
  {
    term: 'Plus-value',
    meaning:
      'Écart entre le prix d’achat et le prix actuel. Brute = avant frais. Nette = après courtage, premium ou stockage.',
  },
  {
    term: 'Courtage & premium',
    meaning:
      'Le courtage est la commission du vendeur. Le premium est l’écart entre le spot et le prix réel d’une pièce ou d’un lingot.',
  },
  {
    term: 'Stockage',
    meaning:
      'Frais de coffre ou de séquestre si l’or n’est pas chez vous. Souvent un % annuel ou un forfait.',
  },
]

export default function Glossary() {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold-soft">
          Lexique
        </p>
        <h3 className="font-display text-2xl font-medium tracking-wide text-ivory">
          Comprendre le deal
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-ivory-muted">
          Quelques notions pour lire le marché de l’or sans jargon opaque.
        </p>
      </header>

      <ul className="divide-y divide-line border-y border-line">
        {TERMS.map((item, index) => {
          const open = openId === index
          return (
            <li key={item.term}>
              <button
                type="button"
                className="flex w-full items-baseline justify-between gap-4 py-3.5 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : index)}
              >
                <span className="font-display text-lg tracking-wide text-ivory">
                  {item.term}
                </span>
                <span
                  className={[
                    'text-[10px] tracking-[0.18em] text-ivory-faint transition-transform duration-300',
                    open ? 'rotate-45 text-gold' : '',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <div
                className={[
                  'grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                ].join(' ')}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 pr-6 text-[12px] leading-relaxed text-ivory-muted">
                    {item.meaning}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
