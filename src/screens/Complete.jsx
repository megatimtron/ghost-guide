export default function Complete({ stops, hunt, onReset, onBack, isMidnight }) {
  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center text-center">
        <p className="text-6xl">{isMidnight ? '👻' : '🥂'}</p>
        <h1 className={'mt-4 text-4xl font-bold text-zinc-50 ' + (isMidnight ? 'app-neon' : '')}>
          {isMidnight ? 'Library Closed' : 'Hunt Complete'}
        </h1>
        <p className="mt-3 text-zinc-300">
          {isMidnight
            ? 'You read every page. The ghosts approve.'
            : 'You wandered the Elm City and lived to tell the tale.'}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {stops.map((s) => {
          const entry = hunt.history.find((h) => h.stopId === s.id);
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <p className={'text-xs uppercase tracking-wider ' + (isMidnight ? 'text-cyan-300' : 'text-fuchsia-300')}>
                  Stop {s.id} · {s.reward}
                </p>
                {entry?.skipped && (
                  <span className="rounded-full border border-amber-700/60 bg-amber-950/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200">
                    Skipped
                  </span>
                )}
              </div>
              <p className="text-zinc-100">{s.name}</p>
              {entry?.commentary && (
                <p className="mt-1 text-sm text-zinc-400">{entry.commentary}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onBack}
          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold text-zinc-100 active:scale-[0.98]"
        >
          ← Back to Hub
        </button>
        <button
          onClick={onReset}
          className="rounded-2xl border border-zinc-800 bg-transparent px-6 py-3 text-sm text-zinc-400 hover:bg-zinc-900/40"
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}
