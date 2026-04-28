import stops from '../stops.json';

export default function Complete({ progress, onReset }) {
  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center text-center">
        <p className="text-6xl">🥂</p>
        <h1 className="mt-4 text-4xl font-bold text-zinc-50">Hunt Complete</h1>
        <p className="mt-3 text-zinc-300">
          You wandered the Elm City and lived to tell the tale.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {stops.map((s) => {
          const entry = progress.history.find((h) => h.stopId === s.id);
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left"
            >
              <p className="text-xs uppercase tracking-wider text-fuchsia-300">
                Stop {s.id} · {s.reward}
              </p>
              <p className="text-zinc-100">{s.name}</p>
              {entry?.commentary && (
                <p className="mt-1 text-sm text-zinc-400">{entry.commentary}</p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold text-zinc-100 active:scale-[0.98]"
      >
        Reset & Hunt Again
      </button>
    </div>
  );
}
