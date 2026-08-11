import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManagerOverrideDialog } from '../../components/Auth/ManagerOverrideDialog';

vi.mock('../../services/authApi', () => ({
  verifyManager: vi.fn(),
}));

import { verifyManager } from '../../services/authApi';
const mockedVerifyManager = vi.mocked(verifyManager);

describe('ManagerOverrideDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('verifies the password and calls onSuccess with the elevated token', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onClose = vi.fn();
    mockedVerifyManager.mockResolvedValue({
      accessToken: 'elevated-token',
      tokenType: 'Bearer',
      user: { userId: 1, username: 'manager', email: 'm@example.com', firstName: 'M', role: 'MANAGER' },
    });

    render(<ManagerOverrideDialog isOpen onClose={onClose} onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Password'), 'Pass123!');
    await user.click(screen.getByText('Confirm'));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith('elevated-token'));
    expect(mockedVerifyManager).toHaveBeenCalledWith('Pass123!');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows an error when verification fails', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    mockedVerifyManager.mockRejectedValue(new Error('forbidden'));

    render(<ManagerOverrideDialog isOpen onClose={vi.fn()} onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByText('Confirm'));

    await waitFor(() =>
      expect(
        screen.getByText('Password verification failed. You may not be authorized to override.'),
      ).toBeInTheDocument(),
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('does not verify when cancelled', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ManagerOverrideDialog isOpen onClose={onClose} onSuccess={vi.fn()} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockedVerifyManager).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});