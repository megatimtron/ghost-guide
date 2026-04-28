const KEY = 'ghost-guide:v1';

const empty = () => ({
  startedAt: null,
  currentStop: 0,
  completed: [],
  history: [],
  timerEndsAt: null,
});

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(p) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function resetProgress() {
  localStorage.removeItem(KEY);
}
