export interface AppNotification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  actor_id: number | null;
  file_id: number | null;
  created_at: string;
}

export interface NotificationList {
  page: number;
  limit: number;
  total: number;
  unread_count: number;
  notifications: AppNotification[];
}
