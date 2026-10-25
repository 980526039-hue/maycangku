(() => {
  'use strict';

  function muteOnEntry() {
    document.querySelectorAll('video').forEach(video => {
      video.defaultMuted = true;
      video.muted = true;
    });
  }

  // Run once on entry; native volume controls remain free to unmute playback.
  muteOnEntry();
  // A back/forward cache restore is another page entry, not a scroll event.
  addEventListener('pageshow', event => {
    if (event.persisted) muteOnEntry();
  });
})();
