import { useEffect, useState } from 'react'
import { fetchHistoricalPrice, fetchLivePrice } from './api/goldApi'
import Calculator from './components/Calculator'
import CurrencyToggle from './components/CurrencyToggle'
import PriceHero from './components/PriceHero'
import { todayISO, yearsAgoISO } from './utils/format'

function computeResult({ historical, live, grams, feeMode, feePercent, feeFixed, date }) {
  if (!historical || !live || !grams || grams <= 0) return null

  const purchaseValue = historical.pricePerGram * grams
  const currentValue = live.pricePerGram * grams
  const grossGain = currentValue - purchaseValue
  const grossPercent = purchaseValue > 0 ? (grossGain / purchaseValue) * 100 : 0

  const fees =
    feeMode === 'percent'
      ? Math.max(purchaseValue, currentValue) * (feePercent / 100)
      : Number(feeFixed) || 0

  const netGain = grossGain - fees
  const netPercent = purchaseValue > 0 ? (netGain / purchaseValue) * 100 : 0

  return {
    date,
    grams,
    purchaseValue,
    currentValue,
    grossGain,
    grossPercent,
    fees,
    netGain,
    netPercent,
  }
}

export default function App() {
  const [currency, setCurrency] = useState('CHF')
  const [quote, setQuote] = useState(null)
  const [liveLoading, setLiveLoading] = useState(true)
  const [liveError, setLiveError] = useState(null)

  const [date, setDate] = useState(yearsAgoISO(1))
  const [grams, setGrams] = useState(100)
  const [feeMode, setFeeMode] = useState('percent')
  const [feePercent, setFeePercent] = useState(2)
  const [feeFixed, setFeeFixed] = useState(50)

  const [historical, setHistorical] = useState(null)
  const [calcLoading, setCalcLoading] = useState(false)
  const [calcError, setCalcError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadLive() {
      setLiveLoading(true)
      setLiveError(null)
      try {
        const data = await fetchLivePrice(currency)
        if (!cancelled) setQuote(data)
      } catch (err) {
        if (!cancelled) {
          setQuote(null)
          setLiveError(err.message || 'Impossible de charger le cours.')
        }
      } finally {
        if (!cancelled) setLiveLoading(false)
      }
    }

    loadLive()
    const interval = setInterval(loadLive, 60_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [currency])

  useEffect(() => {
    if (!date || date > todayISO()) return undefined

    let cancelled = false
    const timer = setTimeout(async () => {
      setCalcLoading(true)
      setCalcError(null)
      try {
        const data = await fetchHistoricalPrice(currency, date)
        if (!cancelled) setHistorical(data)
      } catch (err) {
        if (!cancelled) {
          setHistorical(null)
          setCalcError(
            err.message ||
              'Donnée historique indisponible pour cette date (week-end ou jour férié).',
          )
        }
      } finally {
        if (!cancelled) setCalcLoading(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [currency, date])

  const result = computeResult({
    historical,
    live: quote,
    grams,
    feeMode,
    feePercent,
    feeFixed,
    date,
  })

  return (
    <div className="atmosphere min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
        <header className="animate-fade-up mb-12 flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-[10px] uppercase tracking-[0.28em] text-ivory-faint">
                Temps réel
              </span>
            </div>
            <h1 className="font-display text-[2.35rem] font-medium leading-none tracking-[0.02em] text-ivory sm:text-5xl">
              Hélène <span className="text-gold">Gold</span>
            </h1>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ivory-muted">
              Le cours de l&apos;or, en grammes. Sans bruit.
            </p>
          </div>
          <CurrencyToggle currency={currency} onChange={setCurrency} />
        </header>

        <main className="flex flex-1 flex-col gap-16">
          {liveError ? (
            <p className="animate-fade-up text-sm text-brick">{liveError}</p>
          ) : (
            <PriceHero quote={quote} loading={liveLoading} currency={currency} />
          )}

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          <Calculator
            currency={currency}
            date={date}
            onDateChange={setDate}
            grams={grams}
            onGramsChange={setGrams}
            feeMode={feeMode}
            onFeeModeChange={setFeeMode}
            feePercent={feePercent}
            onFeePercentChange={setFeePercent}
            feeFixed={feeFixed}
            onFeeFixedChange={setFeeFixed}
            loading={calcLoading || liveLoading}
            error={calcError}
            result={result}
          />
        </main>

        <footer className="animate-fade-up-delay-3 mt-16 border-t border-line pt-6">
          <p className="text-[10px] leading-relaxed tracking-[0.08em] text-ivory-faint">
            Prix spot 24 carats · unités métriques uniquement · CHF & EUR ·
            source GoldAPI.io
          </p>
        </footer>
      </div>
    </div>
  )
}
