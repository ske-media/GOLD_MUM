import { API_BASE, API_KEY, TROY_OUNCE_TO_GRAMS } from '../config'

async function request(path) {
  const url = `${API_BASE}${path}`

  let response
  try {
    response = await fetch(url, {
      headers: {
        'x-access-token': API_KEY,
        Accept: 'application/json',
      },
    })
  } catch {
    throw new Error('Impossible de joindre GoldAPI. Vérifiez votre connexion.')
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.message || body.error || ''
    } catch {
      /* ignore */
    }

    if (response.status === 401) {
      throw new Error('Clé API invalide ou manquante.')
    }
    if (response.status === 429) {
      throw new Error('Limite de requêtes GoldAPI atteinte. Réessayez dans un instant.')
    }
    if (response.status === 404) {
      throw new Error(
        detail || 'Donnée introuvable (date hors marché ou endpoint invalide).',
      )
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
