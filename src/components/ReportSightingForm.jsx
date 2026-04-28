import { useState } from 'react';

export default function ReportSightingForm({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const payload = { location: location.trim(), story: story.trim(), at: Date.now() };
    if (!payload.location || !payload.story) return;
    console.log('[ghost-guide] sighting reported:', payload);
    onSubmit?.(payload);
    setSubmitted(true);
    setLocation('');
    setStory('');
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
    }, 1800);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-zinc-600 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800/60"
      >
        👁️ Report a Sighting
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Report a Sighting</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-zinc-400"
        >
          close
        </button>
      </div>

      <label className="mt-3 block text-xs uppercase tracking-wider text-zinc-400">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., Court St alley"
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500"
      />

      <label className="mt-3 block text-xs uppercase tracking-wider text-zinc-400">Ghost Story</label>
      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        rows={3}
        placeholder="What did you see?"
        className="mt-1 w-full rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-zinc-100 outline-none focus:border-cyan-500"
      />

      <button
        type="submit"
        disabled={!location.trim() || !story.trim() || submitted}
        className="mt-3 w-full rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-black disabled:opacity-40"
      >
        {submitted ? 'Sighting Logged 👻' : 'Send to the Archive'}
      </button>
      <p className="mt-2 text-[11px] text-zinc-500">
        Logged locally for now (check console). Backend wiring is on the roadmap.
      </p>
    </form>
  );
}
