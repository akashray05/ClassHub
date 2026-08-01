import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 p-5">

        <h1 className="text-3xl font-bold text-cyan-400">
          ClassHub 🚀
        </h1>

      </header>

      <main className="p-8">
        <Outlet />
      </main>

    </div>
  );
}