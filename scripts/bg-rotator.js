(function(){
  const rotator = document.getElementById('bg-rotator');
  if(!rotator) return;
  const a = rotator.querySelector('.layer.a');
  const b = rotator.querySelector('.layer.b');
  let cur = a, next = b;
  let idx = 0; let list = [];
  const DURATION = 10000; // 10s per photo

  function setSrc(el, src){ if(!el) return; el.src = src; }
  function show(el){ el.classList.add('show'); }
  function hide(el){ el.classList.remove('show'); }

  function cycle(){
    if(list.length === 0) return;
    const src = list[idx % list.length];
    setSrc(next, src);
    // crossfade
    show(next); hide(cur);
    const tmp = cur; cur = next; next = tmp;
    idx++;
  }

  async function loadManifest(){
    try{
      const r = await fetch('assets/backgrounds/manifest.json', { cache:'no-store' });
      const arr = await r.json();
      list = (arr || []).map(x => x.src).filter(Boolean);
    }catch(_){
      list = [
        'assets/hero-bg.png',
        'assets/hero-sunny.png',
        'assets/hero-rain.png',
        'assets/hero-snow.png'
      ];
    }
    if(list.length){
      setSrc(cur, list[0]); show(cur); idx = 1;
      setTimeout(() => cycle(), DURATION);
      setInterval(cycle, DURATION);
    }
  }

  loadManifest();
})();

