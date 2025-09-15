(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.getElementById('bg-video');
  const video = document.getElementById('bg-video-el');
  const rotator = document.getElementById('bg-rotator');
  if(!el || !video) return;

  // Try local asset first; fallback to CDN
  const remote = 'https://cdn.coverr.co/videos/coverr-deep-forest-1496/1080p.mp4';
  function setSource(){
    video.src = 'assets/forest.mp4';
    video.onerror = () => { if(video.src !== remote){ video.src = remote; video.load(); } };
    video.load();
  }

  function show(){
    if (reduce) return; // respect reduced motion
    setSource();
    rotator?.classList.add('hide');
    el.classList.add('show');
    // autoplay safely (muted + playsinline)
    const p = video.play();
    if(p && typeof p.catch === 'function'){ p.catch(() => {}); }
  }
  function hide(){
    el.classList.remove('show');
    rotator?.classList.remove('hide');
    try{ video.pause(); }catch(_){ }
  }

  // Toggle on hash
  function sync(){
    if(location.hash === '#gallery') show(); else hide();
  }
  window.addEventListener('hashchange', sync);

  // Intercept sidebar clicks for immediate feedback
  document.addEventListener('click', (e) =>{
    const a = e.target.closest && e.target.closest('a[href="#gallery"]');
    if(!a) return;
    // let scroll happen but show video right away
    show();
  });

  // Initial state
  sync();
})();

