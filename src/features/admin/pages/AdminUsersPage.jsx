import { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, UserCheck, UserX, Users } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, ConfirmModal, Input, Select, Table } from '@components/ui';
import { formatDate } from '@lib/format';
import { DEFAULT_PAGE_SIZE } from '@lib/constants';
import { useAuth } from '@features/auth/useAuth';
import { useToast } from '@features/toast/useToast';
import {
  useListAdminUsersQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from '../adminApi';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active Only' },
  { value: 'inactive', label: 'Inactive Only' },
];

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  // Action modals
  const [pendingStatusToggle, setPendingStatusToggle] = useState(null);
  const [pendingRoleToggle, setPendingRoleToggle] = useState(null);

  const { data, isFetching } = useListAdminUsersQuery({
    page,
    limit: pageSize,
    search: search.trim(),
    role,
    status,
  });

  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const users = data?.items ?? [];
  const meta = data?.meta;

  const handleConfirmStatusToggle = async () => {
    if (!pendingStatusToggle) return;
    const nextStatus = !pendingStatusToggle.isActive;
    const res = await updateUserStatus({ id: pendingStatusToggle.id, isActive: nextStatus });
    if (res.error) {
      toast.error(res.error.message || 'Failed to update user status.');
    } else {
      toast.success(
        `User ${pendingStatusToggle.email} has been ${nextStatus ? 'activated' : 'deactivated'}.`
      );
    }
    setPendingStatusToggle(null);
  };

  const handleConfirmRoleToggle = async () => {
    if (!pendingRoleToggle) return;
    const nextRole = pendingRoleToggle.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const res = await updateUserRole({ id: pendingRoleToggle.id, role: nextRole });
    if (res.error) {
      toast.error(res.error.message || 'Failed to update user role.');
    } else {
      toast.success(`User ${pendingRoleToggle.email} role changed to ${nextRole}.`);
    }
    setPendingRoleToggle(null);
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 ring-1 ring-brand-200">
            {(row.fullName || row.email || 'U').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="truncate font-medium text-slate-800 block text-xs">
              {row.fullName || 'No Name Provided'}
            </span>
            <span className="truncate text-xs text-slate-500 block">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Badge tone={row.role === 'ADMIN' ? 'brand' : 'neutral'} className="text-[11px] gap-1">
          {row.role === 'ADMIN' ? <ShieldCheck className="size-3" /> : null}
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.isActive ? 'success' : 'danger'} className="text-[11px]">
          {row.isActive ? 'Active' : 'Deactivated'}
        </Badge>
      ),
    },
    {
      key: 'documents',
      header: 'Documents',
      align: 'right',
      render: (row) => (
        <span className="font-semibold text-slate-700 text-xs">
          {row._count?.documents ?? 0}
        </span>
      ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last Login',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.lastLoginAt ? formatDate(row.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (row) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const isSelf = row.id === currentUser?.id;
        return (
          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Role promotion / demotion */}
            <Button
              variant="outline"
              size="sm"
              disabled={isSelf && row.role === 'ADMIN'}
              title={isSelf ? 'Cannot demote yourself' : `Change role to ${row.role === 'ADMIN' ? 'USER' : 'ADMIN'}`}
              onClick={() => setPendingRoleToggle(row)}
              className="text-[11px] px-2.5 py-1"
            >
              {row.role === 'ADMIN' ? 'Demote' : 'Promote'}
            </Button>

            {/* Status activation toggle */}
            <Button
              variant={row.isActive ? 'danger' : 'secondary'}
              size="sm"
              disabled={isSelf}
              title={isSelf ? 'Cannot deactivate yourself' : row.isActive ? 'Deactivate user' : 'Activate user'}
              onClick={() => setPendingStatusToggle(row)}
              className="text-[11px] px-2.5 py-1"
            >
              {row.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Card */}
      <Card className="p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table Card */}
      <Card className="shadow-xs">
        <CardHeader
          title="User Accounts Directory"
          description={meta ? `${meta.total} registered user(s) matching filter` : 'Loading users…'}
        />
        <Table
          columns={columns}
          data={users}
          isLoading={isFetching}
          emptyIcon={<Users className="size-6 text-slate-400" />}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your search criteria or role filters."
          containerClassName="rounded-none border-0"
          pagination={
            meta
              ? {
                  page,
                  pageSize,
                  total: meta.total,
                  onPageChange: setPage,
                  onPageSizeChange: (size) => {
                    setPageSize(size);
                    setPage(1);
                  },
                }
              : undefined
          }
        />
      </Card>

      {/* Confirm Status Change Modal */}
      <ConfirmModal
        isOpen={Boolean(pendingStatusToggle)}
        onClose={() => setPendingStatusToggle(null)}
        onConfirm={handleConfirmStatusToggle}
        isLoading={isUpdatingStatus}
        title={pendingStatusToggle?.isActive ? 'Deactivate user account?' : 'Activate user account?'}
        message={
          pendingStatusToggle?.isActive
            ? `Are you sure you want to deactivate ${pendingStatusToggle?.email}? They will no longer be able to log in or use the platform.`
            : `Are you sure you want to activate ${pendingStatusToggle?.email}? Their access will be restored.`
        }
        confirmLabel={pendingStatusToggle?.isActive ? 'Deactivate' : 'Activate'}
      />

      {/* Confirm Role Change Modal */}
      <ConfirmModal
        isOpen={Boolean(pendingRoleToggle)}
        onClose={() => setPendingRoleToggle(null)}
        onConfirm={handleConfirmRoleToggle}
        isLoading={isUpdatingRole}
        title={`Change role to ${pendingRoleToggle?.role === 'ADMIN' ? 'USER' : 'ADMIN'}?`}
        message={`Are you sure you want to change the privileges of ${pendingRoleToggle?.email} to ${
          pendingRoleToggle?.role === 'ADMIN' ? 'Standard User' : 'Administrator'
        }?`}
        confirmLabel="Change Role"
      />
    </div>
  );
};

export default AdminUsersPage;
