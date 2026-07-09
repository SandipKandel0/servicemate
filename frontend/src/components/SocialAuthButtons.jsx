export default function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        title="Social sign-in is not configured in this demo"
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.32a7.18 7.18 0 0 1 0-4.64V6.59H1.27a11.93 11.93 0 0 0 0 10.82l4-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.59l4 3.09C6.22 6.86 8.87 4.75 12 4.75z"
          />
        </svg>
        Google
      </button>
      <button
        type="button"
        title="Social sign-in is not configured in this demo"
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.36 1.43c.13 1.07-.27 2.13-.93 2.93-.7.83-1.86 1.46-2.97 1.37-.15-1.04.32-2.13.95-2.86.69-.81 1.93-1.43 2.95-1.44ZM20.5 17.2c-.32.74-.7 1.43-1.16 2.06-.63.88-1.27 1.74-2.27 1.76-.97.02-1.29-.6-2.4-.6-1.12 0-1.46.58-2.4.62-.97.04-1.7-.86-2.34-1.73-1.3-1.8-2.3-5.08-.96-7.3.65-1.1 1.83-1.8 3.1-1.82.96-.02 1.57.6 2.37.6.79 0 1.33-.62 2.45-.59 1.06.03 2.04.55 2.65 1.42-2.33 1.38-1.95 4.5.96 5.58Z" />
        </svg>
        Apple
      </button>
    </div>
  );
}
