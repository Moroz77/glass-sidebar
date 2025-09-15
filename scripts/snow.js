(function(){
  const canvas = document.getElementById('snow-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let w=0,h=0,dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  function resize(){
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const flakes = [];
  const baseCount = Math.round(Math.min(400, Math.max(120, w*h/12000)));
  function newFlake(){
    const size = 1 + Math.random()*3.5;
    return {
      x: Math.random()*w,
      y: -10 - Math.random()*h,
      r: size,
      vy: 18 + Math.random()*40 + size*4,
      vx: (Math.random()*0.8 - 0.4) * (8 + size*2),
      swing: Math.random()*Math.PI*2,
      swingSpeed: 0.6 + Math.random()*1.2
    };
  }
  for(let i=0;i<baseCount;i++) flakes.push(newFlake());

  let last = performance.now();
  let raf = 0;
  function frame(now){
    const dt = Math.min(0.05,(now-last)/1000); last = now;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for(let i=0;i<flakes.length;i++){
      const f = flakes[i];
      f.swing += f.swingSpeed*dt;
      f.x += f.vx*dt + Math.sin(f.swing)*8*dt;
      f.y += f.vy*dt;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
      if(f.y > h+10 || f.x < -20 || f.x > w+20){ flakes[i] = newFlake(); }
    }
    raf = requestAnimationFrame(frame);
  }

  function start(){ if(raf) return; canvas.style.display='block'; last=performance.now(); raf=requestAnimationFrame(frame); }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf=0; } ctx.clearRect(0,0,w,h); canvas.style.display='none'; }

  window.Snow = { start, stop };
})();

