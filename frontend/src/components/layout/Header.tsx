import { useState } from "react";
import { Search, Bell, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [query, setQuery] = useState("");

  const displayName = user?.name || "Student";

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">

      {/* Search */}

      <form onSubmit={handleSearchSubmit} className="relative w-[420px]">

        <Search
          size={18}
          className="absolute left-3 top-2 text-muted-foreground"
        />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="pl-10 bg-muted border-border text-foreground"
        />

      </form>

      <div className="flex items-center gap-5">

        <Bell
          size={20}
          className="text-muted-foreground"
        />

        <DropdownMenu>

          <DropdownMenuTrigger>

            <Button
              variant="ghost"
              className="flex items-center gap-3"
            >

              <Avatar>

                <AvatarFallback className="bg-primary text-primary-foreground font-bold">

                  {displayName[0].toUpperCase()}

                </AvatarFallback>

              </Avatar>

              <span className="text-foreground">
                {displayName}
              </span>

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="bg-card border-border text-foreground"
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
