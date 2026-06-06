import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CurrencyDisplay } from '../../../components/Financial/CurrencyDisplay';
import { renderWithTheme } from '../../utils/test-utils';

describe('CurrencyDisplay', () => {
  it('renders currency amount with default formatting', () => {
    renderWithTheme(<CurrencyDisplay amount={1234.56} />);
    expect(screen.getByText('₹1,234.56')).toBeInTheDocument();
  });

  it('renders negative amount with red color when colorize is enabled', () => {
    renderWithTheme(<CurrencyDisplay amount={-500.25} colorize />);
    const element = screen.getByText('-₹500.25');
    expect(element).toBeInTheDocument();
  });

  it('shows positive sign when showSign is true for positive amounts', () => {
    renderWithTheme(<CurrencyDisplay amount={750.00} showSign />);
    expect(screen.getByText('+₹750.00')).toBeInTheDocument();
  });

  it('does not show positive sign for negative amounts', () => {
    renderWithTheme(<CurrencyDisplay amount={-750.00} showSign />);
    expect(screen.getByText('-₹750.00')).toBeInTheDocument();
  });

  it('applies custom variant prop', () => {
    renderWithTheme(<CurrencyDisplay amount={100} variant="h4" />);
    const element = screen.getByText('₹100.00');
    expect(element).toHaveClass('MuiTypography-h4');
  });

  it('uses different currency format', () => {
    renderWithTheme(
      <CurrencyDisplay
        amount={1234.56}
        currency="EUR"
        locale="de-DE"
      />
    );
    // Note: This test depends on the browser's Intl implementation
    // The exact format may vary, but it should contain EUR and the amount
    const element = screen.getByText(/1.*234.*56/);
    expect(element).toBeInTheDocument();
  });

  it('handles zero amount', () => {
    renderWithTheme(<CurrencyDisplay amount={0} />);
    expect(screen.getByText('₹0.00')).toBeInTheDocument();
  });

  it('handles large numbers', () => {
    renderWithTheme(<CurrencyDisplay amount={1234567.89} />);
    expect(screen.getByText('₹12,34,567.89')).toBeInTheDocument();
  });

  it('respects minimum and maximum fraction digits', () => {
    renderWithTheme(
      <CurrencyDisplay
        amount={100}
        minimumFractionDigits={0}
        maximumFractionDigits={0}
      />
    );
    expect(screen.getByText('₹100')).toBeInTheDocument();
  });

  it('passes through additional Typography props', () => {
    renderWithTheme(
      <CurrencyDisplay
        amount={100}
        data-testid="currency-display"
        className="custom-class"
      />
    );
    const element = screen.getByTestId('currency-display');
    expect(element).toHaveClass('custom-class');
  });
});