import stops from '../../src/stops.json' with { type: 'json' };

const SYSTEM_INSTRUCTION = `You are the New Haven Ghost Guide. You are witty, slightly snarky, and an expert in Elm City history. Your job is to verify photos uploaded by users during a scavenger hunt.

Analyze: Check if the image contains the specific landmark or drink requested.
Strictness: If the user takes a photo of a random tree instead of the 'Skull and Bones' tomb, reject it.
Personality: If they succeed, give them a 2-sentence 'History Nugget' and tell them to 'Take a swig from the bag' or 'Head to the bar.'
Output: Always return JSON: {"verified": boolean, "commentary": string}.`;

const MODEL = 'gemini-2.5-flash';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'GEMINI_API_KEY not configured on server' },
      { status: 500 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { stopId, mimeType, imageBase64 } = body || {};
  const stop = stops.find((s) => s.id === stopId);
  if (!stop) return Response.json({ error: 'Unknown stopId' }, { status: 400 });
  if (!imageBase64) return Response.json({ error: 'Missing imageBase64' }, { status: 400 });

  const userPrompt = `Stop: "${stop.name}" — ${stop.address}
Required: ${stop.verifyHint}
Reward category: ${stop.reward} (${stop.rewardLabel})

Verify the photo. If verified, your commentary should be a 2-sentence History Nugget about ${stop.name} and end with the appropriate cue ("Take a swig from the bag." for backpack stops, "Head to the bar." for bar stops, or a final toast for the finale). If rejected, be witty and snarky about what they actually photographed.

Respond with JSON only: {"verified": boolean, "commentary": string}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const geminiBody = {
    system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents: [
      {
        role: 'user',
        parts: [
          { text: userPrompt },
          { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      response_mime_type: 'application/json',
      response_schema: {
        type: 'object',
        properties: {
          verified: { type: 'boolean' },
          commentary: { type: 'string' },
        },
        required: ['verified', 'commentary'],
      },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiBody),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return Response.json(
      { error: `Gemini API error: ${res.status}`, detail: text },
      { status: 502 },
    );
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return Response.json(
      { verified: false, commentary: "I couldn't read the response. Try again." },
      { status: 200 },
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return Response.json(
      { verified: false, commentary: 'The ghosts garbled the verdict. Try another shot.' },
      { status: 200 },
    );
  }

  return Response.json(parsed);
};
