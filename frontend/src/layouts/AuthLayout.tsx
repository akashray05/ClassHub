import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50">

      {/* Left: brand panel */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-teal-800 px-10 py-10 text-teal-50 lg:flex">

        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/15">
            <GraduationCap className="size-12.5" />
          </div>
          <span className="text-[30px] font-semibold tracking-tight">
            ClassHub
          </span>
        </div>

        <div>
          <h2 className="max-w-sm text-[30px] font-semibold leading-tight tracking-tight">
            Your coursework, organized in one place.
          </h2>
          <p className="mt-3 max-w-sm text-[16px] text-teal-100/80">
            Upload notes, share readings with classmates, and never lose
            track of a file before a deadline again.
          </p>
        </div>

        <p className="text-[14px] text-teal-100/60">
          Built for IIT Bombay students.
        </p>

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-teal-600/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-10 size-56 rounded-full bg-teal-500/20 blur-3xl"
        />
      </div>

      {/* Right: form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <div className="flex size-7 items-center justify-center rounded-lg bg-teal-700 text-white">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-[14px] font-semibold text-neutral-900">
              ClassHub
            </span>
          </div>

          <Outlet />

        </div>
      </div>

    </div>
  );
}
