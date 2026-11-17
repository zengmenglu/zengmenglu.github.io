"""Build the Dream Space site, retaining the legacy public URLs in the host repo."""
import argparse
from html import escape
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

SOURCE = Path(__file__).resolve().parent
SERIES = {
    'air': {'name': '飞机绘本', 'subtitle': '小椰子的飞行创造家',
            'tiers': [(1, 2, 1, 0), (0, 2, 2), (2, 1, 0, 1)],
            'decor': ['model-air', 'ornament-telescope', 'ornament-star-lamp']},
    'rail': {'name': '火车绘本', 'subtitle': '知识号',
             'tiers': [(1, 2, 1, 0), (2, 0, 2), (1, 1, 2, 0), (0, 2, 2), (2, 1, 2)],
             'decor': ['model-rail', 'ornament-globe', 'ornament-watch', 'ornament-signal']},
}
ORNAMENT_LABELS = {
    'model-air': '空客 A380-800', 'model-rail': 'CR400BF-Z-0524',
    'ornament-telescope': '望远镜', 'ornament-star-lamp': '星图灯', 'ornament-globe': '天体仪和球形灯',
    'ornament-watch': '铁路怀表', 'ornament-signal': '铁路信号灯',
}
ASSETS = '/dream-assets/'


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write(root, name, content):
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')


def asset(path):
    return ASSETS + path.removeprefix('assets/')


def nav(active):
    items = [('/', '首页', 'home'), ('/books/air/', '飞机绘本', 'air'),
             ('/books/rail/', '火车绘本', 'rail'), ('/gitbook/', '笔记', 'notes')]
    links = ''.join(f'<a href="{href}"{(" aria-current=\"page\"" if page == active else "")}>{label}</a>'
                    for href, label, page in items)
    return f'<header class="masthead"><a class="wordmark" href="/">梦空间</a><nav aria-label="主导航">{links}</nav></header>'


def document(title, name, body, script):
    return f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{escape(title)}</title>
<meta name="theme-color" content="#111a30">
<link rel="stylesheet" href="{ASSETS}site.css">
<script src="{ASSETS}{script}" defer></script>
</head>
<body class="{name}">
{body}
</body>
</html>'''


def card(book, origin):
    series, no = book['series'], book['number']
    title = escape(book['title'])
    model = escape(book['model'])
    cover = escape(asset(book['cover']), quote=True)
    label = f'<span class="book-label"><span>{no}</span><span aria-hidden="true"> · </span><span>{model}</span></span>'
    image = f'<img src="{cover}" alt="{title}" width="420" height="594" loading="lazy" decoding="async">'
    body = f'<span class="cover">{image}</span>{label}'
    key = f'{series}-{no}'
    if book['readable']:
        to = f'/books/{series}/{no}/'
        if origin == 'home':
            to += '?from=home'
        return f'<a class="book" id="{key}" href="{to}" aria-label="阅读《{title}》">{body}</a>'
    return f'<div class="book pending-book" id="{key}" aria-label="《{title}》，整理中">{body}</div>'


def shelves_home(library):
    sections = []
    links = []
    for code, series in SERIES.items():
        pending = all(not book["readable"] for book in library[code])
        status = '<p class="series-status">阅读版整理中</p>' if pending else ""
        name, subtitle = series['name'], series['subtitle']
        links.append(f'<a href="/books/{code}/"><span>{name}<small>{subtitle}</small></span><span aria-hidden="true">›</span></a>')
        books = ''.join(card(book, 'home') for book in library[code])
        sections.append(f'''<section class="strip-section" aria-labelledby="{code}-heading">
  <h2 id="{code}-heading"><a href="/books/{code}/">{name} <span>· {subtitle}</span></a></h2>{status}
  <div class="strip-shell">
    <button class="strip-arrow prev" type="button" aria-label="{name}向左" aria-controls="{code}-strip" data-move="-1">‹</button>
    <div class="strip" id="{code}-strip" tabindex="0" role="region" aria-label="{name}封面">{books}</div>
    <button class="strip-arrow next" type="button" aria-label="{name}向右" aria-controls="{code}-strip" data-move="1">›</button>
  </div>
</section>''')
    return document('梦空间', 'home', f'''{nav('home')}
<main class="home-layout">
 <aside class="series-links" aria-label="系列书架"><span class="site-star" aria-hidden="true">✦</span>
 <h2>系列书架</h2>{''.join(links)}</aside>
 <div class="home-content"><h1>梦空间</h1>{''.join(sections)}</div>
