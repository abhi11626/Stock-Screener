# Stock Dashboard

A responsive stock dashboard built with Next.js that lets users search real market symbols, view live quote details, and manage a persistent watchlist. The app uses Alpha Vantage data through server-side API routes, lightweight in-memory caching, and auto-refreshing quote updates.

## Features

- Search stocks using Alpha Vantage `SYMBOL_SEARCH`
- View stock details with current price and change
- Add stocks to a persistent watchlist
- Auto-refresh stock details every 5 seconds
- Auto-refresh watchlist quotes every 5 seconds
- In-memory API caching to reduce duplicate external requests
- Dynamic currency formatting with `Intl.NumberFormat`
- LocalStorage-backed watchlist with hydration-safe loading
- Responsive Tailwind UI with loading and empty states

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Next.js API routes
- Alpha Vantage API
- LocalStorage
- In-memory `Map` cache

## Screenshots

### Dashboard

<!-- Add dashboard screenshot here -->

### Search Results

<!-- Add search results screenshot here -->

### Stock Details

<!-- Add stock details screenshot here -->

## Setup

1. Clone the repository:

```bash
git clone <your-repository-url>
cd stock-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root:

```bash
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```bash
http://localhost:3000
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key used by the server-side stock search and quote routes |

The app also supports `ALPHAVANTAGE_API_KEY` as a fallback variable name.

## API Routes

- `/api/search?q=AAPL` searches stock symbols and returns simplified `{ symbol, name }` results.
- `/api/stock?symbol=AAPL` fetches quote data and returns `{ symbol, price, change }`.

## Deployment

Live demo:

<!-- Add deployed project link here -->

Recommended deployment platform: Vercel.

Remember to add `ALPHA_VANTAGE_API_KEY` to your production environment variables before deploying.

## Future Improvements

- Add historical charts with real time-series data
- Add watchlist loading/error indicators
- Add manual refresh controls
- Add sorting and filtering for the watchlist
- Add stronger API rate-limit handling
- Add tests for hooks, API routes, and formatting utilities
