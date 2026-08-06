import { Search, Bell, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName = user?.name || "Student";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-8 flex items-center justify-between">

      {/* Search */}

      <div className="relative w-[420px]">

        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <Input
          placeholder="Search files..."
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />

      </div>

      <div className="flex items-center gap-5">

        <Bell
          size={20}
          className="text-slate-400"
        />

        <DropdownMenu>

          <DropdownMenuTrigger>

            <Button
              variant="ghost"
              className="flex items-center gap-3"
            >

              <Avatar>

                <AvatarFallback className="bg-cyan-500 text-black font-bold">

                  {displayName[0].toUpperCase()}

                </AvatarFallback>

              </Avatar>

              <span className="text-white">
                {displayName}
              </span>

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-slate-900 border-slate-700 text-white"
          >

            <DropdownMenuItem onClick={() => navigate("/settings")}>

              <User size={16} />

              Profile

            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate("/settings")}>

              <Settings size={16} />

              Settings

            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
            >

              <LogOut size={16} />

              Logout

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>
  );
}
