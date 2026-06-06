import { useSalesManagement } from './useSalesManagement';
import { SalesTable } from '../SalesTable/SalesTable';
import { SalesDialog } from '../SalesDialog/SalesDialog';
import { Box, Alert, Typography } from '@mui/material';
import './SalesManagement.css';

export function SalesManagement() {
  const {
    sales,
    isLoading,
    isDialogOpen,
    dialogMode,
    selectedSale,
    isSubmitting,
    error,
    products,
    handleCreateClick,
    handleViewDetailsClick,
    handleDownloadClick,
    handleCloseDialog,
    handleCreateSale,
    handleDownloadJson,
    handlePrint,
  } = useSalesManagement();

  return (
    <Box className="sales-management">
      <Typography variant="h4" gutterBottom>
        Sales Management
      </Typography>

      {error && (
        <Alert severity="error" className="error-alert" onClose={() => {}}>
          {error}
        </Alert>
      )}

      <SalesTable
        sales={sales}
        isLoading={isLoading}
        onCreateClick={handleCreateClick}
        onViewDetailsClick={handleViewDetailsClick}
        onDownloadClick={handleDownloadClick}
      />

      <SalesDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        sale={selectedSale}
        onSubmit={handleCreateSale}
        isSubmitting={isSubmitting}
        products={products}
        onDownloadJson={handleDownloadJson}
        onPrint={handlePrint}
      />
    </Box>
  );
}
