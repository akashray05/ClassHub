import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, Download, Ban, Check, X } from "lucide-react";
import type { AxiosError } from "axios";

import {
  getSharedWithMe,
  getSharedByMe,
  removeShare,
  updateSharePermission,
  downloadSharedFile,
} from "@/services/share";
import type { SharedWithMeItem, SharedByMeItem } from "@/types/share";
import type { MessageResponse } from "@/types/auth";

import { AppCard, AppButton } from "@/components/app";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { ListSkeleton } from "@/components/common/ListRowSkeleton";
import { formatBytes } from "@/utils";

type TabKey = "with-me" | "by-me";

export default function SharedPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab: TabKey =
    searchParams.get("tab") === "by-me" ? "by-me" : "with-me";

  const [tab, setTab] = useState<TabKey>(initialTab);

  function selectTab(next: TabKey) {
    setTab(next);
    setSearchParams({ tab: next }, { replace: true });
  }

  const [sharedWithMe, setSharedWithMe] = useState<SharedWithMeItem[]>([]);
  const [sharedByMe, setSharedByMe] = useState<SharedByMeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [revokingKey, setRevokingKey] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function loadAll() {
    setLoading(true);

    try {
      const [withMe, byMe] = await Promise.all([
        getSharedWithMe(),
        getSharedByMe(),
      ]);

      setSharedWithMe(withMe);
      setSharedByMe(byMe.filter((item) => item.shared_with.length > 0));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleDownload(item: SharedWithMeItem) {
    if (!item.can_download) {
      toast.add({
        title: "Download not allowed",
        description: "The owner hasn't granted download access to this file.",
        type: "error",
      });
      return;
    }

    setDownloadingId(item.file_id);

    try {
      await downloadSharedFile(item.file_id, item.original_name);
    } catch (error) {
      console.error(error);

      toast.add({
        title: "Download failed",
        description: "Could not download this file.",
        type: "error",
      });
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleRevoke(fileId: number, userId: number) {
    const key = `${fileId}-${userId}`;
    setRevokingKey(key);

    try {
      await removeShare(fileId, userId);

      toast.add({
        title: "Access revoked",
        description: "This user can no longer access the file.",
        type: "success",
      });

      setSharedByMe((prev) =>
        prev
          .map((item) =>
            item.file_id === fileId
              ? {
                  ...item,
                  shared_with: item.shared_with.filter(
                    (user) => user.id !== userId
                  ),
                }
              : item
          )
          .filter((item) => item.shared_with.length > 0)
      );
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Failed to revoke access",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Something went wrong.",
        type: "error",
      });
    } finally {
      setRevokingKey(null);
    }
  }

  async function handleTogglePermission(
    fileId: number,
    userId: number,
    nextCanDownload: boolean
  ) {
    try {
      await updateSharePermission(fileId, userId, nextCanDownload);

      toast.add({
        title: "Permission updated",
        description: nextCanDownload
          ? "This user can now download the file."
          : "This user can no longer download the file.",
        type: "success",
      });
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Failed to update permission",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Something went wrong.",
        type: "error",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background p-10 text-foreground">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold text-primary">Shared</h1>
      </div>

      <p className="text-muted-foreground mb-8">
        Files other people have shared with you, and files you've shared.
      </p>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => selectTab("with-me")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            tab === "with-me"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground/80 hover:bg-muted"
          }`}
        >
          Shared with me ({sharedWithMe.length})
        </button>

        <button
          onClick={() => selectTab("by-me")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            tab === "by-me"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground/80 hover:bg-muted"
          }`}
        >
          Shared by me ({sharedByMe.length})
        </button>
      </div>

      {loading ? (
        <ListSkeleton />
      ) : (
        <>
          {tab === "with-me" && (
            sharedWithMe.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Users className="h-20 w-20 text-muted-foreground/60" />

            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              Nothing shared with you yet
            </h2>

            <p className="mt-2 text-muted-foreground text-center max-w-md">
              When classmates share files with you, they'll show up here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sharedWithMe.map((item) => (
              <AppCard key={item.file_id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.original_name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {formatBytes(item.file_size)}
                    </p>
                  </div>

                  <Badge variant={item.can_download ? "default" : "outline"}>
                    {item.can_download ? "Downloadable" : "View only"}
                  </Badge>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Shared by{" "}
                  <span className="text-foreground">{item.owner_name}</span>
                  <br />
                  <span className="text-muted-foreground">{item.owner_email}</span>
                </p>

                <AppButton
                  className="mt-4 w-full"
                  variant="outline"
                  disabled={
                    !item.can_download || downloadingId === item.file_id
                  }
                  onClick={() => handleDownload(item)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadingId === item.file_id
                    ? "Downloading..."
                    : "Download"}
                </AppButton>
              </AppCard>
            ))}
          </div>
        )
      )}

      {tab === "by-me" && (
        sharedByMe.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Users className="h-20 w-20 text-muted-foreground/60" />

            <h2 className="mt-6 text-2xl font-semibold text-foreground">
              You haven't shared anything yet
            </h2>

            <p className="mt-2 text-muted-foreground text-center max-w-md">
              Share a file from any folder to see it listed here along with
              who has access.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sharedByMe.map((item) => (
              <AppCard key={item.file_id} className="p-5">
                <h3 className="font-semibold text-foreground mb-3">
                  {item.original_name}
                </h3>

                <div className="space-y-2">
                  {item.shared_with.map((user) => {
                    const key = `${item.file_id}-${user.id}`;

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <AppButton
                            size="icon-sm"
                            variant="outline"
                            aria-label="Toggle download permission"
                            onClick={() =>
                              handleTogglePermission(
                                item.file_id,
                                user.id,
                                true
                              )
                            }
                          >
                            <Check className="h-3.5 w-3.5" />
                          </AppButton>

                          <AppButton
                            size="icon-sm"
                            variant="outline"
                            aria-label="Revoke download permission"
                            onClick={() =>
                              handleTogglePermission(
                                item.file_id,
                                user.id,
                                false
                              )
                            }
                          >
                            <X className="h-3.5 w-3.5" />
                          </AppButton>

                          <AppButton
                            size="icon-sm"
                            variant="outline"
                            disabled={revokingKey === key}
                            aria-label="Remove access"
                            onClick={() =>
                              handleRevoke(item.file_id, user.id)
                            }
                          >
                            <Ban className="h-3.5 w-3.5 text-destructive" />
                          </AppButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AppCard>
            ))}
          </div>
        )
      )}
        </>
      )}
    </div>
  );
}
