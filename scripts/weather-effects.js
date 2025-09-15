// Weather-driven background and effects toggle
(function(){
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LAT = 43.6833, LON = 40.2000; // Adjust to your location if needed
  const URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code,precipitation&timezone=auto`;

  function classify(code){
    // WMO codes mapping
    const rain = [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99];
    const snow = [71,73,75,77,85,86];
    if (rain.includes(code)) return 'rain';
    if (snow.includes(code)) return 'snow';
    return 'sunny';
  }

  function apply(mode){
    document.body.classList.remove('weather-sunny','weather-rain','weather-snow');
    switch(mode){
      case 'rain':
        document.body.classList.add('weather-rain');
        window.Snow?.stop();
        window.Rain?.start();
        break;
      case 'snow':
        document.body.classList.add('weather-snow');
        window.Rain?.stop();
        window.Snow?.start();
        break;
      default:
        document.body.classList.add('weather-sunny');
        window.Rain?.stop();
        window.Snow?.stop();
    }
  }

  async function update(){
    try{
      const r = await fetch(URL, { cache: 'no-store' });
      const d = await r.json();
      const code = d?.current?.weather_code;
      apply(classify(Number(code)));
    }catch(_){ /* network issues: fallback to sunny */
      apply('sunny');
    }
  }

  if (!reduce){
    update();
    // refresh every 15 minutes
    setInterval(update, 15*60*1000);
  }
})();

