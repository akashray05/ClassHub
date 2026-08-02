import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Users,
  Trash2,
  Settings,
  HardDrive,
} from "lucide-react";

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
    title: "Shared",
    icon: Users,
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

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col text-white">

      {/* Logo */}
      <div className="p-6 border-b border-slate-800">

        <h1 className="text-3xl font-extrabold text-cyan-400">
          🚀 ClassHub
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          IIT Bombay Media Server
        </p>

      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                active
                  ? "bg-cyan-500 text-black font-semibold shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}

      </nav>

      {/* Storage Card */}

      <div className="p-4 border-t border-slate-800">

        <div className="rounded-xl bg-slate-800 p-4">

          <div className="flex items-center gap-2 mb-3">

            <HardDrive
              className="text-cyan-400"
              size={18}
            />

            <span className="font-medium">
              Storage
            </span>

          </div>

          <div className="w-full h-3 rounded-full bg-slate-700 overflow-hidden">

            <div className="bg-cyan-400 h-full w-[18%]" />

          </div>

          <div className="mt-2 text-sm text-slate-400">

            1.8 GB of 10 GB used

          </div>

        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          ClassHub v1.0-dev
        </div>

      </div>

    </aside>
  );
}