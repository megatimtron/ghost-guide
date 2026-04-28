import stops from '../stops.json';

export default function Landing({ onStart, hasInProgress, onResume, onReset }) {
  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">Elm City</p>
        <h1 className="mt-2 text-5xl font-bold leading-tight text-zinc-50">
          New Haven<br />Ghost Guide
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-zinc-300">
          A {stops.length}-stop scavenger hunt through the witty,
          slightly-haunted side of downtown. Photo verified. Drinks in your bag.
        </p>

        <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3">
          {hasInProgress ? (
            <>
              <button
                onClick={onResume}
                className="rounded-2xl bg-fuchsia-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-fuchsia-900/40 active:scale-[0.98]"
              >
                Resume Hunt
              </button>
              <button
                onClick={onReset}
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-zinc-200 active:scale-[0.98]"
              >
                Start Over
              </button>
            </>
          ) : (
            <button
              onClick={onStart}
              className="rounded-2xl bg-fuchsia-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-fuchsia-900/40 active:scale-[0.98]"
            >
              Start Hunt
            </button>
          )}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Drink responsibly. Sip & Stroll, don't sip & sprint.
      </p>
    </div>
  );
}
