import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  Share2,
  Trash2,
  Settings,
  HardDrive,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

import { useStorage } from "@/hooks/useStorage";
import { useAuth } from "@/hooks/useAuth";
import { formatBytes } from "@/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "My Files",
    icon: Folder,
    path: "/dashboard",
  },
  {
    title: "Shared with me",
    icon: Users,
    path: "/shared?tab=with-me",
  },
  {
    title: "Shared by me",
    icon: Share2,
    path: "/shared?tab=by-me",
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
  const { data: storage, isLoading: isStorageLoading } = useStorage();
  const { user } = useAuth();

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

  return (
    <aside className="w-72 bg-card border-r border-border flex flex-col text-foreground">

      {/* Logo */}
<div className="p-6 border-b border-border">
  <div className="flex items-center gap-3">
    <GraduationCap
      className="text-primary shrink-0"
      size={42}
      strokeWidth={2.5}
    />

    <h1 className="text-3xl font-extrabold text-primary">
      ClassHub
    </h1>
  </div>

  <p className="text-muted-foreground text-sm mt-2">
    IIT Bombay Media Server
  </p>
</div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        {items.map((item) => {
          const Icon = item.icon;

          const active =
            `${location.pathname}${location.search}` === item.path;

          return (
            <Link
              key={item.title}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}

      </nav>

      {/* Storage Card */}

      <div className="p-4 border-t border-border">

        <div className="rounded-xl bg-muted p-4">

          <div className="flex items-center gap-2 mb-3">

            <HardDrive
              className="text-primary"
              size={18}
            />

            <span className="font-medium">
              Storage
            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">

            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${usagePercent}%` }}
            />

          </div>

          <div className="mt-2 text-sm text-muted-foreground">

            {isStorageLoading || !storage
              ? "Loading storage..."
              : `${formatBytes(storage.used)} of ${formatBytes(storage.quota)} used`}

          </div>

        </div>

        <div className="mt-3 text-center text-xs text-muted-foreground">
        ClassHub v1.0-beta
        </div>

      </div>

    </aside>
  );
}