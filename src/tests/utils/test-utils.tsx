import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProviderWrapper } from '../../theme/ThemeProviderWrapper';

/**
 * Custom render function that wraps components with ThemeProvider
 */
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: ThemeProviderWrapper, ...options });
}

export * from '@testing-library/react';
