'use strict';

const data = JSON.parse(document.getElementById('reader-data').textContent);
const room = document.getElementById('reading-room');
const stage = document.getElementById('reader-stage');
const book = document.getElementById('reader-spread');
const left = document.getElementById('reader-left');
const right = document.getElementById('reader-right');
const previous = document.getElementById('previous-page');
const next = document.getElementById('next-page');
const counter = document.getElementById('page-counter');
const fitSpread = document.getElementById('spread-toggle');
const fullScreen = document.getElementById('fullscreen-toggle');
const returnLink = document.getElementById('reader-return');
const phone = matchMedia('(max-width: 700px) and (orientation: portrait)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const origin = new URLSearchParams(location.search).get('from');
const requestedPage = /^#page-(\d+)$/.exec(location.hash);
let current = Math.min(data.pages.length - 1, Math.max(0, Number(requestedPage?.[1]) - 1 || 0));
let views = [];
let index = 0;
let showSpread = false;
let turning = false;
let touchStart = null;
let lastSwipe = -Infinity;
let preferScreen = false;

if (origin === 'home') returnLink.href = `/#${data.series}-${data.number}`;

function singlePage() {
  return phone.matches && !showSpread;
}

function selectPage(page) {
  const last = data.pages.length - 1;
  if (singlePage()) {
    views = data.pages.map((_, number) => [null, number]);
  } else {
    views = [[null, 0]];
    for (let number = 1; number < last; number += 2) {
      views.push([number, number + 1 < last ? number + 1 : null]);
    }
    if (last) views.push([last, null]);
  }
  book.classList.toggle('single-page', singlePage());
  index = views.findIndex(view => view.includes(page));
  current = page;
  draw();
}

function drawPage(button, page, action) {
  const image = button.firstElementChild;
  button.classList.toggle('empty', page === null);
  if (page === null) {
    image.removeAttribute('src');
    button.removeAttribute('aria-label');
    return;
  }
  if (image.getAttribute('src') !== data.pages[page]) image.src = data.pages[page];
  button.setAttribute('aria-label', `第 ${page + 1} 页，${action}`);
}

function draw() {
  const [first, second] = views[index];
  book.dataset.position = first === null ? 'cover' : second === null ? 'back' : 'spread';
  drawPage(left, first, '翻到上一页');
  drawPage(right, second, '翻到下一页');
  previous.disabled = index === 0;
  next.disabled = index === views.length - 1;
  left.disabled = first === null || previous.disabled;
  right.disabled = second === null || next.disabled;
  fitSpread.hidden = !phone.matches;
  counter.textContent = `${views[index].filter(page => page !== null).map(page => page + 1).join('–')} / ${data.pages.length}`;
}

async function decodedPage(page) {
  const image = new Image();
  image.alt = '';
  image.draggable = false;
  image.src = data.pages[page];
  await image.decode();
  return image;
}

// The visible paper leaf has the current page on the front and the next page
// on the reverse, as in the original airplane reader.
async function turnSpread(from, to, step) {
  const forward = step > 0;
  const front = from[forward ? 1 : 0];
  const reverse = to[forward ? 0 : 1];
  if (front === null || reverse === null) return;

  const [frontImage, backImage] = await Promise.all([decodedPage(front), decodedPage(reverse)]);
  const leaf = document.createElement('div');
  leaf.className = 'paper-leaf ' + (forward ? 'forward' : 'backward');
  leaf.setAttribute('aria-hidden', 'true');
  for (const [image, name] of [[frontImage, 'paper-face'], [backImage, 'paper-face reverse']]) {
    const face = document.createElement('div');
    face.className = name;
    face.append(image);
    leaf.append(face);
  }
  book.dataset.position = 'spread';
  drawPage(left, forward ? from[0] : to[0], '翻到上一页');
  drawPage(right, forward ? to[1] : from[1], '翻到下一页');
  book.append(leaf);
  try {
    await leaf.animate([
      { transform: 'rotateY(0deg)' },
      { transform: `rotateY(${forward ? -180 : 180}deg)` },
    ], { duration: 450, easing: 'ease-in-out', fill: 'forwards' }).finished;
  } finally {
    leaf.remove();
  }
}

async function turn(step) {
  const target = views[index + step];
  if (turning || !target) return;
  turning = true;
  try {
    if (!reduced.matches && book.animate) {
      if (singlePage()) {
        await decodedPage(target[1]);
        await right.animate([
          { transform: 'rotateY(0deg)', opacity: 1 },
          { transform: `rotateY(${step * -72}deg)`, opacity: .12 },
        ], { duration: 190, easing: 'ease-in' }).finished;
      } else {
        await turnSpread(views[index], target, step);
      }
    }
  } catch {
    // A page can still be requested by the static reader on a slow connection.
  } finally {
    const page = target[0] ?? target[1];
    selectPage(page);
    history.replaceState(null, '', `#page-${page + 1}`);
    turning = false;
  }
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
previous.addEventListener('click', () => turn(-1));
next.addEventListener('click', () => turn(1));
for (const [page, direction] of [[left, -1], [right, 1]]) {
  page.addEventListener('click', event => {
    if (event.detail === 0 || performance.now() - lastSwipe > 350) turn(direction);
  });
}
phone.addEventListener('change', () => { if (!turning) selectPage(current); });
fitSpread.addEventListener('click', () => {
  if (turning) return;
  showSpread = !showSpread;
  fitSpread.textContent = showSpread ? '单页' : '整幅跨页';
  fitSpread.setAttribute('aria-pressed', String(showSpread));
  selectPage(current);
});
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    turn(event.key === 'ArrowLeft' ? -1 : 1);
  }
  if (event.key === 'Escape' && preferScreen) toggleScreen();
});
stage.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.pointerType === 'touch') touchStart = event;
});
stage.addEventListener('pointercancel', () => { touchStart = null; });
stage.addEventListener('pointerup', event => {
  if (!touchStart || event.pointerId !== touchStart.pointerId) return;
  const distance = event.clientX - touchStart.clientX;
  const rise = event.clientY - touchStart.clientY;
  touchStart = null;
  if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(rise)) {
    lastSwipe = performance.now();
    turn(distance < 0 ? 1 : -1);
  }
});
selectPage(current);
