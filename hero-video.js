document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero[data-video-state]');
  const frame = document.getElementById('hero-background-video');
  if (!hero || !frame) return;

  let fallbackTimer;
  let player;
  const fallback = () => {
    window.clearTimeout(fallbackTimer);
    if (player) player.pauseVideo();
    frame.hidden = true;
    hero.dataset.videoState = 'fallback';
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fallback();
    return;
  }

  frame.src = frame.dataset.src;
  fallbackTimer = window.setTimeout(fallback, 15000);
  window.onYouTubeIframeAPIReady = () => {
    if (hero.dataset.videoState === 'fallback') return;

    player = new YT.Player(frame, {
      events: {
        onReady: (event) => {
          event.target.mute();
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            window.clearTimeout(fallbackTimer);
            hero.dataset.videoState = 'playing';
          }
        },
        onError: fallback,
        onAutoplayBlocked: fallback,
      },
    });
  };

  const api = document.createElement('script');
  api.src = 'https://www.youtube.com/iframe_api';
  api.onerror = fallback;
  document.head.appendChild(api);
});
