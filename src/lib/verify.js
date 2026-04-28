async function fileToBase64(file) {
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function verifyLocationWithGemini(file, stopId) {
  const base64 = await fileToBase64(file);
  const res = await fetch('/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stopId,
      mimeType: file.type || 'image/jpeg',
      imageBase64: base64,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`verify failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}
