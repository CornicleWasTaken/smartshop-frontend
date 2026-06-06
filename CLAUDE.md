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
├── components/           # React components (theme-based styling)
│   ├── ProductManagement/# Main container component
│   ├── ProductTable/    # Product list display
│   ├── ProductDialog/   # Modal for creating products
│   └── ProductForm/     # Form with validation (MUI TextFields)
├── services/            # API layer
│   └── productApi.ts    # Product API calls (fetch-based)
├── theme/               # MUI theme configuration
│   ├── theme.ts         # Light/dark theme definitions
│   ├── useThemeMode.ts  # Theme mode hook with localStorage persistence
│   └── ThemeProviderWrapper.tsx # Theme provider component
├── types/               # TypeScript interfaces
│   └── product.ts       # Product type definitions
├── tests/               # Test files mirroring src structure
│   ├── components/
│   ├── services/
│   ├── utils/
│   │   └── test-utils.tsx # Test utilities (renderWithTheme)
│   └── setup.ts         # Vitest setup (jest-dom matchers, matchMedia mock)
├── App.tsx              # Root component
├── main.tsx             # Entry point (wrapped with ThemeProviderWrapper)
└── index.css            # Minimal global resets
```

### Theming Strategy

The application uses a centralized MUI theme system with full light/dark mode support:

**Theme Configuration** (`src/theme/theme.ts`):
- Light and dark mode palettes with proper semantic colors
- Typography scale using Helvetica font family
- Spacing scale (8px baseline)
- Component-level overrides for MUI components (Button, TextField, Paper, etc.)
- Smooth transitions and consistent shadows

**Theme Mode Management** (`src/theme/useThemeMode.ts`):
- Detects system preference via `prefers-color-scheme`
- Persists user preference in localStorage
- Provides `toggleMode()` and `setThemeMode()` functions
- Auto-updates on system preference changes

**Using Theme in Components**:
- Always use theme tokens instead of hard-coded values
- Access via `sx` prop: `sx={{ color: 'text.primary', backgroundColor: 'background.paper' }}`
- Use `theme.spacing()` for consistent spacing: `sx={{ p: 3, mt: 2 }}` (3 * 8px = 24px)
- Leverage theme palette: `primary.main`, `error.main`, `text.secondary`, etc.
- Use `action.hover`, `action.selected` for interactive states

**Design Tokens**:
- **Colors**: `primary.main` (#aa3bff light / #c084fc dark), `error.main`, `warning.main`, etc.
- **Text**: `text.primary`, `text.secondary`, `text.disabled`
- **Backgrounds**: `background.default`, `background.paper`
- **Spacing**: `theme.spacing(1)` = 8px, `theme.spacing(2)` = 16px, etc.
- **Shadows**: Use elevation levels (0-24) via Paper component
- **Typography**: `variant="h4"`, `variant="body1"`, etc.

**Example Component Styling**:
```tsx
<Box sx={{
  p: 4,                          // padding: 32px
  backgroundColor: 'background.paper',  // theme-aware background
  color: 'text.primary',         // theme-aware text color
  borderRadius: 2,               // 16px border radius
  boxShadow: 2,                  // theme shadow level 2
  '&:hover': {
    backgroundColor: 'action.hover',
  },
}}>
  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 500 }}>
    Title
  </Typography>
</Box>
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
   - Use MUI components for consistent styling (TextField, Button, Paper, etc.)
   - Style components using MUI theme tokens via `sx` prop
   - No standalone CSS files - all styling uses the centralized theme

### API Layer

- **Base URL**: Configured via Vite proxy to `http://localhost:8087`
- **Endpoints**:
  - `GET /api/products` - Fetch all products (returns paginated response, extract `content` array)
  - `POST /api/products` - Create new product
- **Error Handling**: Custom `ApiError` class with status code and response data

### Form Handling Pattern

Forms use react-hook-form with Zod validation and MUI TextField components:

1. Define Zod schema in form hooks (e.g., `useProductForm.ts`)
2. Use `zodResolver` to connect validation to react-hook-form
3. Form data types use string fields (even for numbers) for input binding
4. MUI TextField components handle validation display via `error` and `helperText` props
5. Convert to API types (numbers) before submission in the container hook

### Testing Pattern

- Tests co-located in `src/tests/` mirroring the source structure
- Use `renderWithTheme` helper from `src/tests/utils/test-utils.tsx` to wrap components with ThemeProvider
- Mock `global.fetch` for API tests
- Mock `window.matchMedia` in test setup for theme system compatibility
- Use `userEvent` for user interactions
- Use `getByLabelText` to query MUI TextField components
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
