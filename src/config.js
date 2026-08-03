/**
 * Clé API GoldAPI.io
 * Remplacez la valeur ci-dessous par votre propre clé si nécessaire.
 * Dashboard : https://www.goldapi.io/dashboard
 */
export const API_KEY = 'goldapi-c06bcd94dbdcb899eb7b2d3388332329-io'

/**
 * Base URL GoldAPI.
 * En local : proxy Vite `/goldapi` (évite le rate-limit croisé / facilite le debug).
 * En production : appel direct (CORS ouvert côté GoldAPI) — le proxy Vite n'existe pas en static hosting.
 */
export const API_BASE = import.meta.env.DEV
  ? '/goldapi'
  : 'https://www.goldapi.io/api'

/** 1 once troy = 31.1034768 grammes */
export const TROY_OUNCE_TO_GRAMS = 31.1034768

export const CURRENCIES = ['CHF', 'EUR']
