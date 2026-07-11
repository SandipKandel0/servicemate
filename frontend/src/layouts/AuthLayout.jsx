import { ShieldCheck, Cog } from "lucide-react";

export default function AuthLayout({ children, tagline }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-900 px-12 py-12 text-white lg:flex">
        <Cog className="absolute -right-10 -top-10 h-56 w-56 text-white/10" strokeWidth={1} />
        <Cog className="absolute -bottom-16 -left-10 h-64 w-64 text-white/10" strokeWidth={1} />

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">ServiceMate</span>
        </div>

        <div className="relative z-10">
          <ShieldCheck className="h-20 w-20 text-white/90" strokeWidth={1.25} />
          <h2 className="mt-8 text-3xl font-semibold leading-tight">
            Keep every vehicle <br /> in peak condition.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-primary-100">{tagline}</p>
        </div>

        <p className="relative z-10 text-xs text-primary-200">© 2026 ServiceMate. All rights reserved.</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 lg:w-[58%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
