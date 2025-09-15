// Rain + Lightning canvas overlay
(function(){
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  function resize(){
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const angle = Math.PI / 10; // наклон дождя
  const sin = Math.sin(angle), cos = Math.cos(angle);
  const baseCount = Math.round(Math.min(450, Math.max(180, w * h / 9000)));
  const drops = [];

  function resetDrop(d){
    d.x = Math.random() * (w + 200) - 100;
    d.y = -Math.random() * h - 20;
    d.len = 8 + Math.random() * 14;
    d.speed = 520 + Math.random() * 600; // px/sec
    d.alpha = 0.25 + Math.random() * 0.35;
    return d;
  }

  for (let i = 0; i < baseCount; i++) drops.push(resetDrop({}));

  let last = performance.now();
  let flash = 0; // 0..1
  let nextFlashAt = last + 3000 + Math.random() * 8000;

  function frame(now){
    const dt = Math.min(0.05, (now - last) / 1000); // cap dt for stability
    last = now;

    // background clear
    ctx.clearRect(0, 0, w, h);

    // rain
    ctx.lineWidth = 1.2;
    for (let i = 0; i < drops.length; i++){
      const d = drops[i];
      d.x += d.speed * dt * sin;
      d.y += d.speed * dt * cos;
      // draw
      ctx.strokeStyle = 'rgba(230,240,255,' + d.alpha + ')';
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.len * sin, d.y - d.len * cos);
      ctx.stroke();
      if (d.y > h + 40 || d.x > w + 140) resetDrop(d);
    }

    // lightning scheduling
    if (now > nextFlashAt && flash <= 0){
      // одинарная или двойная вспышка
      flash = 1.0;
      nextFlashAt = now + 5000 + Math.random() * 12000;
    }
    if (flash > 0){
      // быстрый спад с небольшим “эхо”
      const a = flash * 0.55;
      const grd = ctx.createRadialGradient(w*0.6, h*0.2, 20, w*0.6, h*0.2, Math.max(w,h));
      grd.addColorStop(0, 'rgba(255,255,255,'+a+')');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0,0,w,h);
      flash *= 0.82;
      if (flash < 0.02) flash = 0;
    }

    raf = requestAnimationFrame(frame);
  }

  let raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){ cancelAnimationFrame(raf); }
    else { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
})();

