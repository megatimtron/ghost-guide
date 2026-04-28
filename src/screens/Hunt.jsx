import { useEffect, useMemo, useState } from 'react';
import stops from '../stops.json';
import MapView from '../components/MapView';
import CameraUpload from '../components/CameraUpload';
import BackpackTimer from '../components/BackpackTimer';
import { GEOFENCE_RADIUS_M, haversineMeters, watchPosition } from '../lib/geo';
import { verifyLocationWithGemini } from '../lib/verify';

const SIP_MS = 10 * 60 * 1000;

export default function Hunt({ progress, setProgress, onComplete }) {
  const stop = stops[progress.currentStop];
  const [userPos, setUserPos] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stop = watchPosition(setUserPos, (e) => setGeoError(e.message));
    return stop;
  }, []);

  const distance = useMemo(() => {
    if (!userPos) return null;
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
          ...progress,
          completed: [...progress.completed, stop.id],
          history: [...progress.history, { stopId: stop.id, commentary: res.commentary, at: Date.now() }],
          timerEndsAt: Date.now() + SIP_MS,
        };
        setProgress(next);
      }
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const goNext = () => {
    const nextIdx = progress.currentStop + 1;
    if (nextIdx >= stops.length) {
      onComplete();
      return;
    }
    setProgress({ ...progress, currentStop: nextIdx, timerEndsAt: null });
    setVerdict(null);
  };

  const stopsDone = progress.completed.length;
  const showNext = verdict?.verified;

  return (
    <div className="flex min-h-full flex-col gap-5 px-5 py-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300/80">
            Stop {stop.id} of {stops.length}
          </p>
          <h2 className="text-2xl font-bold text-zinc-50">{stop.name}</h2>
          <p className="text-sm text-zinc-400">{stop.address}</p>
        </div>
        <div className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
          {stopsDone}/{stops.length} done
        </div>
      </header>

      <MapView stop={stop} userPos={userPos} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-fuchsia-300">Your Task</h3>
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
        endsAt={progress.timerEndsAt}
        currentStreet={stop.address.split(',')[0]}
        onDone={() => setProgress({ ...progress, timerEndsAt: null })}
      />

      {!verdict?.verified && (
        <CameraUpload onSubmit={onSubmit} busy={busy} disabled={false} />
      )}

      {verdict && (
        <div
          className={
            'rounded-2xl border p-4 ' +
            (verdict.verified
              ? 'border-emerald-700/60 bg-emerald-950/40'
              : 'border-rose-700/60 bg-rose-950/40')
          }
        >
          <p className={verdict.verified ? 'text-emerald-200' : 'text-rose-200'}>
            {verdict.commentary}
          </p>
          {verdict.verified && (
            <div className="mt-3 rounded-xl bg-zinc-900/70 p-3">
              <p className="text-xs uppercase tracking-wider text-fuchsia-300">{stop.reward}</p>
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
          className="rounded-2xl bg-fuchsia-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-fuchsia-900/40 active:scale-[0.98]"
        >
          {progress.currentStop + 1 >= stops.length ? '🥂 Finish Hunt' : 'Next Stop →'}
        </button>
      )}
    </div>
  );
}
