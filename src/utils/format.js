const localeByCurrency = {
  CHF: 'fr-CH',
  EUR: 'fr-FR',
}

export function formatMoney(value, currency, { compact = false } = {}) {
  if (value == null || Number.isNaN(value)) return '—'

  const locale = localeByCurrency[currency] || 'fr-CH'
  const abs = Math.abs(value)
  const fractionDigits = compact
    ? abs >= 1000
      ? 0
      : abs >= 100
        ? 1
        : 2
    : abs >= 1000
      ? 0
      : 2

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatGrams(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('fr-CH', {
    maximumFractionDigits: value < 1 ? 3 : value < 10 ? 2 : 1,
  }).format(value)
}

export function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function yearsAgoISO(years = 1) {
  const d = new Date()
  d.setFullYear(d.getFullYear() - years)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function formatDisplayDate(dateYmd) {
  if (!dateYmd) return '—'
  const [y, m, d] = dateYmd.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}
