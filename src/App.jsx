import { useEffect, useState } from 'react';
import mainStops from './stops.json';
import midnightStops from './midnightStops.json';
import Landing from './screens/Landing';
import Hunt from './screens/Hunt';
import Complete from './screens/Complete';
import FinalReward from './components/FinalReward';
import { loadProgress, resetProgress, saveProgress, emptyHunt } from './lib/storage';
import { applyNightMode } from './lib/theme';

const HUNTS = {
  main: { stops: mainStops, key: 'main' },
  midnight: { stops: midnightStops, key: 'midnight' },
};

export default function App() {
  const [progress, setProgressState] = useState(() => loadProgress());
  const [screen, setScreen] = useState(() => {
    const p = loadProgress();
    if (p.activeHunt) {
      const stops = HUNTS[p.activeHunt].stops;
      const done = p[p.activeHunt].completed.length >= stops.length;
      return done ? 'complete' : 'hunt';
    }
    return 'landing';
  });
  const [showFinalReward, setShowFinalReward] = useState(false);

  useEffect(() => {
    applyNightMode(progress.nightMode);
  }, [progress.nightMode]);

  const setProgress = (next) => {
    setProgressState(next);
    saveProgress(next);
  };

  const setHunt = (key) => (next) => {
    const updated = { ...progress, [key]: next };
    setProgress(updated);
  };

  const onToggleNight = (on) => setProgress({ ...progress, nightMode: on });

  const onStart = (key) => {
    const fresh = { ...emptyHunt(), startedAt: Date.now() };
    setProgress({ ...progress, activeHunt: key, [key]: fresh });
    setScreen('hunt');
  };

  const onResume = (key) => {
    setProgress({ ...progress, activeHunt: key });
    setScreen('hunt');
  };

  const onExit = () => {
    setProgress({ ...progress, activeHunt: null });
    setScreen('landing');
  };

  const onReset = () => {
    resetProgress();
    const fresh = loadProgress();
    setProgressState(fresh);
    applyNightMode(fresh.nightMode);
    setShowFinalReward(false);
    setScreen('landing');
  };

  const onComplete = () => {
    if (progress.activeHunt === 'midnight' && !progress.midnight.finalRewardSeen) {
      setProgress({
        ...progress,
        midnight: { ...progress.midnight, finalRewardSeen: true },
      });
      setShowFinalReward(true);
    }
    setScreen('complete');
  };

  const onReportSighting = (sighting) => {
    setProgress({ ...progress, sightings: [...progress.sightings, sighting] });
  };

  const activeKey = progress.activeHunt;
  const activeConfig = activeKey ? HUNTS[activeKey] : null;

  return (
    <div className="mx-auto min-h-full max-w-md">
      {screen === 'landing' && (
        <Landing
          nightMode={progress.nightMode}
          onToggleNight={onToggleNight}
          onStart={onStart}
          onResume={onResume}
          onReset={onReset}
          mainProgress={progress.main}
          midnightProgress={progress.midnight}
          onReportSighting={onReportSighting}
        />
      )}

      {screen === 'hunt' && activeConfig && (
        <Hunt
          stops={activeConfig.stops}
          hunt={progress[activeKey]}
          setHunt={setHunt(activeKey)}
          huntKind={activeKey}
          onComplete={onComplete}
          onExit={onExit}
        />
      )}

      {screen === 'complete' && activeConfig && (
        <Complete
          stops={activeConfig.stops}
          hunt={progress[activeKey]}
          isMidnight={activeKey === 'midnight'}
          onBack={onExit}
          onReset={onReset}
        />
      )}

      {showFinalReward && (
        <FinalReward onClose={() => setShowFinalReward(false)} />
      )}
    </div>
  );
}
