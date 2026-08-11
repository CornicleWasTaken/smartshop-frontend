import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { AppRole } from '../../types/auth';
import { useUsers } from '../../hooks/useUsers';

const ROLE_OPTIONS: AppRole[] = ['ADMIN', 'MANAGER', 'CASHIER'];

export function UsersPage() {
  const { users, isLoading, error, savingUserId, drafts, setDraftRole, saveRole, isDirty } = useUsers();

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 500, mb: 3 }}>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    color: 'text.primary',
                    fontWeight: 'bold',
                    backgroundColor: 'background.default',
                  },
                }}
              >
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary' }}>
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell sx={{ color: 'text.primary' }}>{user.username}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={drafts[user.userId] ?? user.role}
                        onChange={(event) => setDraftRole(user.userId, event.target.value as AppRole)}
                        disabled={savingUserId === user.userId}
                        aria-label={`Role for ${user.username}`}
                        sx={{ minWidth: 120 }}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        disabled={savingUserId === user.userId || !isDirty(user.userId, user.role)}
                        onClick={() => saveRole(user.userId)}
                      >
                        {savingUserId === user.userId ? 'Saving...' : 'Save'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
