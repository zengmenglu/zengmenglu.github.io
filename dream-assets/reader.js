'use strict';

const data = JSON.parse(document.getElementById('reader-data').textContent);
const room = document.getElementById('reading-room');
const stage = document.getElementById('reader-stage');
const spread = document.getElementById('reader-spread');
const back = document.getElementById('previous-page');
const next = document.getElementById('next-page');
const pageCounter = document.getElementById('page-counter');
const fitSpread = document.getElementById('spread-toggle');
const fullScreen = document.getElementById('fullscreen-toggle');
const returnLink = document.getElementById('reader-return');
const phone = matchMedia('(max-width: 700px) and (orientation: portrait)');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const origin = new URLSearchParams(location.search).get('from');
const requestedPage = /^#page-(\d+)$/.exec(location.hash);
let currentPage = Math.min(data.pages.length - 1, Math.max(0, Number(requestedPage?.[1]) - 1 || 0));
let showSpread = false;
let views = [];
let position = 0;
let pointer = null;
let preferScreen = false;
let frame = 0;

if (origin === 'home') returnLink.href = `/#${data.series}-${data.number}`;

function buildViews() {
  views = [[0]];
  const step = phone.matches && !showSpread ? 1 : 2;
  for (let page = 1; page < data.pages.length; page += step) {
    const view = [page];
    if (step === 2 && page + 1 < data.pages.length) view.push(page + 1);
    views.push(view);
  }
  position = views.findIndex(view => view.includes(currentPage));
  fitSpread.hidden = !phone.matches;
}

async function draw(direction = 0) {
  const id = ++frame;
  const shown = views[position];
  const images = shown.map(index => {
    const img = document.createElement('img');
    img.width = 840;
    img.height = 1188;
    img.alt = `第 ${index + 1} 页`;
    img.draggable = false;
    img.src = data.pages[index];
    return img;
  });
  back.disabled = position === 0;
  next.disabled = position === views.length - 1;
  pageCounter.textContent = `${shown.map(index => index + 1).join('–')} / ${data.pages.length}`;
  await Promise.allSettled(images.map(image => image.decode()));
  if (id !== frame) return;
  spread.style.setProperty('--visible-pages', shown.length);
  spread.replaceChildren(...images);
  spread.classList.remove('turn-forward', 'turn-back');
  if (direction && !reduceMotion.matches) {
    requestAnimationFrame(() => spread.classList.add(direction > 0 ? 'turn-forward' : 'turn-back'));
  }
}

function move(direction) {
  const target = position + direction;
  if (target < 0 || target >= views.length) return;
  position = target;
  currentPage = views[position][0];
  history.replaceState(null, '', `#page-${currentPage + 1}`);
  draw(direction);
}

function syncImmersive(active) {
  room.classList.toggle('immersive', active);
  fullScreen.textContent = active ? '退出全屏' : '全屏';
  fullScreen.setAttribute('aria-pressed', String(active));
}

async function toggleScreen() {
  if (document.fullscreenElement === room) {
    await document.exitFullscreen();
    return;
  }
  if (preferScreen) {
    preferScreen = false;
    syncImmersive(false);
    return;
  }
  if (room.requestFullscreen) {
    try {
      await room.requestFullscreen({ navigationUI: 'hide' });
      return;
    } catch {}
  }
  preferScreen = true;
  syncImmersive(true);
}
document.addEventListener('fullscreenchange', () => syncImmersive(document.fullscreenElement === room || preferScreen));
fullScreen.addEventListener('click', toggleScreen);
back.addEventListener('click', () => move(-1));
next.addEventListener('click', () => move(1));
phone.addEventListener('change', () => { buildViews(); draw(); });
fitSpread.addEventListener('click', () => {
  showSpread = !showSpread;
  fitSpread.textContent = showSpread ? '单页' : '整幅跨页';
  fitSpread.setAttribute('aria-pressed', String(showSpread));
  buildViews();
  draw();
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  }
  if (event.key === 'Escape' && preferScreen) toggleScreen();
});
stage.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch') return;
  pointer = event.isPrimary ? { x: event.clientX, y: event.clientY, id: event.pointerId } : null;
});
stage.addEventListener('pointercancel', () => { pointer = null; });
stage.addEventListener('pointerup', event => {
  if (!pointer || event.pointerId !== pointer.id) return;
  const x = event.clientX - pointer.x, y = event.clientY - pointer.y;
  pointer = null;
  if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.25) move(x < 0 ? 1 : -1);
});
buildViews();
if (requestedPage || views[position].length > 1) draw();
else fitSpread.hidden = !phone.matches;
