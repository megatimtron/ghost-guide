import { useEffect, useState } from 'react';
import stops from './stops.json';
import Landing from './screens/Landing';
import Hunt from './screens/Hunt';
import Complete from './screens/Complete';
import { loadProgress, resetProgress, saveProgress } from './lib/storage';

export default function App() {
  const [progress, setProgressState] = useState(() => loadProgress());
  const [screen, setScreen] = useState(() => {
    const p = loadProgress();
    if (!p.startedAt) return 'landing';
    if (p.completed.length >= stops.length) return 'complete';
    return 'hunt';
  });

  const setProgress = (next) => {
    setProgressState(next);
    saveProgress(next);
  };

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const onStart = () => {
    const fresh = {
      startedAt: Date.now(),
      currentStop: 0,
      completed: [],
      history: [],
      timerEndsAt: null,
    };
    setProgress(fresh);
    setScreen('hunt');
  };

  const onResume = () => setScreen('hunt');

  const onReset = () => {
    resetProgress();
    setProgressState(loadProgress());
    setScreen('landing');
  };

  const onComplete = () => setScreen('complete');

  return (
    <div className="mx-auto min-h-full max-w-md">
      {screen === 'landing' && (
        <Landing
          onStart={onStart}
          hasInProgress={!!progress.startedAt && progress.completed.length < stops.length}
          onResume={onResume}
          onReset={onReset}
        />
      )}
      {screen === 'hunt' && (
        <Hunt progress={progress} setProgress={setProgress} onComplete={onComplete} />
      )}
      {screen === 'complete' && <Complete progress={progress} onReset={onReset} />}
    </div>
  );
}
