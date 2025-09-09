
(function(){
  // target the terminal body (so header stays fixed)
  const consoleRoot = document.getElementById('console');
  if(!consoleRoot) return;
  const el = document.getElementById('consoleBody') || consoleRoot;

  // Git-style typewriter: types commands, backspaces, and appends results
  const prompt = '$ ';
  const sequences = [
    { cmd: 'git status', out: 'On branch main\nnothing to commit, working tree clean' },
    { cmd: 'git add .', out: '' },
    { cmd: 'git commit -m "feat: update portfolio"', out: '[main 1a2b3c] feat: update portfolio\n 4 files changed, 42 insertions(+), 8 deletions(-)' },
    { cmd: 'git push origin main', out: 'Enumerating objects: 8, done.\nCounting objects: 100% (8/8), done.\nDelta compression using up to 2 threads\nCompressing objects: 100% (5/5), done.\nWriting objects: 100% (5/5), 1.23 KiB | 1.23 MiB/s, done.\nTotal 5 (delta 2), reused 0 (delta 0)\nTo github.com:yourcatismine/portfolio.git\n   9f1a2b3..1a2b3c  main -> main' }
  ];

  let history = '';
  let seqIdx = 0;

  // small helper to escape HTML when injecting into innerHTML
  function escapeHtml(str){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // render the command into the typing span, highlighting the first token (verb)
  function renderCmdSpan(targetSpan, cmdText){
    if(!targetSpan) return;
    const s = String(cmdText || '');
    const esc = escapeHtml(s);
    const idx = esc.indexOf(' ');
    if(idx === -1){
      // no space yet — render the whole as verb (so partial verb highlights while typing)
      targetSpan.innerHTML = `<span class="cmd-verb">${esc}</span>`;
    } else {
      const verb = esc.slice(0, idx);
      const rest = esc.slice(idx + 1);
      targetSpan.innerHTML = `<span class="cmd-verb">${verb}</span> ${rest}`;
    }
  }

  function typeText(target, text, speed = 60){
    return new Promise(res =>{
      let i = 0;
      function step(){
        const cur = text.slice(0, i);
        renderCmdSpan(target, cur);
        i++;
        if(i <= text.length) setTimeout(step, speed + Math.random()*20);
        else res();
      }
      step();
    });
  }

  function backspace(target, count, speed = 40){
    return new Promise(res=>{
      let i = 0;
      function step(){
        const t = target.textContent || '';
        const next = t.slice(0, Math.max(0, t.length - 1));
        renderCmdSpan(target, next);
        i++;
        if(i < count) setTimeout(step, speed + Math.random()*15);
        else res();
      }
      step();
    });
  }

  async function runSequence(){
    // continuous loop over sequences, each command gets its own line element
    while(true){
      const seq = sequences[seqIdx];

      // create a fresh line element for this command
      const lineEl = document.createElement('div');
      lineEl.className = 'console-line';
      lineEl.innerHTML = prompt + '<span class="typing"></span>';
  el.appendChild(lineEl);
  // add visible class on next frame so CSS transition runs
  requestAnimationFrame(()=>{ lineEl.classList.add('is-visible'); try{ el.scrollTop = el.scrollHeight; }catch(_){} });
      // keep history trimmed
      const nodes = Array.from(el.children);
      if(nodes.length > 12){ nodes.slice(0, nodes.length - 12).forEach(n=>n.remove()); }

      const typingSpan = lineEl.querySelector('.typing');

  // show the whole command instantly (one-by-one messages) and highlight the verb
  renderCmdSpan(typingSpan, seq.cmd);
  // ensure new content is visible
  requestAnimationFrame(()=>{ try{ el.scrollTop = el.scrollHeight; }catch(_){} });

      // optionally append output
      if(seq.out){
  const outEl = document.createElement('div'); outEl.className = 'cmd-out'; outEl.innerHTML = seq.out.replace(/\n/g,'<br>');
  el.appendChild(outEl);
  requestAnimationFrame(()=>{ outEl.classList.add('is-visible'); try{ el.scrollTop = el.scrollHeight; }catch(_){} });
      }

      // brief pause
      await new Promise(r=>setTimeout(r, 600 + Math.random()*600));

  // no in-line edits — we display messages one-by-one

      // small pause before moving on
      await new Promise(r=>setTimeout(r, 800 + Math.random()*600));
      seqIdx = (seqIdx + 1) % sequences.length;
    }
  }

  // init
  runSequence().catch(()=>{/* no-op */});
})();

// Like functionality removed (button removed from HTML)

// Like initialization removed

(function(){
  const els=[...document.querySelectorAll('[data-reveal]')];
  if(!('IntersectionObserver' in window)) { els.forEach(e=>e.classList.add('is-visible')); return; }
  const io=new IntersectionObserver((entries)=>{
    for(const entry of entries){ if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target);} }
  },{threshold:.15});
  els.forEach(e=>io.observe(e));
})();

