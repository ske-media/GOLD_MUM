import { API_BASE, API_KEY, TROY_OUNCE_TO_GRAMS } from '../config'

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'x-access-token': API_KEY,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.message || body.error || ''
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Erreur API (${response.status})`)
  }

  return response.json()
}

/**
 * Normalise une réponse GoldAPI : prix spot en onces → grammes / kilogrammes.
 * Utilise price_gram_24k quand disponible, sinon conversion troy.
 */
export function normalizeQuote(data) {
  const pricePerOunce = Number(data.price)
  const pricePerGram =
    data.price_gram_24k != null
      ? Number(data.price_gram_24k)
      : pricePerOunce / TROY_OUNCE_TO_GRAMS

  return {
    currency: data.currency,
    timestamp: data.timestamp,
    pricePerOunce,
    pricePerGram,
    pricePerKg: pricePerGram * 1000,
    change: Number(data.ch ?? 0),
    changePercent: Number(data.chp ?? 0),
    raw: data,
  }
}

/** Cours actuel XAU dans la devise demandée (CHF | EUR) */
export async function fetchLivePrice(currency) {
  const data = await request(`/XAU/${currency}`)
  return normalizeQuote(data)
}

/**
 * Cours historique XAU à une date donnée.
 * @param {string} currency - CHF | EUR
 * @param {string} dateYmd - format YYYY-MM-DD (input date HTML)
 */
export async function fetchHistoricalPrice(currency, dateYmd) {
  const compact = dateYmd.replaceAll('-', '')
  const data = await request(`/XAU/${currency}/${compact}`)
  return normalizeQuote(data)
}
