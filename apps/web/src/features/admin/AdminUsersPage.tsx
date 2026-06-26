import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Role,
  UserStatus,
  type PaginatedUsers,
  type UserProfile,
} from '@ribbon/shared';
import { api } from '../../lib/api.js';
import { Badge, Card, PageHeading } from '../../components/ui.js';

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['users', search],
    queryFn: () =>
      api<PaginatedUsers>(`/users?search=${encodeURIComponent(search)}&pageSize=50`),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      api<UserProfile>(`/users/${id}/role`, { method: 'PATCH', body: { role } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      api<UserProfile>(`/users/${id}/status`, { method: 'PATCH', body: { status } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  return (
    <div>
      <PageHeading title="User management" subtitle="Manage roles and account access" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or email"
        className="mb-4 w-full max-w-sm rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ribbon focus:outline-none"
      />

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-sand text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/40">
                  Loading users…
                </td>
              </tr>
            )}
            {data?.items.map((u) => (
              <tr key={u.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-ink/60">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value as Role })}
                    className="rounded-md border border-ink/15 px-2 py-1 text-sm focus:border-ribbon focus:outline-none"
                  >
                    {Object.values(Role).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      statusMutation.mutate({
                        id: u.id,
                        status: u.status === UserStatus.ACTIVE ? UserStatus.DISABLED : UserStatus.ACTIVE,
                      })
                    }
                    className="cursor-pointer"
                    title="Toggle account access"
                  >
                    {u.status === UserStatus.ACTIVE ? (
                      <Badge>Active</Badge>
                    ) : (
                      <span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                        Disabled
                      </span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink/40">
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
