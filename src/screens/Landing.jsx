import mainStops from '../stops.json';
import midnightStops from '../midnightStops.json';
import NightModeToggle from '../components/NightModeToggle';
import ReportSightingForm from '../components/ReportSightingForm';

export default function Landing({
  nightMode,
  onToggleNight,
  onStart,
  onResume,
  onReset,
  mainProgress,
  midnightProgress,
  onReportSighting,
}) {
  const mainInProgress =
    !!mainProgress.startedAt && mainProgress.completed.length < mainStops.length;
  const mainDone = mainProgress.completed.length >= mainStops.length;
  const midnightInProgress =
    !!midnightProgress.startedAt && midnightProgress.completed.length < midnightStops.length;
  const midnightDone = midnightProgress.completed.length >= midnightStops.length;

  return (
    <div className="flex min-h-full flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center text-center">
        <p className={'text-sm uppercase tracking-[0.3em] ' + (nightMode ? 'text-cyan-300/80' : 'text-fuchsia-300/80')}>
          Elm City
        </p>
        <h1 className={'mt-2 text-5xl font-bold leading-tight text-zinc-50 ' + (nightMode ? 'app-neon' : '')}>
          New Haven<br />Ghost Guide
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-zinc-300">
          A scavenger hunt through the witty, slightly-haunted side of downtown.
          {nightMode ? ' The Library is open. The dead are listening.' : ' Photo verified. Drinks in your bag.'}
        </p>

        <div className="mx-auto mt-8 w-full max-w-sm">
          <NightModeToggle on={nightMode} onChange={onToggleNight} />
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3">
          <HuntCard
            label="The Hunt"
            sublabel={`${mainStops.length} downtown stops · drinks + history`}
            stateLabel={
              mainDone ? 'Complete' : mainInProgress ? `In progress · ${mainProgress.completed.length}/${mainStops.length}` : 'Ready'
            }
            primary={mainInProgress ? 'Resume' : mainDone ? 'Replay' : 'Start Hunt'}
            onPrimary={() => (mainInProgress ? onResume('main') : onStart('main'))}
            tone={nightMode ? 'cyan' : 'fuchsia'}
          />

          {nightMode && (
            <HuntCard
              label="The Midnight Library"
              sublabel={`${midnightStops.length} ghostly stop${midnightStops.length === 1 ? '' : 's'} · night-only`}
              stateLabel={
                midnightDone
                  ? 'Reward unlocked'
                  : midnightInProgress
                  ? `In progress · ${midnightProgress.completed.length}/${midnightStops.length}`
                  : 'Locked away'
              }
              primary={midnightInProgress ? 'Resume' : midnightDone ? 'Reveal Reward' : 'Open the Library'}
              onPrimary={() => (midnightInProgress ? onResume('midnight') : onStart('midnight'))}
              tone="cyan"
              spectral
            />
          )}

          <button
            onClick={onReset}
            className="mt-2 rounded-2xl border border-zinc-800 bg-transparent px-6 py-3 text-sm text-zinc-400 hover:bg-zinc-900/40"
          >
            Reset all progress
          </button>
        </div>

        <div className="mx-auto mt-8 w-full max-w-sm">
          <ReportSightingForm onSubmit={onReportSighting} />
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Drink responsibly. Sip & Stroll, don't sip & sprint.
      </p>
    </div>
  );
}

function HuntCard({ label, sublabel, stateLabel, primary, onPrimary, tone, spectral }) {
  const accent =
    tone === 'cyan'
      ? 'border-cyan-400/40 bg-cyan-950/25 text-cyan-100'
      : 'border-fuchsia-700/40 bg-fuchsia-950/25 text-fuchsia-100';
  const btn =
    tone === 'cyan'
      ? 'bg-cyan-400 text-black shadow-[0_0_16px_rgba(0,255,209,0.5)]'
      : 'bg-fuchsia-600 text-white shadow-fuchsia-900/40';
  return (
    <div className={'rounded-2xl border p-4 text-left ' + accent + (spectral ? ' app-glow' : '')}>
      <div className="flex items-center justify-between">
        <div>
          <p className={'text-xs uppercase tracking-[0.2em] opacity-80 ' + (spectral ? 'app-neon' : '')}>{label}</p>
          <p className="text-sm opacity-80">{sublabel}</p>
        </div>
        <span className="rounded-full border border-current/40 px-2 py-0.5 text-[10px] uppercase tracking-wider opacity-80">
          {stateLabel}
        </span>
      </div>
      <button
        onClick={onPrimary}
        className={'mt-4 w-full rounded-xl px-4 py-3 font-semibold shadow-lg active:scale-[0.98] ' + btn}
      >
        {primary}
      </button>
    </div>
  );
}
