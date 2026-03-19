# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite frontend for an inventory management system (iShop). It provides a product management interface with features to view and create products.

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
- **UI Library**: Material UI (MUI) v7
- **Form Handling**: react-hook-form with Zod validation
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting**: ESLint with typescript-eslint

### Project Structure

```
src/
├── components/           # React components (co-located styles)
│   ├── ProductManagement/# Main container component
│   ├── ProductTable/    # Product list display
│   ├── ProductDialog/   # Modal for creating products
│   └── ProductForm/     # Form with validation
├── services/            # API layer
│   └── productApi.ts    # Product API calls (fetch-based)
├── types/               # TypeScript interfaces
│   └── product.ts       # Product type definitions
├── tests/               # Test files mirroring src structure
│   ├── components/
│   ├── services/
│   └── setup.ts         # Vitest setup (jest-dom matchers)
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

### Component Architecture Pattern

Components follow a container/presentational pattern with custom hooks:

1. **Container Components** (e.g., `ProductManagement.tsx`)
   - Use a corresponding hook (e.g., `useProductManagement.ts`)
   - Manage state and data flow
   - Pass data down to presentational components

2. **Custom Hooks** (e.g., `useProductManagement.ts`)
   - Encapsulate business logic and state management
   - Handle API calls via the services layer
   - Return state and handlers for the container

3. **Presentational Components** (e.g., `ProductTable.tsx`, `ProductDialog.tsx`)
   - Receive props and render UI
   - Use MUI components for consistent styling
   - CSS files co-located with components

### API Layer

- **Base URL**: Configured via Vite proxy to `http://localhost:8087`
- **Endpoints**:
  - `GET /api/products` - Fetch all products (returns paginated response, extract `content` array)
  - `POST /api/products` - Create new product
- **Error Handling**: Custom `ApiError` class with status code and response data

### Form Handling Pattern

Forms use react-hook-form with Zod validation:

1. Define Zod schema in `useProductForm.ts`
2. Use `zodResolver` to connect validation to react-hook-form
3. Form data types use string fields (even for numbers) for input binding
4. Convert to API types (numbers) before submission in the container hook

### Testing Pattern

- Tests co-located in `src/tests/` mirroring the source structure
- Mock `global.fetch` for API tests
- Use `userEvent` for user interactions
- Tests follow the pattern: render → interact → assert

### Type Definitions

Key types in `src/types/product.ts`:
- `Product` - Full product with ID (API response)
- `CreateProductRequest` - Payload for creating products (numbers)
- `ProductFormData` - Form input values (strings for binding)

## Configuration Notes

- **Vite Proxy**: API calls to `/api/*` are proxied to `http://localhost:8087`
- **Strict TypeScript**: `strict: true` with unused locals/parameters checks
- **ES Modules**: `type: "module"` in package.json
- **Test Environment**: jsdom with jest-dom matchers for assertions like `toBeInTheDocument()`
