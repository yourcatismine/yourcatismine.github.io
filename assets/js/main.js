
(function(){
  const el = document.getElementById('console');
  if(!el) return;
  const lines = [
    'Welcome to My Portoflio',
    'This is Diego',
    'I like Kiara',
    'I love coding',
  ];
  const prompt = '$ ';
  let line = 0, char = 0, history = '';
  function render(){
    const current = prompt + (lines[line] ?? '');
    el.innerHTML = history + current.slice(0, prompt.length + char) + '<span class="caret"></span>';
  }
  function tick(){
    if(line >= lines.length){
      el.innerHTML = history + '<span class="caret"></span>';
      return;
    }
    render();
    if(char < lines[line].length){
      char++;
      setTimeout(tick, 65);
      return;
    }
    history += prompt + lines[line] + '<br>';
    line++;
    char = 0;
    setTimeout(tick, 450);
  }
  tick();
})();

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
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');
  const greetings = [
    'Bonjour',      // French
    'Hola',         // Spanish
    'こんにちは',       // Japanese
    '안녕하세요',        // Korean
    'مرحبًا',         // Arabic
    'Hallo',        // German
    'Ciao',         // Italian
    'Olá',          // Portuguese
    'नमस्ते',        // Hindi
    '你好',           // Chinese
    'Здравствуйте', // Russian
    'Hello'         // Final
  ];
  let i = 0;
  const stepDelay = 120; // ms per word
  function next(){
    label.textContent = greetings[i];
    i++;
    if(i < greetings.length){
      setTimeout(next, stepDelay);
    }else{
      setTimeout(()=> {
        loader.classList.add('is-hidden');
        setTimeout(()=>{
          document.documentElement.classList.remove('no-scroll');
          document.body.classList.remove('no-scroll');
        }, 380);
      }, 750);
    }
  }
  const safety = setTimeout(()=> {
    loader.classList.add('is-hidden');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  }, 6000);
  loader.addEventListener('transitionend', ()=> clearTimeout(safety));
  setTimeout(next, 60);
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

