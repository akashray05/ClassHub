import { useState } from "react";
import { Bell, CheckCheck, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";

import {
  useUnreadCount,
  useNotificationsList,
  useNotificationActions,
} from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification";

function iconFor(type: string) {
  if (type === "file_shared") {
    return <Share2 className="h-4 w-4 text-primary" />;
  }

  return <Bell className="h-4 w-4 text-primary" />;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadCount();

  const [open, setOpen] = useState(false);

  const { data, isLoading } = useNotificationsList(open);
  const { markRead, markAllRead } = useNotificationActions();

  const notifications = data?.notifications ?? [];

  async function handleClick(notification: AppNotification) {
    if (!notification.is_read) {
      await markRead(notification.id);
    }

    setOpen(false);
    navigate("/shared?tab=with-me");
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <button
          type="button"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 bg-card border-border text-foreground p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllRead()}
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              You're all caught up.
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleClick(notification)}
                className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-muted ${
                  notification.is_read ? "" : "bg-accent/40"
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {iconFor(notification.type)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-foreground">
                    {notification.message}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {formatDate(notification.created_at)}
                  </span>
                </span>

                {!notification.is_read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
