import { useState, useEffect, useCallback } from 'react';
import type { AppRole, AuthUser } from '../types/auth';
import { normalizeRole } from '../types/auth';
import { listUsers, updateUserRole, ApiError } from '../services/usersApi';

interface UserRoleDraft {
  [userId: number]: AppRole;
}

export function useUsers() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<UserRoleDraft>({});
  const [savingUserId, setSavingUserId] = useState<number | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await listUsers();
      setUsers(fetched.map((user) => ({ ...user, role: normalizeRole(user.role) })));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load users');
      }
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const setDraftRole = useCallback((userId: number, role: AppRole) => {
    setDrafts((prev) => ({ ...prev, [userId]: role }));
  }, []);

  const saveRole = useCallback(async (userId: number) => {
    const role = drafts[userId];
    if (!role) return;

    setSavingUserId(userId);
    setError(null);
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, role: normalizeRole(updated.role) } : user,
        ),
      );
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to update role: ${err.message}`);
      } else {
        setError('Failed to update role');
      }
    } finally {
      setSavingUserId(null);
    }
  }, [drafts]);

  const isDirty = useCallback(
    (userId: number, role: AppRole) => drafts[userId] !== undefined && drafts[userId] !== role,
    [drafts],
  );

  return {
    users,
    isLoading,
    error,
    savingUserId,
    drafts,
    loadUsers,
    setDraftRole,
    saveRole,
    isDirty,
  };
}
