import { useEffect, useState } from 'react';

const TOTAL_MS = 10 * 60 * 1000;

export default function BackpackTimer({ endsAt, onDone, currentStreet }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (endsAt && now >= endsAt) onDone?.();
  }, [now, endsAt, onDone]);

  if (!endsAt) return null;

  const remainingMs = Math.max(0, endsAt - now);
  const mm = String(Math.floor(remainingMs / 60000)).padStart(2, '0');
  const ss = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');
  const pct = Math.max(0, Math.min(100, ((TOTAL_MS - remainingMs) / TOTAL_MS) * 100));

  return (
    <div className="rounded-2xl border border-fuchsia-700/50 bg-fuchsia-950/40 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-fuchsia-200">🥃 Sip & Stroll</h3>
        <span className="font-mono text-2xl text-fuchsia-100 tabular-nums">{mm}:{ss}</span>
      </div>
      <p className="mt-1 text-sm text-zinc-300">
        {currentStreet ? `You're on ${currentStreet}. ` : ''}Take your time, enjoy the drink.
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-fuchsia-500 transition-[width] duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
