# Hélène Gold

Application web mobile-first pour suivre le cours de l’or en temps réel — design ultra-minimaliste, unités métriques uniquement (grammes / kilogrammes), devises CHF et EUR.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez l’URL affichée par Vite (généralement `http://localhost:5173`).

## Clé API

La clé GoldAPI.io se configure dans `src/config.js` :

```js
export const API_KEY = 'VOTRE_CLE_API_ICI'
```

Un proxy Vite (`/goldapi` → `https://www.goldapi.io/api`) évite les erreurs CORS en développement.

## Fonctionnalités

- Cours live pour 1 g et 1 kg d’or fin (24k)
- Variation du jour (typographie + indicateur discret)
- Bascule CHF / EUR
- Calculateur de plus-value historique
- Estimation des frais (% ou montant fixe) pour une plus-value nette