// Crush photo switcher
(function(){
  const container = document.getElementById('crush');
  if(!container) return;
  const card = document.getElementById('crushCard');
  const photoWrap = document.getElementById('crushPhoto');
  const img = document.getElementById('crushImg');
  const prev = document.getElementById('crushPrev');
  const next = document.getElementById('crushNext');
  const dots = document.getElementById('crushDots');
  const guard = document.getElementById('crushGuard');
  if(!card || !photoWrap || !img || !dots) return;

  // Read image list from data-images or fallback to current src
  let images = [];
  const attr = photoWrap.getAttribute('data-images');
  if(attr){ images = attr.split(',').map(s=>s.trim()).filter(Boolean); }
  if(images.length === 0){ images = [img.getAttribute('src')]; }
  let idx = 0;
  let autoTimer = null;
  let autoVisible = false;

  function renderDots(){
    dots.innerHTML = '';
    images.forEach((_, i)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', i===idx ? 'true' : 'false');
      b.setAttribute('aria-label', 'Photo ' + (i+1));
      b.addEventListener('click', ()=> go(i));
      dots.appendChild(b);
    });
  }

  function go(newIdx){
    if(newIdx < 0) newIdx = images.length - 1;
    if(newIdx >= images.length) newIdx = 0;
    if(newIdx === idx) return;
    idx = newIdx;
    // simple fade
    img.style.opacity = '0';
    setTimeout(()=>{
      img.src = images[idx];
      img.onload = ()=>{ img.style.opacity = '1'; };
      // update dots
      [...dots.children].forEach((d, i)=> d.setAttribute('aria-selected', i===idx ? 'true' : 'false'));
      // reset auto-timer after manual change
      if(autoTimer){ startAuto(); }
    }, 140);
  }

  prev && prev.addEventListener('click', ()=> go(idx-1));
  next && next.addEventListener('click', ()=> go(idx+1));
  card.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') { e.preventDefault(); go(idx-1); }
    if(e.key === 'ArrowRight') { e.preventDefault(); go(idx+1); }
  });

  // Anti-download interactions on the image area (best-effort; note users can still capture via screenshots/devtools)
  if(guard){
    const block = (e)=>{ e.preventDefault(); e.stopPropagation(); };
    guard.addEventListener('contextmenu', block);
    guard.addEventListener('dragstart', block);
    guard.addEventListener('mousedown', (e)=>{
      // allow clicks to pass to nav/dots by z-index; guard itself blocks direct image interactions
      if(e.button === 1){ block(e); } // middle click
    });
    guard.addEventListener('touchstart', (e)=>{
      // Prevent long-press save dialogs on some mobile browsers
      block(e);
    }, { passive:false });
  }

  function scheduleNextAuto(delay){
    stopAuto();
    autoTimer = setTimeout(()=>{
      autoTimer = null;
      if(autoVisible && images.length >= 2){ go(idx+1); scheduleNextAuto(3000); }
    }, delay);
  }
  function stopAuto(){ if(autoTimer){ clearTimeout(autoTimer); autoTimer = null; } }
  // Pause auto on hover/focus; resume on leave/blur
  card.addEventListener('mouseenter', stopAuto);
  card.addEventListener('mouseleave', ()=>{ if(autoVisible) scheduleNextAuto(1200); });
  card.addEventListener('focusin', stopAuto);
  card.addEventListener('focusout', ()=>{ if(autoVisible) scheduleNextAuto(1200); });

  // Public helpers: allow quick toggles via data attributes
  // data-round="true" on #crushCard to make photo rounded-circle
  const round = card.getAttribute('data-round');
  if(round === 'true' || card.classList.contains('is-round')){
    card.classList.add('is-round');
  }
  // Optional: data-quote on .crush-content .quote
  const quoteEl = container.querySelector('.crush-content .quote');
  if(quoteEl){
    const qAttr = quoteEl.getAttribute('data-quote');
    if(qAttr){ quoteEl.textContent = qAttr; }
  }

  // Always show controls and dots
  renderDots();
  // Auto-advance only while the card is visible
  if('IntersectionObserver' in window){
    const visIo = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(e.isIntersecting){ autoVisible = true; if(images.length >= 2) scheduleNextAuto(1200); }
        else { autoVisible = false; stopAuto(); }
      }
    }, { threshold: 0.35 });
    visIo.observe(card);
  } else {
    if(images.length >= 2) scheduleNextAuto(1200);
  }

  // --- Additional UI wiring: Like, Toggle Round, Shuffle ---
  try{
    const likeBtn = document.getElementById('crushLike');
    const likeCountEl = document.getElementById('crushLikeCount');
    const roundToggle = document.getElementById('crushRoundToggle');
    const shuffleBtn = document.getElementById('crushShuffle');
    // Like counter persisted to localStorage (key: crush-like-count)
    if(likeCountEl && likeBtn){
      const key = 'crush-like-count';
      let count = parseInt(localStorage.getItem(key) || '0', 10) || 0;
      likeCountEl.textContent = String(count);
      likeBtn.addEventListener('click', ()=>{
        count += 1;
        localStorage.setItem(key, String(count));
        likeCountEl.textContent = String(count);
        likeBtn.setAttribute('aria-pressed','true');
      });
    }
    // Toggle round styling
    if(roundToggle){
      roundToggle.addEventListener('click', ()=>{
        const is = card.classList.toggle('is-round');
        roundToggle.setAttribute('aria-pressed', is ? 'true' : 'false');
      });
    }
    // Shuffle images using Fisher-Yates, then re-render
    if(shuffleBtn){
      shuffleBtn.addEventListener('click', ()=>{
        for(let i = images.length - 1; i > 0; i--){
          const j = Math.floor(Math.random() * (i + 1));
          [images[i], images[j]] = [images[j], images[i]];
        }
        idx = 0;
        renderDots();
        img.style.opacity = '0';
        setTimeout(()=>{ img.src = images[0]; img.onload = ()=> img.style.opacity = '1'; }, 100);
      });
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