(() => {
  'use strict';
  const videos = [...document.querySelectorAll('video[data-src]')];
  const visible = new Set();
  const compact = matchMedia('(max-width:760px), (pointer:coarse)').matches;
  const automatic = !compact && !matchMedia('(prefers-reduced-motion:reduce)').matches
    && !navigator.connection?.saveData;

  function load(video) {
    if (!video.dataset.src || video.getAttribute('src')) return;
    video.preload = 'metadata';
    video.src = (compact || navigator.connection?.saveData)
      ? video.dataset.mobileSrc || video.dataset.src
      : video.dataset.src;
    video.load();
  }
  function play(video) {
    if (automatic && !document.hidden) video.play().catch(() => {});
  }
  if ('IntersectionObserver' in window) {
    const nearby = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          load(entry.target);
          nearby.unobserve(entry.target);
        }
      });
    }, {rootMargin:'200px 0px', threshold:0});
    const playback = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= .15) {
          visible.add(entry.target);
          load(entry.target);
          play(entry.target);
        } else {
          visible.delete(entry.target);
          entry.target.pause();
        }
      });
    }, {threshold:[0,.15]});
    videos.forEach(video => { nearby.observe(video); playback.observe(video); });
  } else {
    // Keep native play controls functional in older browsers.
    videos.forEach(load);
  }
  videos.forEach(video => {
    video.addEventListener('pointerdown', () => load(video), {passive:true});
    video.addEventListener('keydown', () => load(video));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
    else visible.forEach(play);
  });
})();
