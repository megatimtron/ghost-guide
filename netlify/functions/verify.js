import mainStops from '../../src/stops.json' with { type: 'json' };
import midnightStops from '../../src/midnightStops.json' with { type: 'json' };

const stops = [...mainStops, ...midnightStops];

const SYSTEM_INSTRUCTION = `You are the New Haven Ghost Guide. You are witty and an expert in Elm City history. Your job is to verify photos uploaded by users during a scavenger hunt.

Verification policy:
- Be GENEROUS when the photo is a reasonable attempt at the requested landmark. If the building, sign, or feature is clearly identifiable — even from an unusual angle, in poor lighting, or with parts obscured — accept it. The user is on the move, in real conditions, and may not be able to get a textbook shot.
- Only reject when the photo clearly does NOT show the requested landmark (e.g., they took a photo of their shoes, a random tree, or a totally different building). Do not reject for color mismatches, partial views, blur, or stylistic preferences.
- When in doubt, ACCEPT and add a friendly note about what would have been ideal next time.

Tone:
- On success: warm, witty, give a 2-sentence History Nugget and end with the appropriate cue.
- On rejection: kind and helpful, not snarky. Briefly explain what's missing or what you actually see. Snark is ONLY appropriate when the photo is comically off-target (shoes, a coffee cup, etc.) — never when the user is clearly trying.

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

  const isMidnight = stop.kind === 'midnight';
  const cueLine = isMidnight
    ? 'End with a slightly haunted one-liner — these are night stops on "The Midnight Library" track, drier and ghostlier than the regular hunt.'
    : 'End with the appropriate cue: "Take a swig from the bag." for backpack stops, "Head to the bar." for bar stops, or a final toast for the finale.';

  const userPrompt = `Stop: "${stop.name}" — ${stop.address}
Track: ${isMidnight ? 'Midnight Library (night-only)' : 'Main Hunt'}
Required: ${stop.verifyHint}
Reward category: ${stop.reward} (${stop.rewardLabel})

Verify the photo. Apply the GENEROUS verification policy: accept any reasonable attempt at this landmark, even with imperfect framing, lighting, or partial views. Reject only if the photo clearly shows something else entirely.

If verified: 2-sentence History Nugget about ${stop.name}. ${cueLine}
If rejected: be kind and brief — explain what you see and what's missing. No snark unless the photo is comically off-topic.

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
