const KEY = 'ghost-guide:v2';
const LEGACY_KEY = 'ghost-guide:v1';

const emptyHunt = () => ({
  startedAt: null,
  currentStop: 0,
  completed: [],
  history: [],
  timerEndsAt: null,
  finalRewardSeen: false,
});

const empty = () => ({
  nightMode: false,
  activeHunt: null,
  main: emptyHunt(),
  midnight: emptyHunt(),
  sightings: [],
});

function migrateLegacy(legacy) {
  return {
    ...empty(),
    main: { ...emptyHunt(), ...legacy },
    activeHunt: legacy.startedAt ? 'main' : null,
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...empty(),
        ...parsed,
        main: { ...emptyHunt(), ...(parsed.main || {}) },
        midnight: { ...emptyHunt(), ...(parsed.midnight || {}) },
      };
    }
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const migrated = migrateLegacy(JSON.parse(legacyRaw));
      saveProgress(migrated);
      localStorage.removeItem(LEGACY_KEY);
      return migrated;
    }
    return empty();
  } catch {
    return empty();
  }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* quota / private mode */
  }
}

export function resetProgress() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(LEGACY_KEY);
}

export { emptyHunt };
