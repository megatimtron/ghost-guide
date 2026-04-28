export function applyNightMode(on) {
  const html = document.documentElement;
  if (on) html.classList.add('night');
  else html.classList.remove('night');
}
