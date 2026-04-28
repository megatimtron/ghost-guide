import SpectralOverlay from './SpectralOverlay';

export default function FinalReward({ onClose }) {
  const mapsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=East+Rock+Summit,+New+Haven,+CT';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-5 py-10"
    >
      <SpectralOverlay count={28} />

      <div className="relative z-50 w-full max-w-md rounded-3xl border border-cyan-400/40 bg-[#04060a]/95 p-6 text-center shadow-[0_0_60px_rgba(0,255,209,0.35)]">
        <p className="text-5xl">👻🥂</p>
        <h2 className="app-neon mt-3 text-3xl font-bold tracking-wide text-cyan-100">
          The Midnight Library Bows
        </h2>
        <p className="mt-3 text-cyan-100/80">
          You found every ghost on the list. The Elm City keeps your secret.
        </p>

        <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 p-4 text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">Final Destination</p>
          <p className="mt-1 text-lg font-semibold text-cyan-50">East Rock Summit</p>
          <p className="mt-1 text-sm text-cyan-100/80">
            Drive up. Park at the top. Walk to the Soldiers &amp; Sailors Monument.
            All of New Haven blinks below — the harbor, the spires, the bars you just left.
            Best view in the city, and almost nobody's there after midnight.
          </p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-black shadow-[0_0_18px_rgba(0,255,209,0.6)]"
          >
            🗺️ Open in Maps
          </a>
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cyan-300/70">
          For Ugo
        </p>
        <p className="mt-1 text-sm italic text-cyan-100/80">
          Last night off, well spent. The hunt is over — the city is yours.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl border border-cyan-400/50 bg-transparent px-4 py-3 font-semibold text-cyan-100 hover:bg-cyan-500/10"
        >
          Close the Book
        </button>
      </div>
    </div>
  );
}
