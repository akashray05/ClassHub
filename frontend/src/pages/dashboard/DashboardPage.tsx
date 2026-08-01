import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoldersPage from "./FoldersPage";
import { getCurrentUser } from "../../services/user";
import StatsCard from "../../components/common/StatsCard";
export default function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 px-8 py-6">
        <h1 className="text-4xl font-bold text-cyan-400">
          ClassHub 🚀
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome back {user?.name ?? "Student"}
        </p>
      </header>

      <main className="p-8">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatsCard
            title="My Files"
            value="0"
            subtitle="Files uploaded"
          />

          <StatsCard
            title="Storage Used"
            value="0 MB"
            subtitle="Available 10 GB"
          />

          <StatsCard
            title="Shared Files"
            value="0"
            subtitle="Shared by you"
          />

          <StatsCard
            title="Trash"
            value="0"
            subtitle="Deleted files"
          />

        </div>

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <FoldersPage />
          <h2 className="text-2xl font-semibold">
            Recent Activity
          </h2>

          <p className="mt-4 text-gray-400">
            No recent uploads yet.
          </p>

        </div>

        <Button
          className="mt-8"
          onClick={logout}
        >
          Logout
        </Button>

      </main>

    </div>
  );
}