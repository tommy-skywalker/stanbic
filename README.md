# Stanbic IBTC — Premium Mobile Banking (MVP)

A mobile-banking demo app built with **React 19 + Vite + TypeScript**, styled with Tailwind CSS. It showcases a savings dashboard, a mutual-fund investment portfolio with a live payout timeline, transfers, transaction history, and profile management.

> Demo app / MVP. Login is mocked and data is seeded locally in the browser (`localStorage`) — there is no backend.

## Features

- **Dashboard** — available balance, quick actions, and the next investment payout surfaced up front.
- **Investments** — portfolio of mutual funds showing start/maturity dates, progress bars, and countdowns. Matured funds are marked **Paid Out**; active funds are auto-credited on their due date. Includes a new-subscription flow with projected returns.
- **Transfers** — beneficiary-based send-money flow.
- **Activity** — full transaction ledger with in/out filters.
- **Profile** — account details, settings, and logout.

## Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) 18+

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

**Demo login** — Account number: `00028744480`, PIN: `1304`.

No environment variables or API keys are required.

## Build

```bash
npm run build      # outputs static site to ./dist
npm run preview    # preview the production build locally
```

## Deploy

It's a static Vite app, so it deploys to any static host with zero configuration:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** none

On Vercel or Netlify, import the repo and the defaults above are auto-detected.

## Tech Stack

- React 19, Vite 6, TypeScript
- Tailwind CSS (via CDN)
- State persisted in `localStorage`
