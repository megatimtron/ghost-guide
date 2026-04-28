import { useRef, useState } from 'react';

export default function CameraUpload({ onSubmit, disabled, busy }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPick}
        className="hidden"
      />

      {!previewUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="w-full rounded-2xl bg-fuchsia-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-fuchsia-900/40 active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
        >
          📸 Open Camera
        </button>
      )}

      {previewUrl && (
        <div className="flex flex-col gap-3">
          <img
            src={previewUrl}
            alt="preview"
            className="w-full rounded-2xl border border-fuchsia-900/40 object-cover max-h-80"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 font-medium text-zinc-100 disabled:opacity-40"
            >
              Retake
            </button>
            <button
              type="button"
              onClick={() => onSubmit(file)}
              disabled={busy}
              className="rounded-xl bg-fuchsia-600 px-4 py-3 font-semibold text-white shadow-md shadow-fuchsia-900/40 disabled:opacity-40"
            >
              {busy ? 'Verifying…' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
