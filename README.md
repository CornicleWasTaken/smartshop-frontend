# SmartShop Frontend

React + TypeScript + Vite frontend for SmartShop, an inventory & financial management system. Built with Material UI v7, react-hook-form + Zod, and recharts.

## Prerequisites

- Node.js (npm)
- The **SmartShop backend** running on `http://localhost:8087` (see `../smartshop-backend/README.md`). The Vite dev server proxies `/api` to it.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
```

Register a new account on `/register`, then log in.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server (proxies `/api` → `:8087`) |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |
| `npx vitest` | Run the test suite |

## Features

- **Auth** — register/login, JWT access token + httpOnly refresh-token cookie, automatic 401→refresh retry.
- **Products** — CRUD with SKU/name uniqueness, low-stock threshold, optional category (used by reports).
- **Sales** — create sales with stock deduction and validation.
- **Financial dashboard** — summary cards (sales, expenses, gross/net profit) and recent expenses.
- **Expenses** — CRUD with categories/statuses and pagination.
- **Reports** — sales report, profit & loss, balance sheet, and financial summary with date-range presets; PDF/Excel export.

## Key Config

- API base: Vite proxy `'/api' → 'http://localhost:8087'` (`vite.config.ts`).
- Access token stored under `ishop_access_token` in `localStorage`.
- See `CLAUDE.md` for the full architecture and development conventions.
