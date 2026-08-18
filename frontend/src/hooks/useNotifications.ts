import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification";

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useNotificationsList(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => listNotifications(1, 20),
    enabled,
    staleTime: 10_000,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();

  async function markRead(notificationId: number) {
    await markNotificationRead(notificationId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function markAllRead() {
    await markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return { markRead, markAllRead };
}
