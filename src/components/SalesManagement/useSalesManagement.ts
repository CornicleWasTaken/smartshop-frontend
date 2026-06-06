import { useState, useEffect, useCallback } from 'react';
import type { Sale, SaleFormData, CreateSaleRequest } from '../../types/sale';
import type { SaleDialogMode } from '../../types/sale';
import { fetchSales, createSale, fetchSaleById } from '../../services/salesApi';
import { ApiError } from '../../services/productApi';
import { fetchProducts } from '../../services/productApi';
import type { Product } from '../../types/product';

export function useSalesManagement() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SaleDialogMode>('create');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const loadSales = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedSales = await fetchSales();
      setSales(fetchedSales);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load sales');
      }
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Failed to load products for sale form:', err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, [loadSales, loadProducts]);

  const handleCreateClick = () => {
    setDialogMode('create');
    setSelectedSale(null);
    setIsDialogOpen(true);
  };

  const handleViewDetailsClick = async (sale: Sale) => {
    try {
      const fullSale = await fetchSaleById(sale.saleId);
      setSelectedSale(fullSale);
      setDialogMode('view-details');
      setIsDialogOpen(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to load sale details: ${err.message}`);
      } else {
        setError('Failed to load sale details');
      }
    }
  };

  const handleDownloadClick = (sale: Sale) => {
    setSelectedSale(sale);
    setDialogMode('download-options');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSale(null);
  };

  const handleCreateSale = async (formData: SaleFormData) => {
    const items = formData.items.map(item => ({
      productId: parseInt(item.productId, 10),
      quantity: parseInt(item.quantity, 10),
    }));

    const request: CreateSaleRequest = {
      customerPhone: formData.customerPhone || undefined,
      items,
    };

    setIsSubmitting(true);
    try {
      await createSale(request);
      await loadSales();
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to create sale: ${err.message}`);
      } else {
        setError('Failed to create sale');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadJson = (sale: Sale) => {
    const blob = new Blob([JSON.stringify(sale, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sale-${sale.saleId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (sale: Sale) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Sale #${sale.saleId}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Sale Record #${sale.saleId}</h1>
            <p><strong>Date:</strong> ${new Date(sale.saleDate).toLocaleString()}</p>
            <p><strong>Customer:</strong> ${sale.customerPhone || 'N/A'}</p>
            <p><strong>Status:</strong> ${sale.status}</p>
            <p><strong>Total:</strong> $${sale.totalAmount.toFixed(2)}</p>
            <h2>Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f0f0f0;">
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Quantity</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Unit Price</th>
                  <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Line Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items.map(item => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.productName}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">$${item.lineTotal.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return {
    sales,
    isLoading,
    isDialogOpen,
    dialogMode,
    selectedSale,
    error,
    isSubmitting,
    products,
    handleCreateClick,
    handleViewDetailsClick,
    handleDownloadClick,
    handleCloseDialog,
    handleCreateSale,
    handleDownloadJson,
    handlePrint,
  };
}
