import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-900">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold text-cyan-400">
            ClassHub
          </h1>

          <p className="mt-6 text-slate-300 text-lg">
            Secure file sharing platform for IIT Bombay students.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center p-8">
        <Outlet />
      </div>
    </div>
  );
}