(function(){
  const btn=document.getElementById('toTop');
  if(!btn) return;
  const toggle=()=>{
    if(window.scrollY>300){ btn.classList.add('is-visible'); }
    else{ btn.classList.remove('is-visible'); }
  };
  window.addEventListener('scroll',toggle);
  // init state
  toggle();
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();

(function(){
  const loader = document.getElementById('loader');
  const label = document.getElementById('loader-text');
  if(!loader || !label) return;
  // Ensure page doesn't scroll while loader visible
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

  // Greeting sequence (short, accessible)
  const greetings = ['Bonjour','Hola','Ciao','Hello'];
  let gi = 0;
  const stepDelay = 420; // slower reveal per greeting
  let seqTimer = null;

  function showNextGreeting(){
    label.textContent = greetings[gi] || '';
    gi++;
    if(gi < greetings.length){ seqTimer = setTimeout(showNextGreeting, stepDelay); }
  }

  // Hide routine: graceful fade and restore scrolling
  function hideLoader(){
    if(loader.classList.contains('is-hidden')) return;
    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }

  // Ensure loader hides when the page has loaded or after a maximum timeout
  const MAX_WAIT = 8000; // ms (longer so users can absorb the greeting)
  const maxTimeout = setTimeout(()=>{ clearTimeout(seqTimer); finalize(); }, MAX_WAIT);

  // Try to run the greeting sequence, but avoid blocking long
  seqTimer = setTimeout(showNextGreeting, 80);

  // Prefer to hide when the window fires 'load' (images/fonts ready)
  function onLoaded(){ clearTimeout(maxTimeout); clearTimeout(seqTimer); hideLoader(); window.removeEventListener('load', onLoaded); }
  window.addEventListener('load', onLoaded);

  // Also hide if user presses Escape (accessibility/escape hatch)
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') { clearTimeout(maxTimeout); clearTimeout(seqTimer); hideLoader(); } });

  // Progress bar update (gentle ramp to 85% while loading)
  const progressEl = document.getElementById('loaderProgress');
  function setProgress(p){
    if(!progressEl) return;
    progressEl.setAttribute('aria-valuenow', Math.round(p));
    progressEl.querySelector('::after');
    // update pseudo-element width via inline style hack
    progressEl.style.setProperty('--p', p + '%');
    const inner = progressEl.querySelector('.progress-fill');
  }
  // animate CSS pseudo via width on ::after — ramp more slowly to feel deliberate
  let prog = 0;
  const progTick = setInterval(()=>{
    prog = Math.min(85, prog + (1 + Math.random()*2.5)); // smaller steps
    const bar = document.querySelector('#loaderProgress');
    if(bar) bar.style.setProperty('--p-width', prog + '%');
    if(prog >= 85) clearInterval(progTick);
  }, 420);

  // Apply width to pseudo via inline style using a small helper style element
  const styleId = 'loader-progress-dynamic';
  if(!document.getElementById(styleId)){
    const s = document.createElement('style'); s.id = styleId;
    s.innerHTML = '#loader .loader-progress::after{ width: var(--p-width, 0%) }'; document.head.appendChild(s);
  }

  // Skip button wiring
  const skipBtn = document.getElementById('loaderSkip');
  if(skipBtn){ skipBtn.addEventListener('click', ()=>{ clearTimeout(maxTimeout); clearTimeout(seqTimer); hideLoader(); }); }

  // When we hide (on load), set progress to 100% and wait a short moment so user sees completion
  function finalize(){
    clearInterval(progTick);
    const bar = document.querySelector('#loaderProgress'); if(bar) bar.style.setProperty('--p-width','100%');
    // small pause so 100% is visible and the fade feels intentional
    setTimeout(()=>{ hideLoader(); }, 520);
  }
})();

// Greeting toast (GMT+8)
(function(){
  const toast = document.getElementById('greetToast');
  const msgEl = document.getElementById('greetMsg');
  const closeBtn = document.getElementById('greetClose');
  const iconEl = document.getElementById('greetIcon');
  if(!toast || !msgEl) return;
  function greetingForTz(offsetHours){
    // Compute time in GMT+offsetHours
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tz = new Date(utc + (offsetHours * 3600000));
    const h = tz.getHours();
    if(h < 12) return 'Good Morning';
    if(h < 13) return 'Good Noon';
    if(h < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
  function iconForGreeting(greet){
    if(greet === 'Good Evening') return 'fa-moon';
    if(greet === 'Good Afternoon') return 'fa-sun';
    if(greet === 'Good Noon') return 'fa-sun';
    return 'fa-sun';
  }
  function show(){ toast.classList.add('is-visible'); }
  function hide(){ toast.classList.remove('is-visible'); }
  closeBtn && closeBtn.addEventListener('click', hide);
  // Wait for loader (if present) to finish, else show after a small delay
  const loader = document.getElementById('loader');
  const reveal = ()=>{
    const greet = greetingForTz(8);
    msgEl.textContent = greet;
    if(iconEl){ iconEl.className = 'fa-solid ' + iconForGreeting(greet); }
    show();
    // Auto-hide after 5s (match CSS progress duration)
    setTimeout(hide, 5000);
  };
  if(loader){
    const onHidden = ()=>{ reveal(); loader.removeEventListener('transitionend', onHidden); };
    loader.addEventListener('transitionend', onHidden);
    // Safety reveal if transitionend didn’t fire
    setTimeout(reveal, 2000);
  }else{
    setTimeout(reveal, 800);
  }
})();

// Timeline removed

const songs = [
  { src: '/frontend/sounds/Tahanan.mp3', title: 'Tahanan' },
  { src: '/frontend/sounds/Panaginip.mp3', title: 'Panaginip' },
  { src: '/frontend/sounds/Paraluman.mp3', title: 'Paraluman' },
  { src: '/frontend/sounds/AboutYou.mp3', title: 'About You' },
  { src: '/frontend/sounds/Museo.mp3', title: 'Museo' },
];
let currentSong = 0;

function loadSong(index) {
  const audio = document.getElementById('crushAudio');
  const title = document.getElementById('crushTitle');
  audio.src = songs[index].src;
  title.textContent = songs[index].title;
}

document.getElementById('crushNextSong').addEventListener('click', () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
});

document.getElementById('crushPrevSong').addEventListener('click', () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
});

// Crush photo switcher (defensive, minimal)
(function(){
  try{
    const card = document.getElementById('crushCard');
    if(!card) return;

    const img = card.querySelector('img') || document.getElementById('crushImg');
  const prevBtn = card.querySelector('[data-action="prev"]') || document.getElementById('crushPrev');
  const nextBtn = card.querySelector('[data-action="next"]') || document.getElementById('crushNext');
  const shuffleBtn = card.querySelector('[data-action="shuffle"]') || document.getElementById('crushShuffle');
    const roundToggle = card.querySelector('[data-action="round"]') || document.getElementById('crushRoundToggle');

    // collect image sources from data-images attribute, data-crush-src, or img elements inside .crush-images
    let images = [];
    const photoWrap = card.querySelector('#crushPhoto') || card.querySelector('.crush-photo');
    if(photoWrap){
      const data = photoWrap.getAttribute('data-images');
      if(data){
        data.split(',').forEach(s => {
          const v = (s || '').trim(); if(v) images.push(v);
        });
      }
    }
    const listImgs = card.querySelectorAll('[data-crush-src], .crush-images img');
    listImgs.forEach(i => {
      const s = i.getAttribute('data-crush-src') || i.src;
      if(s) images.push(s);
    });

    // normalize and dedupe while preserving order
    images = images.map(s=> (s||'').trim()).filter(Boolean);
    const seen = new Set();
    images = images.filter(s=>{ if(seen.has(s)) return false; seen.add(s); return true; });
    // fallback: any image in frontend/images
    if(images.length === 0){
      const fallback = card.querySelector('img');
      if(fallback && fallback.src) images.push(fallback.src);
    }
    if(images.length === 0) return;

    let idx = 0;
    function render(){
      if(!img) return;
      img.style.opacity = '0';
      setTimeout(()=>{
        img.src = images[idx];
        img.onload = ()=> img.style.opacity = '1';
      }, 100);
      updateDots && updateDots();
    }

    function next(){ idx = (idx + 1) % images.length; render(); }
    function prev(){ idx = (idx - 1 + images.length) % images.length; render(); }

    if(nextBtn) nextBtn.addEventListener('click', next);
    if(prevBtn) prevBtn.addEventListener('click', prev);

  // likeBtn handling removed here in favor of delegated handler (prevents double-toggle)

    if(roundToggle){
      roundToggle.addEventListener('click', ()=>{
        const is = card.classList.toggle('is-round');
        roundToggle.setAttribute('aria-pressed', is ? 'true' : 'false');
      });
    }

    if(shuffleBtn){
      shuffleBtn.addEventListener('click', ()=>{
        for(let i = images.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * (i + 1));
          [images[i], images[j]] = [images[j], images[i]];
        }
        idx = 0; render();
      });
    }

    // optional dots rendering
    const dotsContainer = card.querySelector('.crush-dots');
    let updateDots = null;
    if(dotsContainer){
      function makeDot(i){
        const d = document.createElement('button');
        d.type = 'button'; d.className = 'crush-dot';
        d.setAttribute('aria-label', 'Image ' + (i+1));
        d.setAttribute('role', 'tab');
        d.addEventListener('click', ()=>{ idx = i; render(); });
        return d;
      }
      function renderDots(){
        dotsContainer.innerHTML = '';
        images.forEach((_, i)=> dotsContainer.appendChild(makeDot(i)));
        // mark the active dot
        Array.from(dotsContainer.children).forEach((c, i)=>{
          c.classList.toggle('active', i === idx);
          c.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
      }
      updateDots = ()=>{
        Array.from(dotsContainer.children).forEach((c, i)=>{
          c.classList.toggle('active', i === idx);
          c.setAttribute('aria-selected', i === idx ? 'true' : 'false');
        });
      };
      renderDots();
    }

    // initial render
    render();
    // --- Autoplay for images: advance automatically when visible ---
    let autoplayInterval = null;
    let autoplayDelay = 4500; // ms between slides
    let autoplayPausedByHover = false;
    let autoplayPausedByInteraction = false; // set when user clicks prev/next/dot

    function startAutoplay(){
      if(autoplayInterval) return;
      autoplayInterval = setInterval(()=>{ if(!autoplayPausedByHover && !autoplayPausedByInteraction) next(); }, autoplayDelay);
    }
    function stopAutoplay(){ if(autoplayInterval){ clearInterval(autoplayInterval); autoplayInterval = null; } }

    // Pause when the user interacts (click prev/next/shuffle/dot)
    const userInteractiveElements = [nextBtn, prevBtn, shuffleBtn, dotsContainer, roundToggle];
    userInteractiveElements.forEach(el=>{
      if(!el) return;
      el.addEventListener('click', ()=>{
        autoplayPausedByInteraction = true;
        // resume after a short idle period
        setTimeout(()=>{ autoplayPausedByInteraction = false; }, 6000);
      }, { passive:true });
    });

    // Pause on hover/focus of photo area
    if(photoWrap){
      photoWrap.addEventListener('mouseenter', ()=>{ autoplayPausedByHover = true; }, { passive:true });
      photoWrap.addEventListener('mouseleave', ()=>{ autoplayPausedByHover = false; }, { passive:true });
      photoWrap.addEventListener('focusin', ()=>{ autoplayPausedByHover = true; }, { passive:true });
      photoWrap.addEventListener('focusout', ()=>{ autoplayPausedByHover = false; }, { passive:true });
    }

    // Only autoplay when the crush card is visible in the viewport
    if('IntersectionObserver' in window && photoWrap){
      const visObs = new IntersectionObserver(entries=>{
        entries.forEach(en=>{
          if(en.isIntersecting){ startAutoplay(); }
          else{ stopAutoplay(); }
        });
      }, { threshold: 0.4 });
      visObs.observe(photoWrap);
    } else {
      // fallback: start autoplay after initial render
      startAutoplay();
    }
  }catch(_){/* non-critical UI wiring failed silently */}
})();

// Crush auto-play audio when visible (with user control)
(function(){
  const card = document.getElementById('crushCard');
  const audio = document.getElementById('crushAudio');
  const btn = document.getElementById('crushPlay');
  const seek = document.getElementById('crushSeek');
  const time = document.getElementById('crushTime');
  const title = document.getElementById('crushTitle');
  if(!card || !audio || !btn) return;
  const src = card.getAttribute('data-audio');
  if(src){ audio.src = src; }
  // Strengthen autoplay on refresh: ensure inline playback and eager buffering
  try{
    audio.setAttribute('playsinline','');
    audio.setAttribute('webkit-playsinline','');
    audio.playsInline = true;
  }catch(_){/* noop */}
  if(audio.preload !== 'auto'){
    try{ audio.preload = 'auto'; audio.setAttribute('preload','auto'); }catch(_){/* noop */}
  }
  // Start muted to satisfy modern autoplay policies; we'll unmute on first user gesture
  if(!audio.muted){
    try{ audio.muted = true; audio.setAttribute('muted',''); }catch(_){/* noop */}
  }
  if(title){
    const file = (src||'Audio').split('/').pop() || 'Audio';
    title.textContent = decodeURIComponent(file.replace(/\.[a-z0-9]+$/i,'').replace(/[_-]+/g,' '));
  }

  let userPaused = false; // if user hits pause, don't auto-play until they press play again
  let triedAutoplay = false;

  function inViewport(el, margin = 0){
    const r = el.getBoundingClientRect();
    return r.top <= (window.innerHeight - margin) && r.bottom >= margin;
  }

  async function attemptPlay(options){
    const { allowMuted = true, requireInView = true } = options || {};
    if(userPaused) return false;
    if(requireInView && !inViewport(card, 40)) return false;
    try{
      await audio.play();
      setPlayingState(true);
      return true;
    }catch(_){
      if(allowMuted){
        audio.muted = true;
        try{ await audio.play(); setPlayingState(true); return true; }catch(__){ /* ignore */ }
      }
    }
    return false;
  }

  function setPlayingState(playing){
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    btn.innerHTML = `<i class="fa-solid ${playing ? 'fa-pause' : 'fa-play'}"></i>`;
  }

  btn.addEventListener('click', async ()=>{
    if(audio.paused){
      try{ await audio.play(); userPaused = false; setPlayingState(true); }
      catch(_){}
    }else{
      audio.pause(); userPaused = true; setPlayingState(false);
    }
  });

  function fmt(seconds){
    if(!Number.isFinite(seconds)) return '0:00';
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2,'0');
  }
  function updateTime(){
    if(!time || !seek) return;
    time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    if(!isNaN(audio.duration) && isFinite(audio.duration)){
      seek.max = audio.duration.toString();
      if(!seek.matches(':active')){ seek.value = audio.currentTime.toString(); }
    }
  }
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('loadedmetadata', updateTime);
  audio.addEventListener('durationchange', updateTime);
  seek && seek.addEventListener('input', ()=>{
    const v = parseFloat(seek.value);
    if(Number.isFinite(v)){ audio.currentTime = v; updateTime(); }
  });

  // Auto play/pause when the card is in view
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(async (entries)=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          if(!userPaused){ await attemptPlay({ allowMuted:true, requireInView:false }); }
        }else{
          // Only auto-pause if we didn't explicitly pause by user
          if(!userPaused){ audio.pause(); setPlayingState(false); }
        }
      }
    }, { threshold: .15, rootMargin: '0px 0px -10% 0px' });
    io.observe(card);
  }

  // When audio ends, reset button
  audio.addEventListener('ended', ()=> setPlayingState(false));
  // On first user gesture, if we auto-started muted, unmute
  const unmuteIfNeeded = ()=>{
    // If playing while muted, unmute to restore sound
    if(!userPaused && audio.muted){ audio.muted = false; audio.removeAttribute('muted'); }
    // If not playing yet but in view, try to start now (unmuted)
    if(audio.paused && inViewport(card, 40)){
      attemptPlay({ allowMuted:false, requireInView:false });
    }
    window.removeEventListener('click', unmuteIfNeeded);
    window.removeEventListener('touchstart', unmuteIfNeeded);
    window.removeEventListener('keydown', unmuteIfNeeded);
    window.removeEventListener('wheel', unmuteIfNeeded);
    window.removeEventListener('scroll', unmuteIfNeeded);
    window.removeEventListener('pointerdown', unmuteIfNeeded);
  };
  window.addEventListener('click', unmuteIfNeeded, { once:false, passive:true });
  window.addEventListener('touchstart', unmuteIfNeeded, { once:false, passive:true });
  window.addEventListener('keydown', unmuteIfNeeded, { once:false });
  window.addEventListener('wheel', unmuteIfNeeded, { passive:true });
  window.addEventListener('scroll', unmuteIfNeeded, { passive:true });
  window.addEventListener('pointerdown', unmuteIfNeeded, { passive:true });
  // Fallback: if intersection didn't trigger yet but user scrolls, try once
  const tryOnScroll = async ()=>{
    if(triedAutoplay || userPaused) return;
    const ok = await attemptPlay({ allowMuted:true, requireInView:true });
    if(ok){
      triedAutoplay = true;
      window.removeEventListener('scroll', tryOnScroll);
    }
  };
  window.addEventListener('scroll', tryOnScroll, { passive:true, once:false });

  // Attempt right after loader hides (if present), with a small delayed retry
  const loader = document.getElementById('loader');
  const attempt = async ()=>{
    if(triedAutoplay || userPaused) return;
    if(!inViewport(card, 0)) return;
    const ok = await attemptPlay({ allowMuted:true, requireInView:false });
    if(ok){ triedAutoplay = true; }
  };
  if(loader){
    loader.addEventListener('transitionend', ()=>{ setTimeout(attempt, 100); setTimeout(attempt, 800); setTimeout(attempt, 1800); });
  }
  // Also attempt once shortly after DOM ready
  setTimeout(attempt, 1200);

  // Re-attempt when metadata is loaded and element is in view
  audio.addEventListener('canplay', ()=>{ if(!userPaused) attemptPlay({ allowMuted:true, requireInView:true }); });
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'visible'){ attemptPlay({ allowMuted:true, requireInView:true }); }
  });
  // Initial time display
  updateTime();
})();

