import { api } from "./api";
import type { AppNotification, NotificationList } from "@/types/notification";

export async function listNotifications(
  page = 1,
  limit = 20
): Promise<NotificationList> {
  const response = await api.get<NotificationList>("/notifications/", {
    params: { page, limit },
  });

  return response.data;
}

export async function getUnreadCount(): Promise<number> {
  const response = await api.get<{ unread_count: number }>(
    "/notifications/unread-count"
  );

  return response.data.unread_count;
}

export async function markNotificationRead(
  notificationId: number
): Promise<AppNotification> {
  const response = await api.patch<AppNotification>(
    `/notifications/${notificationId}/read`
  );

  return response.data;
}

export async function markAllNotificationsRead(): Promise<{
  message: string;
}> {
  const response = await api.post<{ message: string }>(
    "/notifications/read-all"
  );

  return response.data;
}
