import { useEffect, useMemo, useState } from 'react';
import MapView from '../components/MapView';
import CameraUpload from '../components/CameraUpload';
import BackpackTimer from '../components/BackpackTimer';
import { GEOFENCE_RADIUS_M, haversineMeters, watchPosition } from '../lib/geo';
import { verifyLocationWithGemini } from '../lib/verify';

const SIP_MS = 10 * 60 * 1000;

export default function Hunt({ stops, hunt, setHunt, onComplete, onExit, huntKind = 'main' }) {
  const stop = stops[hunt.currentStop];
  const [userPos, setUserPos] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return watchPosition(setUserPos, (e) => setGeoError(e.message));
  }, []);

  const distance = useMemo(() => {
    if (!userPos || !stop) return null;
    return haversineMeters(userPos, stop);
  }, [userPos, stop]);

  const inGeofence = distance != null && distance <= GEOFENCE_RADIUS_M;

  const onSubmit = async (file) => {
    setBusy(true);
    setError(null);
    setVerdict(null);
    try {
      const res = await verifyLocationWithGemini(file, stop.id);
      setVerdict(res);
      if (res.verified) {
        const next = {
          ...hunt,
          completed: [...hunt.completed, stop.id],
          history: [...hunt.history, { stopId: stop.id, commentary: res.commentary, at: Date.now() }],
          timerEndsAt: huntKind === 'midnight' ? null : Date.now() + SIP_MS,
        };
        setHunt(next);
      }
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const goNext = () => {
    const nextIdx = hunt.currentStop + 1;
    if (nextIdx >= stops.length) {
      onComplete();
      return;
    }
    setHunt({ ...hunt, currentStop: nextIdx, timerEndsAt: null });
    setVerdict(null);
  };

  const onSkip = () => {
    if (!confirm(`Skip "${stop.name}"? It won't unlock the reward but the hunt will continue.`)) return;
    const nextIdx = hunt.currentStop + 1;
    const isLast = nextIdx >= stops.length;
    const updated = {
      ...hunt,
      completed: [...hunt.completed, stop.id],
      history: [
        ...hunt.history,
        { stopId: stop.id, commentary: '(skipped — could not verify)', skipped: true, at: Date.now() },
      ],
      timerEndsAt: null,
      currentStop: isLast ? hunt.currentStop : nextIdx,
    };
    setHunt(updated);
    setVerdict(null);
    setError(null);
    if (isLast) onComplete();
  };

  const stopsDone = hunt.completed.length;
  const showNext = verdict?.verified;
  const isMidnight = huntKind === 'midnight';

  if (!stop) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-zinc-300">No stops in this hunt.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-5 px-5 py-6">
      <header className="flex items-center justify-between">
        <div>
          <p className={'text-xs uppercase tracking-[0.25em] ' + (isMidnight ? 'text-cyan-300/80' : 'text-fuchsia-300/80')}>
            {isMidnight ? 'Midnight Library' : 'The Hunt'} · Stop {hunt.currentStop + 1} of {stops.length}
          </p>
          <h2 className={'text-2xl font-bold text-zinc-50 ' + (isMidnight ? 'app-neon' : '')}>{stop.name}</h2>
          <p className="text-sm text-zinc-400">{stop.address}</p>
        </div>
        <button
          onClick={onExit}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
        >
          {stopsDone}/{stops.length} · exit
        </button>
      </header>

      <MapView stop={stop} userPos={userPos} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h3 className={'text-sm font-semibold uppercase tracking-wider ' + (isMidnight ? 'text-cyan-300' : 'text-fuchsia-300')}>
          {isMidnight ? 'Night Challenge' : 'Your Task'}
        </h3>
        <p className="mt-1 text-zinc-100">{stop.task}</p>
        <div className="mt-3 flex items-center gap-2 text-sm">
          {distance == null ? (
            <span className="text-zinc-400">📍 Locating you…</span>
          ) : inGeofence ? (
            <span className="text-emerald-400">✅ You're here ({Math.round(distance)} m)</span>
          ) : (
            <span className="text-amber-300">↗︎ {Math.round(distance)} m away — get closer</span>
          )}
        </div>
        {geoError && <p className="mt-2 text-xs text-rose-400">Location: {geoError}</p>}
      </div>

      <BackpackTimer
        endsAt={hunt.timerEndsAt}
        currentStreet={stop.address.split(',')[0]}
        onDone={() => setHunt({ ...hunt, timerEndsAt: null })}
      />

      {!verdict?.verified && (
        <>
          <CameraUpload onSubmit={onSubmit} busy={busy} disabled={false} />
          <button
            type="button"
            onClick={onSkip}
            disabled={busy}
            className="-mt-2 self-center text-sm text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline disabled:opacity-40"
          >
            Stuck? Skip this stop →
          </button>
        </>
      )}

      {verdict && (
        <div
          className={
            'rounded-2xl border p-4 ' +
            (verdict.verified
              ? isMidnight
                ? 'border-cyan-700/60 bg-cyan-950/40'
                : 'border-emerald-700/60 bg-emerald-950/40'
              : 'border-rose-700/60 bg-rose-950/40')
          }
        >
          <p className={verdict.verified ? (isMidnight ? 'text-cyan-100' : 'text-emerald-200') : 'text-rose-200'}>
            {verdict.commentary}
          </p>
          {verdict.verified && (
            <div className="mt-3 rounded-xl bg-zinc-900/70 p-3">
              <p className={'text-xs uppercase tracking-wider ' + (isMidnight ? 'text-cyan-300' : 'text-fuchsia-300')}>
                {stop.reward}
              </p>
              <p className="text-zinc-100">{stop.rewardLabel}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-700/60 bg-rose-950/40 p-4 text-rose-200">
          {error}
        </div>
      )}

      {showNext && (
        <button
          onClick={goNext}
          className={
            'rounded-2xl px-6 py-4 text-lg font-semibold shadow-lg active:scale-[0.98] ' +
            (isMidnight
              ? 'bg-cyan-400 text-black shadow-cyan-500/40'
              : 'bg-fuchsia-600 text-white shadow-fuchsia-900/40')
          }
        >
          {hunt.currentStop + 1 >= stops.length
            ? isMidnight
              ? '👻 Reveal the Reward'
              : '🥂 Finish Hunt'
            : 'Next Stop →'}
        </button>
      )}
    </div>
  );
}