// Crush "since ... until today" duration badge
(function(){
  const el = document.getElementById('crushSince');
  if(!el) return;
  const iso = el.getAttribute('data-since');
  if(!iso) return;
  const start = new Date(iso + 'T00:00:00');
  if(Number.isNaN(start.getTime())) return;

  function diffYMD(a, b){
    // Ensure a <= b
    let from = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    let to = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    if(from > to){ const t = from; from = to; to = t; }
    let years = to.getFullYear() - from.getFullYear();
    let months = to.getMonth() - from.getMonth();
    let days = to.getDate() - from.getDate();
    if(days < 0){
      // borrow days from previous month of 'to'
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
      days += prevMonth;
      months -= 1;
    }
    if(months < 0){ months += 12; years -= 1; }
    return { years, months, days };
  }

  function formatHuman(date){
    return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
  }

  function render(){
    const now = new Date();
    const d = diffYMD(start, now);
    const left = `Since ${formatHuman(start)} — Today`;
    const right = `${d.years} year${d.years!==1?'s':''}, ${d.months} month${d.months!==1?'s':''}, ${d.days} day${d.days!==1?'s':''}`;
    el.textContent = `${left} • ${right}`;
  }

  render();
})();


(function romanticHeartRate(){
  const rateEl = document.getElementById('heartRateNum');
  if(!rateEl) return;
  function randomRate() {
    // Romantic range: 90-200 bpm
    return Math.floor(Math.random() * 111) + 90;
  }
  function updateRate() {
    const rate = randomRate();
    rateEl.textContent = rate;
    // Heart icon pump speed and rate text color
    const heartIcon = rateEl.parentElement && rateEl.parentElement.querySelector('i.fa-heart');
    if(rate > 120) {
      if(heartIcon) heartIcon.style.animationDuration = '0.7s'; // super fast
      rateEl.style.color = '#e63946';
      rateEl.style.textShadow = '0 0 8px #e63946';
    } else if(rate >= 100) {
      if(heartIcon) heartIcon.style.animationDuration = '1.1s'; // fast
      rateEl.style.color = '#e63946';
      rateEl.style.textShadow = '0 0 4px #e63946';
    } else {
      if(heartIcon) heartIcon.style.animationDuration = '1.2s'; // normal
      rateEl.style.color = '';
      rateEl.style.textShadow = '';
    }
  }

  // Reduced frequency and pause when offscreen to improve mobile performance
  updateRate();
  let hrTimer = null;
  let hrVisible = true;
  function scheduleHr(){
    if(hrTimer) clearTimeout(hrTimer);
    hrTimer = setTimeout(()=>{
      hrTimer = null;
      if(hrVisible){ updateRate(); scheduleHr(); }
    }, 2500 + Math.random() * 1500); // 2.5 - 4s
  }
  const crushSection = document.getElementById('crush');
  if('IntersectionObserver' in window && crushSection){
    const io = new IntersectionObserver((entries)=>{
      for(const entry of entries){
        if(entry.isIntersecting){ hrVisible = true; scheduleHr(); }
        else { hrVisible = false; if(hrTimer){ clearTimeout(hrTimer); hrTimer = null; } }
      }
    }, { threshold: 0.15 });
    io.observe(crushSection);
  } else {
    scheduleHr();
  }
})();