</main>''', 'site.js')


def cabinet(code, books):
    series = SERIES[code]
    collection = iter(books)
    decor = iter(series['decor'])
    tiers = []
    if sum(map(sum, series['tiers'])) != len(books):
        raise ValueError(f'{code} cabinet counts do not match its catalog')
    for compartments in series['tiers']:
        cells = []
        for count in compartments:
            if count:
                contents = ''.join(card(next(collection), 'shelf') for _ in range(count))
                cells.append(f'<div class="compartment compartment-{count}">{contents}</div>')
                continue
            key = next(decor)
            title = ORNAMENT_LABELS[key]
            plate = f'<span class="book-label">{title}</span>' if key.startswith('model-') else ''
            cells.append(f'<div class="compartment ornament"><img src="{ASSETS}{key}.webp" alt="{title}" loading="lazy">{plate}</div>')
        tiers.append(f'<div class="cabinet-tier">{"".join(cells)}</div>')
    name, subtitle = series['name'], series['subtitle']
    status = ' · 阅读版整理中' if all(not book['readable'] for book in books) else ''
    return document(name + ' · 梦空间', 'collection', f'''{nav(code)}
<main class="collection-main"><h1>{name}</h1><p class="series-subtitle">{subtitle}{status}</p>
 <div class="cabinet" aria-label="{name}书柜，共 {len(books)} 册">{''.join(tiers)}</div>
</main>''', 'site.js')


def reader(book, pages):
    series = book['series']
    no = book['number']
    name = escape(book['title'])
    first = escape(pages[0], quote=True)
    data = json.dumps({'pages': pages, 'series': series, 'number': no}, ensure_ascii=False).replace('<', '\\u003c')
    return document(name + ' · 梦空间', 'reader', f'''
<main class="reading-room" id="reading-room" aria-label="{name}">
 <header class="reader-toolbar">
  <a id="reader-return" href="/books/{series}/#{series}-{no}">‹ 返回书架</a>
  <h1>{name}</h1>
  <div class="reader-actions"><button type="button" id="spread-toggle" hidden aria-pressed="false">整幅跨页</button>
  <button type="button" id="fullscreen-toggle" aria-pressed="false">全屏</button></div>
 </header>
 <div class="reader-stage" id="reader-stage">
   <div class="reader-spread" id="reader-spread">
     <img src="{first}" alt="第 1 页" width="840" height="1188">
   </div>
 </div>
 <nav class="reader-controls" aria-label="绘本翻页">
   <button type="button" id="previous-page" disabled>‹ 上一页</button>
   <output id="page-counter" aria-live="polite">1 / {len(pages)}</output>
   <button type="button" id="next-page">下一页 ›</button>
 </nav>
</main>
<script type="application/json" id="reader-data">{data}</script>''', 'reader.js')


def build(root, out, note_source):
    library = load(SOURCE/'library.json')
    manifests = {'rail': load(SOURCE/'rail-pages.json')}
    air_manifest = SOURCE/'air-pages.json'
    manifests['air'] = load(air_manifest) if air_manifest.is_file() else {}
    for code, books in library.items():
        for book in books:
            no = book['number']
            has_pages = bool(manifests[code].get(no, {}).get('pages'))
            if code == 'rail' and not has_pages:
                raise ValueError(f'Rail book {no} lacks reader pages')
            book['readable'] = has_pages and book['readable']

    # Only copy the old site's explicitly public files. Exclude source, workflows,
    # developer scripts and any private files in the operator's working tree.
    for name in ('5g', 'book', 'brockly', 'css', 'golang', 'img', 'jottings', 'js', 'plugin'):
        existing = root/name
        if existing.is_dir():
            shutil.copytree(existing, out/name)
    shutil.copytree(SOURCE/'assets', out/'dream-assets')
    shutil.copytree(SOURCE/'static', out/'dream-assets', dirs_exist_ok=True)
    for code, books in library.items():
        write(out, f'books/{code}/index.html', cabinet(code, books))
        for book in books:
            if book['readable']:
                no = book['number']
                files = manifests[code][no]['pages']
                pages = [asset(f'readers/{code}/{file}') for file in files]
                for url in pages:
                    if not (out/url.lstrip('/')).is_file():
                        raise ValueError(f'No page image exists for {url}')
                write(out, f'books/{code}/{no}/index.html', reader(book, pages))
    write(out, 'index.html', shelves_home(library))
    write(out, '.nojekyll', '')
    if note_source:
        subprocess.run([sys.executable, str(note_source/'build.py'),
                        str(out/'gitbook')], cwd=note_source, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host-root', type=Path, default=SOURCE.parent)
    parser.add_argument('--output', type=Path, default=SOURCE.parent/'dist')
    parser.add_argument('--skip-notes', action='store_true')
    args = parser.parse_args()
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    note_source = SOURCE/'notes' if not args.skip_notes else None
    with tempfile.TemporaryDirectory(prefix='dream-build-', dir=output.parent) as temporary:
        stage = Path(temporary)/'site'
        stage.mkdir()
        build(args.host_root.resolve(), stage, note_source)
        if output.exists():
            shutil.rmtree(output)
        stage.rename(output)
    print(f'Built {output}')


if __name__ == '__main__':
    main()
