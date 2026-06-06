import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Assessment as AssessmentIcon, Dashboard as DashboardIcon, ReceiptLong as ReceiptLongIcon, ShowChart as ShowChartIcon, LocalMall as LocalMallIcon } from '@mui/icons-material';

const reportCards = [
  {
    title: 'Financial Dashboard',
    description: 'Overview of sales, expenses, profit, and trend charts.',
    icon: DashboardIcon,
    to: '/financial',
    action: 'Open Dashboard',
  },
  {
    title: 'Expense Management',
    description: 'Review, filter, and manage expense records.',
    icon: ReceiptLongIcon,
    to: '/financial/expenses',
    action: 'Manage Expenses',
  },
  {
    title: 'Sales Analytics',
    description: 'Track sales activity and transaction history.',
    icon: ShowChartIcon,
    to: '/sales',
    action: 'View Sales',
  },
  {
    title: 'Product Catalog',
    description: 'Inspect product inventory and product details.',
    icon: LocalMallIcon,
    to: '/',
    action: 'Open Products',
  },
];

const insightItems = [
  'Revenue and profit trends',
  'Expense breakdowns by category',
  'Sales performance by period',
  'Balance sheet and summary reports',
];

export function ReportsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AssessmentIcon color="primary" />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Reports
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Jump into the key reporting areas for finance, sales, and inventory.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {reportCards.map((card) => {
          const Icon = card.icon;

          return (
            <Grid key={card.title} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ height: '100%' }} elevation={2}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                      <Icon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {card.title}
                      </Typography>
                      <Chip size="small" label="Available" color="success" variant="outlined" sx={{ mt: 0.5 }} />
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button component={RouterLink} to={card.to} variant="contained">
                    {card.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ mt: 4 }} elevation={1}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            What you can review here
          </Typography>
          <Grid container spacing={2}>
            {insightItems.map((item) => (
              <Grid key={item} size={{ xs: 12, sm: 6 }}>
                <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2">{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