// Theme Toggle
(function(){
  const themeToggle = document.getElementById('themeToggle');
  if(!themeToggle) return;

  const html = document.documentElement;
  const icon = themeToggle.querySelector('i');

  // Check for saved theme preference or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  updateIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    if(theme === 'dark') {
      icon.className = 'fa-solid fa-moon';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'fa-solid fa-sun';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
})();

// Project Modals
(function(){
  const projectData = {
    'minecraft-bot': {
      title: 'Minecraft Bedrock Bot',
      image: '/frontend/images/minecraftbot.png',
      description: 'A sophisticated bot for Minecraft Bedrock Edition that relays in-game chat to Discord in real-time. Features include automated logging, player activity monitoring, and custom command handling.',
      technologies: ['JavaScript', 'Node.js', 'Discord.js', 'Bedrock Protocol'],
      features: [
        'Real-time chat relay between Minecraft and Discord',
        'Automated player join/leave notifications',
        'Custom command system',
        'Activity logging and statistics',
        'Anti-spam protection',
        'Role-based permissions'
      ],
      github: 'https://github.com/yourcatismine/minecraft-bot',
      demo: null
    },
    'discord-bot': {
      title: 'Discord Moderation Bot',
      image: '/frontend/images/discordmod.png',
      description: 'A comprehensive Discord bot designed for server moderation and management. Includes features like auto-moderation, custom commands, music playback, and user management tools.',
      technologies: ['JavaScript', 'Node.js', 'Discord.js'],
      features: [
        'Advanced auto-moderation system',
        'Custom command creation',
        'Music playback with queue management',
        'User warning and ban system',
        'Server statistics and analytics',
        'Welcome messages and role assignment',
        'Reaction roles and polls'
      ],
      github: 'https://github.com/yourcatismine/discord-bot',
      demo: null
    },
    'portfolio': {
      title: 'Personal Portfolio Website',
      image: '/frontend/images/web.png',
      description: 'This responsive portfolio website built with modern web technologies. Features smooth animations, dark/light mode toggle, and optimized performance.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5'],
      features: [
        'Responsive design for all devices',
        'Dark/Light mode toggle',
        'Smooth scroll animations',
        'Interactive contact form',
        'Project showcase with modals',
        'Performance optimized',
        'SEO friendly'
      ],
      github: 'https://github.com/yourcatismine/portfolio',
      demo: null
    },
    'capstone': {
      title: 'Capstone Project - Laravel Web App',
      image: '/frontend/images/firstcapstone.png',
      description: 'My first major capstone project built with Laravel and PHP. Features user authentication, Google/GitHub OAuth integration, and email OTP verification system.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'OAuth'],
      features: [
        'User registration and authentication',
        'Google and GitHub OAuth integration',
        'Email OTP verification',
        'Responsive dashboard',
        'User profile management',
        'Session management'
      ],
      github: 'https://github.com/yourcatismine/capstone-project',
      demo: null
    },
    'shop-system': {
      title: 'E-commerce Shop System',
      image: '/frontend/images/shopssytem.png',
      description: 'A complete e-commerce solution built with Laravel featuring money management, Discord login integration, and comprehensive shop functionality.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Discord OAuth', 'Bootstrap'],
      features: [
        'User authentication with Discord OAuth',
        'Product catalog and shopping cart',
        'Payment processing integration',
        'Money management system',
        'Order tracking and history',
        'Admin dashboard',
        'Inventory management'
      ],
      github: 'https://github.com/yourcatismine/shop-system',
      demo: null
    },
    'atbphosting': {
      title: 'ATBP Hosting',
      image: '/frontend/images/atbphosting.png',
      description: 'First Task to build a Hosting Site to Hosting Company. Best Hosting I have ever used than others!',
      technologies: ['JS', 'NextJS', 'Bootstrap'],
      features: [
        'Responsive design for all devices',
        'Dark/Light mode toggle',
        'Smooth scroll animations',
      ],
      github: 'https://github.com/yourcatismine/atbphosting',
      demo: null
    }
  };

  // Handle project detail buttons
  document.addEventListener('click', function(e) {
    if(e.target.classList.contains('view-details')) {
      e.preventDefault();
      const projectId = e.target.getAttribute('data-project');
      showProjectModal(projectId);
    }
  });

  function showProjectModal(projectId) {
    const project = projectData[projectId];
    if(!project) return;

    const modal = new bootstrap.Modal(document.getElementById('projectModal'));
    const content = document.getElementById('projectContent');

    content.innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <img src="${project.image}" alt="${project.title}" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h4>${project.title}</h4>
          <p class="text-secondary mb-3">${project.description}</p>

          <h6>Technologies Used:</h6>
          <div class="mb-3">
            ${project.technologies.map(tech => `<span class="badge bg-primary me-1">${tech}</span>`).join('')}
          </div>

          <h6>Key Features:</h6>
          <ul class="mb-3">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>

          <div class="d-flex gap-2">
            ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-outline-primary btn-sm">
              <i class="fa-brands fa-github me-1"></i>View Code
            </a>` : ''}
            ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-external-link me-1"></i>Live Demo
            </a>` : ''}
          </div>
        </div>
      </div>
    `;

    modal.show();
  }
})();

// Scroll Progress Bar
(function(){
  const progressBar = document.getElementById('scrollProgress');
  if(!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress);
  // Initial call
  updateProgress();
})();

// Animated Counters
(function(){
  const counters = document.querySelectorAll('.stat-number');
  if(counters.length === 0) return;

  let hasAnimated = false;

  function animateCounters() {
    if(hasAnimated) return;
    hasAnimated = true;

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if(current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, 16);
    });
  }

  // Trigger animation when stats section comes into view
  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stat-item')?.closest('section');
    if(statsSection) {
      observer.observe(statsSection);
    }
  } else {
    // Fallback: animate after a delay
    setTimeout(animateCounters, 1000);
  }
})();

// Enhanced Crush Features
(function(){
  const crushCard = document.getElementById('crushCard');
  if(!crushCard) return;

  // Floating Hearts Animation
  function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
    heart.style.fontSize = (Math.random() * 0.5 + 1) + 'rem';

    const floatingHearts = document.getElementById('floatingHearts');
    if(floatingHearts) {
      floatingHearts.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 3000);
    }
  }

  // Create hearts periodically when crush section is visible
  let heartInterval = null;
  const crushSection = document.getElementById('crush');

  if('IntersectionObserver' in window && crushSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          heartInterval = setInterval(createFloatingHeart, 2000);
        } else {
          if(heartInterval) {
            clearInterval(heartInterval);
            heartInterval = null;
          }
        }
      });
    }, { threshold: 0.3 });

    observer.observe(crushSection);
  }

  // Typing Effect for Quote
  const quoteElement = document.getElementById('crushQuote');
  if(quoteElement) {
    const originalText = quoteElement.textContent;
    quoteElement.textContent = '';
    quoteElement.classList.add('crush-quote-typing');

    let charIndex = 0;
    const typingSpeed = 50;

    function typeWriter() {
      if(charIndex < originalText.length) {
        quoteElement.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        quoteElement.classList.remove('crush-quote-typing');
      }
    }

    // Start typing when crush section comes into view
    if('IntersectionObserver' in window && crushSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            setTimeout(typeWriter, 1000); // Delay to let user see the section first
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });

      observer.observe(crushSection);
    } else {
      setTimeout(typeWriter, 2000);
    }
  }

  // Love Meter Animation
  const loveMeterFill = document.getElementById('loveMeterFill');
  const lovePercentage = document.getElementById('lovePercentage');

  if(loveMeterFill && lovePercentage) {
    let currentPercentage = 0;
    const targetPercentage = 100;
    const animationDuration = 2000;
    const stepTime = 50;
    const steps = animationDuration / stepTime;
    const stepValue = targetPercentage / steps;

    function animateLoveMeter() {
      if(currentPercentage < targetPercentage) {
        currentPercentage += stepValue;
        const displayPercentage = Math.min(Math.round(currentPercentage), targetPercentage);

        loveMeterFill.style.width = displayPercentage + '%';
        lovePercentage.textContent = displayPercentage + '%';

        setTimeout(animateLoveMeter, stepTime);
      }
    }

    // Start animation when crush section is visible
    if('IntersectionObserver' in window && crushSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            setTimeout(animateLoveMeter, 500);
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      observer.observe(crushSection);
    } else {
      setTimeout(animateLoveMeter, 1000);
    }
  }

  // Special Dates Highlighting
  const specialDates = document.querySelectorAll('.special-date');
  const today = new Date();

  specialDates.forEach(dateElement => {
    const dateStr = dateElement.getAttribute('data-date');
    if(dateStr) {
      const eventDate = new Date(dateStr);
      const diffTime = today - eventDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Add days since badge
      const daysBadge = document.createElement('span');
      daysBadge.className = 'days-since';
      daysBadge.textContent = `${diffDays} days ago`;
      dateElement.appendChild(daysBadge);

      // Highlight if it's a special date (anniversary, etc.)
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();
      const eventMonth = eventDate.getMonth();
      const eventDay = eventDate.getDate();

      if(todayMonth === eventMonth && todayDay === eventDay) {
        dateElement.classList.add('special-today');
        dateElement.querySelector('.date-badge').textContent += ' 🎉';
      }
    }
  });

  // Like button removed: floating-heart trigger removed
})();

// Timeline Toggle Functionality
(function(){
  const timelineToggle = document.getElementById('timelineToggle');
  const monthlyTimeline = document.getElementById('monthlyTimeline');
  const timelineText = document.getElementById('timelineText');

  if(timelineToggle && monthlyTimeline && timelineText) {
    let isExpanded = false;

    timelineToggle.addEventListener('click', () => {
      isExpanded = !isExpanded;

      if(isExpanded) {
        monthlyTimeline.style.display = 'block';
        timelineText.textContent = 'Hide Timeline';
        timelineToggle.querySelector('.fa-chevron-down').style.transform = 'rotate(180deg)';
        // Smooth scroll to show the timeline
        setTimeout(() => {
          monthlyTimeline.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      } else {
        monthlyTimeline.style.display = 'none';
        timelineText.textContent = 'Show Full Timeline';
        timelineToggle.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
      }
    });
  }
})();

// Horizontal Timeline Navigation
(function(){
  const timelinePrev = document.getElementById('timelinePrev');
  const timelineNext = document.getElementById('timelineNext');
  const currentYearDisplay = document.getElementById('currentYear');
  const timelineTrack = document.getElementById('timelineTrack');
  const yearSections = document.querySelectorAll('.timeline-year-section');

  if(timelinePrev && timelineNext && currentYearDisplay && timelineTrack && yearSections.length > 0) {
    let currentYearIndex = 0;
    const years = ['2023', '2024', '2025'];
    let isScrolling = false;

    // Initialize with current year (2025)
    currentYearIndex = years.indexOf('2025');
    updateTimeline();

    function updateTimeline() {
      const currentYear = years[currentYearIndex];
      currentYearDisplay.textContent = currentYear;

      // Hide all sections
      yearSections.forEach(section => {
        section.style.display = 'none';
      });

      // Show current year section
      const currentSection = document.querySelector(`[data-year="${currentYear}"]`);
      if(currentSection) {
        currentSection.style.display = 'flex';
      }

      // Update button states
      timelinePrev.disabled = currentYearIndex === 0;
      timelineNext.disabled = currentYearIndex === years.length - 1;

      // Add visual feedback
      timelinePrev.style.opacity = currentYearIndex === 0 ? '0.5' : '1';
      timelineNext.style.opacity = currentYearIndex === years.length - 1 ? '0.5' : '1';

      // Update fade effects after a short delay to allow DOM updates
      setTimeout(updateFadeEffects, 100);
    }

    function updateFadeEffects() {
      if (!timelineTrack) return;

      const scrollLeft = timelineTrack.scrollLeft;
      const scrollWidth = timelineTrack.scrollWidth;
      const clientWidth = timelineTrack.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      // If there's no horizontal overflow, remove fades entirely
      if (maxScroll <= 10) {
        timelineTrack.classList.remove('fade-left', 'fade-right', 'fade-both');
        timelineTrack.classList.add('no-fade');
      } else {
        timelineTrack.classList.remove('no-fade');

        // Remove all fade classes
        timelineTrack.classList.remove('fade-left', 'fade-right', 'fade-both');

        // Add appropriate fade classes based on scroll position
        if (scrollLeft <= 10) {
          // At the beginning: hide left fade
          timelineTrack.classList.add('fade-left');
        } else if (scrollLeft >= maxScroll - 10) {
          // At the end: hide right fade
          timelineTrack.classList.add('fade-right');
        } else if (maxScroll > 10) {
          // In the middle (can scroll both ways): show both fades
          timelineTrack.classList.add('fade-both');
        }
      }

      // Update fade effects for year milestones within the current year
      updateYearMilestonesFade();
    }

    function updateYearMilestonesFade() {
      const currentYear = years[currentYearIndex];
      const currentSection = document.querySelector(`[data-year="${currentYear}"]`);
      if (!currentSection) return;

      const yearMilestones = currentSection.querySelector('.year-milestones');
      if (!yearMilestones) return;

      const scrollLeft = yearMilestones.scrollLeft;
      const scrollWidth = yearMilestones.scrollWidth;
      const clientWidth = yearMilestones.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      // Remove all fade classes
      yearMilestones.classList.remove('fade-left', 'fade-right', 'fade-both');

      // Add appropriate fade classes based on scroll position
      if (scrollLeft <= 10) {
        // At the beginning
        yearMilestones.classList.add('fade-left');
      } else if (scrollLeft >= maxScroll - 10) {
        // At the end
        yearMilestones.classList.add('fade-right');
      } else if (maxScroll > 10) {
        // In the middle (can scroll both ways)
        yearMilestones.classList.add('fade-both');
      }
    }

    // Handle timeline scrolling
    timelineTrack.addEventListener('scroll', () => {
      if (!isScrolling) {
        requestAnimationFrame(updateFadeEffects);
      }
    });

    // Handle year milestones scrolling
    yearSections.forEach(section => {
      const yearMilestones = section.querySelector('.year-milestones');
      if (yearMilestones) {
        yearMilestones.addEventListener('scroll', () => {
          requestAnimationFrame(updateYearMilestonesFade);
        });
      }
    });

    // Smooth scroll to year section
    function scrollToYear(yearIndex) {
      const targetYear = years[yearIndex];
      const targetSection = document.querySelector(`[data-year="${targetYear}"]`);

      if (targetSection) {
        isScrolling = true;
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        });

        // Reset scrolling flag after animation
        setTimeout(() => {
          isScrolling = false;
          updateFadeEffects();
        }, 500);
      }
    }

    timelinePrev.addEventListener('click', () => {
      if(currentYearIndex > 0) {
        currentYearIndex--;
        scrollToYear(currentYearIndex);
        updateTimeline();
      }
    });

    timelineNext.addEventListener('click', () => {
      if(currentYearIndex < years.length - 1) {
        currentYearIndex++;
        scrollToYear(currentYearIndex);
        updateTimeline();
      }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowLeft' && currentYearIndex > 0) {
        currentYearIndex--;
        scrollToYear(currentYearIndex);
        updateTimeline();
      } else if(e.key === 'ArrowRight' && currentYearIndex < years.length - 1) {
        currentYearIndex++;
        scrollToYear(currentYearIndex);
        updateTimeline();
      }
    });

    // Initialize fade effects
    updateFadeEffects();

    // Update fade effects on window resize
    window.addEventListener('resize', updateFadeEffects);
  }
})();

  // Map vertical wheel to horizontal scroll for timeline areas (down -> right, up -> left)
  (function(){
    try {
      const timelineTrack = document.getElementById('timelineTrack');
      const yearContainers = Array.from(document.querySelectorAll('.year-milestones'));
      const containers = [timelineTrack, ...yearContainers].filter(Boolean);

  const WHEEL_SENSITIVITY = 2.2; // multiplier for wheel deltas

      containers.forEach(el => {
        // Prevent manual wheel from scrolling the timeline; keep auto-scroll authoritative
        el.addEventListener('wheel', function(e){
          // prevent native vertical page scroll when pointer is over timeline
          try { e.preventDefault(); } catch(_){}
          // do not map wheel to horizontal scroll — auto-scroll handles movement
        }, { passive: false });
      });
    } catch (err) {
      // silent fail for older browsers
      console.warn('timeline wheel binding failed', err);
    }
  })();

  // Pointer/touch mapping: vertical swipe/drags -> horizontal scroll for timeline containers.
  (function(){
    try {
  const timelineTrack = document.getElementById('timelineTrack');
  const yearContainers = Array.from(document.querySelectorAll('.year-milestones'));
  const containers = [timelineTrack, ...yearContainers].filter(Boolean);

  const POINTER_SENSITIVITY = 1.8; // multiplier for pointer drag/swipe responsiveness

      containers.forEach(el => {
        // prevent touch/pointer dragging from moving the timeline — keep auto-scroll authoritative
        try { el.style.touchAction = 'none'; } catch(_){}
        el.addEventListener('pointermove', function(e){ if(e.cancelable) e.preventDefault(); }, { passive: false });
        el.addEventListener('touchmove', function(e){ if(e.cancelable) e.preventDefault(); }, { passive: false });
      });
    } catch(err){
      console.warn('timeline pointer/touch binding failed', err);
    }
  })();