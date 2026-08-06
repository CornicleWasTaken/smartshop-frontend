# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript + Vite frontend for **SmartShop**, an inventory & financial management system (also referred to as "iShop"). It manages products, sales, expenses, and financial reports behind JWT-based authentication. The frontend depends on the Spring Boot backend in `../smartshop-backend` (proxied at `http://localhost:8087`).

## Common Commands

```bash
# Start development server (runs on http://localhost:5173 by default)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build locally
npm run preview

# Run tests (Vitest)
npx vitest

# Run tests in watch mode
npx vitest --watch

# Run a single test file
npx vitest src/tests/components/ProductForm.test.tsx
```

## Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 8
- **Routing**: react-router-dom v7
- **UI Library**: Material UI (MUI) v7
- **Form Handling**: react-hook-form with Zod validation
- **Charts**: recharts; **Report export**: jspdf / xlsx
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint with typescript-eslint

### Routes

| Path | Component | Auth |
|---|---|---|
| `/login`, `/register` | `LoginPage`, `RegisterPage` | public |
| `/` | `ProductManagement` | protected |
| `/sales` | `SalesManagement` | protected |
| `/financial` | `FinancialDashboard` | protected |
| `/reports` | `ReportsPage` | protected |
| `/financial/expenses` | `ExpenseManagementContainer` | protected |

All protected routes are wrapped in `ProtectedRoute` (`src/components/Auth/ProtectedRoute.tsx`) and redirect to `/login` when unauthenticated.

### Project Structure

```
src/
├── auth/                # AuthContext (session state, token persistence)
├── components/          # Feature components (container/presentational pattern)
│   ├── Auth/            # LoginPage, RegisterPage, ProtectedRoute
│   ├── ProductManagement/, ProductTable/, ProductDialog/, ProductForm/
│   ├── SalesManagement/, SalesTable/, SalesDialog/, SaleForm/
│   ├── Expenses/, Dashboard/FinancialDashboard/, Reports/, Charts/
│   └── Navigation/      # App shell nav
├── hooks/               # Business-logic hooks (useExpenseManagement, useFinancialDashboard, ...)
├── services/            # API layer (one module per domain)
│   ├── apiClient.ts     # requestJson, ApiError, token storage, 401→refresh
│   ├── authApi.ts       # /api/auth/*
│   ├── productApi.ts    # /api/products
│   ├── salesApi.ts      # /api/sales
│   ├── expenseApi.ts    # /api/expenses
│   └── financialReportApi.ts  # /api/reports/*
├── theme/               # MUI theme config (light/dark, localStorage persistence)
├── types/               # TS interfaces per domain (auth, product, sale, financial)
├── utils/               # date-range, formatting, chart helpers
├── tests/               # Vitest tests mirroring src structure
└── App.tsx              # Routes + AuthProvider + AppShell
```

### Auth Flow

- **Access token** (`JWT`) is stored in `localStorage` under `ishop_access_token` and sent as `Authorization: Bearer <token>` on every request.
- **Refresh token** is an httpOnly cookie scoped to `/api/auth`, set by the backend on login/register.
- `requestJson` (`src/services/apiClient.ts`) automatically retries once on 401 by calling `POST /api/auth/refresh` (credentials included); if that fails the stored token is cleared.
- Backend endpoints that must remain public: `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`, `/api/auth/logout`.

### API Layer

- **Base URL**: Vite proxy (`/api` → `http://localhost:8087`). No CORS needed in dev.
- Errors are surfaced as `ApiError` (`status` + `data`) via `requestJson`.
- Paginated endpoints return `Page<T>` shaped `{ content, pageNumber, pageSize, totalElements, totalPages, first, last }` (the backend returns this shape for `/api/expenses`; product/sale list endpoints expose `.content`).

### Form Handling Pattern

Forms use react-hook-form with Zod validation and MUI TextField components:
1. Zod schema lives in the form hook (e.g. `useExpenseForm.ts`, `useProductForm.ts`).
2. `zodResolver` connects validation; numeric form fields are strings for input binding.
3. Convert to API types (numbers, ISO dates) before submission in the hook.
4. Dates are sent as ISO strings (`toISOString()`), e.g. `2026-07-05T00:00:00.000Z`.

### Testing Pattern

- Tests co-located in `src/tests/` mirroring the source structure.
- `src/tests/setup.ts` provides a `localStorage` mock (jsdom does not reliably expose it), `matchMedia` mock, and jest-dom matchers.
- Use `renderWithTheme` from `src/tests/utils/test-utils.tsx` to wrap components with the ThemeProvider.
- Mock `global.fetch` for API tests; use `userEvent` for interactions; `getByLabelText` to query MUI fields.

## Configuration Notes

- **Vite Proxy**: API calls to `/api/*` proxied to `http://localhost:8087` (backend must be running).
- **Strict TypeScript**: `strict: true` with unused locals/parameters checks.
- **ES Modules**: `type: "module"` in package.json.
- **Test Environment**: jsdom with jest-dom matchers.
