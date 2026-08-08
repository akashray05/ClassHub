import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Folder,
  Users,
  Share2,
  Trash2,
  Settings,
  ShieldCheck,
  GraduationCap,
  LogOut,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useAuth } from "@/hooks/useAuth";
import { formatBytes } from "@/utils";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "My folders",
    icon: Folder,
    path: "/dashboard",
  },
  {
    title: "Shared with me",
    icon: Users,
    path: "/shared",
  },
  {
    title: "Shared by me",
    icon: Share2,
    path: "/shared",
  },
  {
    title: "Trash",
    icon: Trash2,
    path: "/trash",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: storage, isLoading: isStorageLoading } = useStorage();
  const { user, logout } = useAuth();

  const usagePercent = storage
    ? Math.min(100, Math.round(storage.usage_percent))
    : 0;

  const items = user?.is_admin
    ? [
        ...menuItems,
        {
          title: "Admin",
          icon: ShieldCheck,
          path: "/admin",
        },
      ]
    : menuItems;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap size={20} />
        </div>

        <span className="text-lg font-semibold tracking-tight">
          ClassHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={`${item.path}-${index}`}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Storage + account */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {isStorageLoading || !storage
              ? "Loading storage..."
              : `${formatBytes(storage.used)} of ${formatBytes(storage.quota)} used`}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-background/60 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold uppercase">
            {(user?.name || "U")[0]}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "Loading..."}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
            {user?.id !== undefined && (
              <p className="truncate text-[11px] text-muted-foreground/70">
                Your ID: {user.id}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
