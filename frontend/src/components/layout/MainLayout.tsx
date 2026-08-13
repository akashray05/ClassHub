import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="h-screen flex bg-background">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Header />

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}