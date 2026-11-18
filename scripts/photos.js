// Photo wall under CONTACT: drifts sideways on its own in an endless loop. Drag, swipe or sideways-scroll it and
// it waits for you; hovering pauses it. Click a photo to open the viewer.
//
//
// The photo list comes from photos.json, which the GitHub Action (.github/workflows/pages.yml) builds from whatever is
// in photos/ on each push. To preview locally, run: python3 tools/build_photos.py
fetch('photos.json').then(r => r.json()).then(list => {
  const PHOTOS = list.map(p => [p.src, p.ratio]);
  const wall = document.querySelector('.photo-wall');
  if (!wall) return;
  const track = wall.querySelector('.photo-track');
  const viewer = document.querySelector('.photo-viewer');
  const viewerImg = viewer.querySelector('img');
  const counter = viewer.querySelector('.photo-count');
  const src = name => 'photos/' + encodeURIComponent(name);

  const SPEED = 55;        // px per second
  const IDLE_MS = 2500;    // after you let go, wait this long before drifting again

  // seeded random, so the wall has the same layout on every visit
  let seed = 7;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // frame size in grid cells [cols, rows] close to the photo's shape; the wall is 6 rows tall
  function spans(ratio) {
    const fits = [];
    for (let r = 2; r <= 4; r++) {
      const c = Math.round(ratio * r);
      if (c >= 2 && c <= 8 && Math.abs(Math.log(c / r / ratio)) < 0.2) fits.push([c, r]);
    }
    return fits.length ? fits[Math.floor(rand() * fits.length)] : [2, 2];
  }
  const layout = PHOTOS.map(([, ratio]) => spans(ratio));

  // two identical grids side by side: scrolling one grid's width brings you back to the same picture, so it loops
  for (let copy = 0; copy < 2; copy++) {
    const grid = document.createElement('div');
    grid.className = 'photo-grid';
    if (copy) grid.setAttribute('aria-hidden', 'true');
    PHOTOS.forEach(([name], i) => {
      const btn = document.createElement('button');
      btn.className = 'photo-tile';
      btn.type = 'button';
      btn.style.gridColumn = `span ${layout[i][0]}`;
      btn.style.gridRow = `span ${layout[i][1]}`;
      btn.setAttribute('aria-label', `Open photo ${i + 1} of ${PHOTOS.length}`);
      if (copy) btn.tabIndex = -1;
      const img = document.createElement('img');
      img.src = src(name);
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      btn.appendChild(img);
      btn.addEventListener('click', () => { if (!dragged) open(i); });
      grid.appendChild(btn);
    });
    track.appendChild(grid);
  }
  const period = () => track.children[1].offsetLeft - track.children[0].offsetLeft;

  // ---- drift ----
  let pos = 1, last = 0, hovered = false, holdUntil = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hold = () => { holdUntil = performance.now() + IDLE_MS; };

  function wrap() {
    const p = period();
    if (p <= 0) return;
    if (wall.scrollLeft >= p + 1) wall.scrollLeft -= p;
    else if (wall.scrollLeft < 1) wall.scrollLeft += p;
  }

  function tick(now) {
    const dt = last ? Math.min(now - last, 100) / 1000 : 0;
    last = now;
    const idle = !reduced && !hovered && !dragging && !viewer.open && now > holdUntil;
    if (idle) {
      pos += SPEED * dt;
      const p = period();
      if (p > 0 && pos >= p + 1) pos -= p;
      wall.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  }

  // any manual scroll (swipe, shift+wheel, trackpad, drag) takes over; the drift resumes from wherever you left it
  // (the drift's own writes get rounded to whole px, so only a real jump counts as you scrolling)
  wall.addEventListener('scroll', () => { wrap(); if (Math.abs(wall.scrollLeft - pos) > 2) pos = wall.scrollLeft; }, { passive: true });
  wall.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > 0) hold(); }, { passive: true });
  wall.addEventListener('touchstart', hold, { passive: true });
  wall.addEventListener('touchend', hold, { passive: true });
  wall.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hovered = true; });
  wall.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hovered = false; });

  // click-and-drag with a mouse (touch already pans natively)
  let dragging = false, dragged = false, startX = 0, startLeft = 0;
  wall.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; dragged = false;
    startX = e.clientX; startLeft = wall.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { dragged = true; wall.classList.add('dragging'); }
    if (dragged) {
      const p = period();
      let x = startLeft - dx;
      // keep the drag endless too: shift the start point when it would run off either end
      if (x >= p + 1) { startLeft -= p; x -= p; } else if (x < 1) { startLeft += p; x += p; }
      wall.scrollLeft = x;
    }
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    wall.classList.remove('dragging');
    hold();
    setTimeout(() => { dragged = false; });   // after the click that follows a drag has been ignored
  });

  requestAnimationFrame(tick);

  // ---- the viewer ----
  let current = 0;
  function show(i) {
    current = (i + PHOTOS.length) % PHOTOS.length;
    viewerImg.src = src(PHOTOS[current][0]);
    counter.textContent = `${current + 1} / ${PHOTOS.length}`;
    [current - 1, current + 1].forEach(j => { new Image().src = src(PHOTOS[(j + PHOTOS.length) % PHOTOS.length][0]); });
  }
  function open(i) { show(i); viewer.showModal(); }

  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', e => { if (e.target === viewer || e.target.classList.contains('viewer-stage')) viewer.close(); });
  viewer.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });
  viewer.addEventListener('close', hold);

  let touchX = null;
  viewer.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
});
