export default function NightModeToggle({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={
        'group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors ' +
        (on
          ? 'border-cyan-400/60 bg-cyan-950/40 text-cyan-100'
          : 'border-zinc-700 bg-zinc-900/60 text-zinc-100')
      }
    >
      <span className="flex items-center gap-3">
        <span className="text-xl">{on ? '🌙' : '🕯️'}</span>
        <span className="flex flex-col items-start leading-tight">
          <span className={'font-semibold ' + (on ? 'app-neon' : '')}>
            {on ? 'After-Hours' : 'Go Dark'}
          </span>
          <span className="text-xs opacity-70">
            {on ? 'Midnight Library unlocked' : 'Unlocks the Midnight Library'}
          </span>
        </span>
      </span>
      <span
        className={
          'relative h-7 w-12 rounded-full border transition-colors ' +
          (on ? 'border-cyan-400 bg-cyan-500/40' : 'border-zinc-600 bg-zinc-800')
        }
      >
        <span
          className={
            'absolute top-0.5 h-6 w-6 rounded-full transition-all ' +
            (on
              ? 'left-[22px] bg-cyan-300 shadow-[0_0_12px_rgba(0,255,209,0.7)]'
              : 'left-0.5 bg-zinc-300')
          }
        />
      </span>
    </button>
  );
}
