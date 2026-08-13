import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  HardDrive,
  Files,
  Share2,
  MoreVertical,
  Ban,
  CheckCircle2,
  Crown,
  Trash2,
} from "lucide-react";
import type { AxiosError } from "axios";

import {
  getAdminStats,
  listAdminUsers,
  updateUserStatus,
  updateUserRole,
  deleteAdminUser,
} from "@/services/admin";
import type { AdminUser, AdminStats } from "@/types/admin";
import type { MessageResponse } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { formatBytes } from "@/utils";

import StatsCard from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const { user: currentUser } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadStats() {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadUsers(targetPage = page) {
    try {
      const data = await listAdminUsers(targetPage, 20);
      setUsers(data.users);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function updateLocalUser(updated: AdminUser) {
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  }

  async function handleToggleStatus(user: AdminUser) {
    setBusyId(user.id);

    try {
      const updated = await updateUserStatus(user.id, !user.is_active);

      updateLocalUser(updated);

      toast.add({
        title: updated.is_active ? "User activated" : "User deactivated",
        description: `${updated.name} is now ${
          updated.is_active ? "active" : "deactivated"
        }.`,
        type: "success",
      });
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Action failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Something went wrong.",
        type: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleRole(user: AdminUser) {
    setBusyId(user.id);

    try {
      const updated = await updateUserRole(user.id, !user.is_admin);

      updateLocalUser(updated);

      toast.add({
        title: updated.is_admin ? "Promoted to admin" : "Admin access removed",
        description: `${updated.name} is now ${
          updated.is_admin ? "an admin" : "a regular user"
        }.`,
        type: "success",
      });
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Action failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Something went wrong.",
        type: "error",
      });
    } finally {
      setBusyId(null);
    }
  }

  function openDeleteDialog(user: AdminUser) {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  }

  async function handleDeleteUser() {
    if (!userToDelete) return;

    setIsDeleting(true);

    try {
      await deleteAdminUser(userToDelete.id);

      toast.add({
        title: "User deleted",
        description: `${userToDelete.name}'s account and all their files have been removed.`,
        type: "success",
      });

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setIsDeleteOpen(false);
      loadStats();
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Delete failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not delete this user.",
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-10 text-foreground">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Admin</h1>
      </div>

      <p className="text-muted-foreground mb-8">
        Manage users and see how ClassHub is being used across campus.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
        <StatsCard
          title="Total users"
          value={stats ? stats.total_users : "—"}
          icon={<Users />}
        />

        <StatsCard
          title="Active users"
          value={stats ? stats.active_users : "—"}
          icon={<CheckCircle2 />}
        />

        <StatsCard
          title="Total files"
          value={stats ? stats.total_files : "—"}
          icon={<Files />}
        />

        <StatsCard
          title="Storage used"
          value={stats ? formatBytes(stats.total_storage_used) : "—"}
          icon={<HardDrive />}
        />

        <StatsCard
          title="Total folders"
          value={stats ? stats.total_folders : "—"}
          icon={<Files />}
        />

        <StatsCard
          title="Admins"
          value={stats ? stats.admin_users : "—"}
          icon={<Crown />}
        />

        <StatsCard
          title="Verified users"
          value={stats ? stats.verified_users : "—"}
          icon={<ShieldCheck />}
        />

        <StatsCard
          title="Active shares"
          value={stats ? stats.total_shares : "—"}
          icon={<Share2 />}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">All users</h2>

      {loading ? (
        <p className="text-muted-foreground">Loading users...</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-card text-muted-foreground text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Storage</th>
                <th className="px-4 py-3 font-medium">Files</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-background">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.name}
                      {currentUser?.id === user.id && (
                        <span className="text-xs text-muted-foreground">(you)</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>

                  <td className="px-4 py-3">
                    <Badge variant={user.is_admin ? "default" : "outline"}>
                      {user.is_admin ? "Admin" : "User"}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <Badge
                      variant={user.is_active ? "default" : "destructive"}
                    >
                      {user.is_active ? "Active" : "Deactivated"}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {formatBytes(user.storage_used)} /{" "}
                    {formatBytes(user.storage_quota)}
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-sm">
                    {user.file_count}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={busyId === user.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="bg-card border-border text-foreground">
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.is_active ? (
                            <>
                              <Ban className="h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleToggleRole(user)}
                        >
                          <Crown className="h-4 w-4" />
                          {user.is_admin ? "Remove admin" : "Make admin"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(user)}
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              {userToDelete
                ? `Permanently delete "${userToDelete.name}" (${userToDelete.email})? This also deletes all their folders and files. This cannot be undone.`
                : "Permanently delete this user?"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
