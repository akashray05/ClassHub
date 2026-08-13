import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

import { AppButton } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { useStorage } from "@/hooks/useStorage";
import { formatBytes, formatDate } from "@/utils";

import FoldersPage from "./FoldersPage";
import StatsCard from "../../components/common/StatsCard";
import { StatsCardSkeleton } from "@/components/common/StatsCardSkeleton";
import { FileTypeIcon } from "@/components/files";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data: summary, isLoading: isSummaryLoading } =
    useDashboardSummary();
  const { data: storage, isLoading: isStorageLoading } = useStorage();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      <header className="border-b border-border px-8 py-6">
        <h1 className="text-4xl font-bold text-primary">
          ClassHub 🚀
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back {user?.name ?? "Student"}
        </p>
      </header>

      <main className="p-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {isSummaryLoading || isStorageLoading ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="My Files"
                value={String(summary?.total_files ?? 0)}
                subtitle="Files uploaded"
              />

              <StatsCard
                title="Storage Used"
                value={storage ? formatBytes(storage.used) : "0 Bytes"}
                subtitle={
                  storage
                    ? `Available ${formatBytes(storage.available)}`
                    : undefined
                }
              />

              <StatsCard
                title="Shared Files"
                value={String(summary?.shared_files_count ?? 0)}
                subtitle="Shared by you"
              />

              <StatsCard
                title="Trash"
                value={String(summary?.trash_count ?? 0)}
                subtitle="Deleted files"
              />
            </>
          )}

        </div>

        <div className="mt-10">
          <FoldersPage />
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">
              Recent Activity
            </h2>
          </div>

          {isSummaryLoading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-3 w-12 shrink-0" />
                </div>
              ))}
            </div>
          ) : !summary || summary.recent_files.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
              No recent uploads yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {summary.recent_files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 py-3"
                >
                  <FileTypeIcon
                    filename={file.original_name}
                    className="h-8 w-8 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {file.original_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(file.file_size)}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(file.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <AppButton
          className="mt-8"
          onClick={handleLogout}
        >
          Logout
        </AppButton>

      </main>

    </div>
  );
}
