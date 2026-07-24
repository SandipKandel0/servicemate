import { ShieldCheck } from "lucide-react";

// A minimalist line-art illustration of a car on a lift, mid-service —
// keeps the panel on-topic without depending on an external image asset.
function ServiceIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="relative z-10 h-auto w-full max-w-md mx-auto">
      <ellipse cx="200" cy="255" rx="150" ry="12" fill="white" fillOpacity="0.06" />

      {/* lift posts */}
      <rect x="55" y="70" width="10" height="170" rx="3" fill="white" fillOpacity="0.18" />
      <rect x="335" y="70" width="10" height="170" rx="3" fill="white" fillOpacity="0.18" />
      <rect x="45" y="60" width="30" height="10" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="325" y="60" width="30" height="10" rx="3" fill="white" fillOpacity="0.25" />

      {/* car body */}
      <g>
        <path
          d="M75 175 L100 130 Q110 118 128 118 L262 118 Q280 118 290 130 L315 175 Z"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M75 175 L315 175 L315 195 Q315 202 308 202 L82 202 Q75 202 75 195 Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M128 118 L138 150 L252 150 L262 118"
          fill="none"
          stroke="white"
          strokeOpacity="0.5"
          strokeWidth="3"
        />
        <line x1="195" y1="120" x2="195" y2="150" stroke="white" strokeOpacity="0.5" strokeWidth="3" />

        {/* wheels */}
        <circle cx="128" cy="202" r="22" fill="#0f172a" stroke="white" strokeOpacity="0.85" strokeWidth="4" />
        <circle cx="128" cy="202" r="8" fill="white" fillOpacity="0.85" />
        <circle cx="262" cy="202" r="22" fill="#0f172a" stroke="white" strokeOpacity="0.85" strokeWidth="4" />
        <circle cx="262" cy="202" r="8" fill="white" fillOpacity="0.85" />

        {/* headlight */}
        <circle cx="305" cy="160" r="5" fill="#fbbf24" />
      </g>

      {/* wrench, floating */}
      <g transform="translate(320, 60) rotate(20)" opacity="0.9">
        <rect x="-4" y="0" width="8" height="34" rx="4" fill="#fbbf24" />
        <circle cx="0" cy="-4" r="9" fill="none" stroke="#fbbf24" strokeWidth="4" />
      </g>

      {/* gear, floating */}
      <g transform="translate(55, 40)" opacity="0.5">
        <circle cx="0" cy="0" r="14" fill="none" stroke="white" strokeWidth="3" />
        <circle cx="0" cy="0" r="4" fill="white" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect key={deg} x="-2" y="-19" width="4" height="8" fill="white" transform={`rotate(${deg})`} />
        ))}
      </g>
    </svg>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 px-12 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">ServiceMate</span>
        </div>

        <div className="relative z-10 flex flex-1 items-center">
          <ServiceIllustration />
        </div>

        <p className="relative z-10 text-xs text-slate-400">© 2026 ServiceMate. All rights reserved.</p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 lg:w-[58%]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
