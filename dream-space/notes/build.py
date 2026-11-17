"""Build the legacy GitBook presentation from Markdown into a GitHub Pages directory."""
from argparse import ArgumentParser
from collections import OrderedDict
from hashlib import sha256
from html import escape
from pathlib import Path, PurePosixPath
from urllib.parse import quote, unquote, urlsplit
import json
import posixpath
import re
import shutil

from lxml import html
from markdown_it import MarkdownIt

ROOT = Path(__file__).resolve().parent
CONFIG = re.compile(r'(gitbook\.page\.hasChanged\()(.*?)(\);)', re.S)
ITEM = re.compile(r'^( *)(?:[-*]) \[((?:[^\]\\]|\\.)+)\]\(([^)]+)\)\s*$')
HEADING = re.compile(r'^##\s+(.+)$')
MARKDOWN = MarkdownIt('commonmark', {'html': True}).enable(['table', 'strikethrough'])
BODY = '<!-- DREAMSPACE_NOTE_BODY -->'


def route_for(source):
    relative = PurePosixPath(source).relative_to('content')
    if relative.name.lower() == 'readme.md':
        return str(relative.with_name('index.html'))
    return str(relative.with_suffix('.html'))


def link_from(page, target):
    return quote(posixpath.relpath(target, posixpath.dirname(page) or '.'), safe='/.-_')


def read_summary(legacy):
    by_source = {value['source']:path for path,value in legacy.items()}
    tree = []
    ancestors = []
    ordered = OrderedDict()
    for number, line in enumerate((ROOT / 'SUMMARY.md').read_text().splitlines(), 1):
        if not line.strip() or line.startswith('# '):
            continue
        if match := HEADING.fullmatch(line):
            tree.append({'header': match.group(1)})
            ancestors.clear()
            continue
        match = ITEM.fullmatch(line)
        if match is None:
            raise ValueError(f'SUMMARY.md:{number}: use a Markdown link in a list item')
        spaces, title, source = match.groups()
        title = re.sub(r'\\(.)',r'\1',title)
        source = unquote(source.strip().removeprefix('./').strip('<>'))
        parts = PurePosixPath(source)
        if not source.startswith('content/') or '..' in parts.parts or parts.suffix.lower() != '.md':
            raise ValueError(f'SUMMARY.md:{number}: invalid Markdown source: {source}')
        if not (ROOT / source).is_file():
            raise FileNotFoundError(f'SUMMARY.md:{number}: {source}')
        if len(spaces)%2:
            raise ValueError(f'SUMMARY.md:{number}: indent nesting by two spaces')
        depth = len(spaces)//2
        if depth>len(ancestors):
            raise ValueError(f'SUMMARY.md:{number}: missing parent')
        route = by_source.get(source, route_for(source))
        node = {'title':title,'source':source,'route':route,'children':[]}
        if depth == 0:
            tree.append(node)
        else:
            ancestors[depth-1]['children'].append(node)
        ancestors[depth:] = [node]
        ordered.setdefault(route,node)
    return tree,ordered


def render_nav(tree, current):
    def items(nodes, parent=None):
        output=[]
        section,number=1,0
        for item in nodes:
            if 'header' in item:
                output.append(f'<li class="header">{escape(item["header"])}</li>')
                section+=1
                number=0
                continue
            number+=1
            level=f'{parent or section}.{number}'
            route=item['route']
            active=' active' if route==current else ''
            location='./' if route=='index.html' else route
            href=link_from(current,route)
            children=item['children']
            nested=f'<ul class="articles">{items(children,level)}</ul>' if children else ''
            output.append(f'<li class="chapter{active}" data-level="{level}" data-path="{escape(location)}"><a href="{href}">{escape(item["title"])}</a>{nested}</li>')
        return ''.join(output)

    return ('<ul class="summary"><li><a class="custom-link" href="/" data-need-reload="1">'
            '返回梦空间</a></li><li class="divider"></li>'
            +items(tree)
            +'<li class="divider"></li><li><a class="gitbook-link" href="https://www.gitbook.com" target="_blank">本书使用 GitBook 发布</a></li></ul>')


def with_headings(markup, metadata):
    element=html.fragment_fromstring(markup,create_parent='div')
    headings=element.xpath('.//*[self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6]')
    used=set()
    labels=[]
    for heading in headings:
        label=heading.text_content().strip()
        key=heading.get('id') or metadata.get('headings',{}).get(label)
        if not key:
            key='-'.join(re.findall(r'[\w-]+',label.casefold())) or 'section'
        unique=key
        counter=1
        while unique in used:
            unique=f'{key}-{counter}'
            counter+=1
        used.add(unique)
        heading.set('id',unique)
        heading.insert(0,html.fragment_fromstring(f'<a class="anchor-navigation-ex-anchor" href="#{quote(unique)}"><i class="fa fa-link" aria-hidden="true"></i></a>'))
        labels.append(f'<li><a href="#{quote(unique)}">{escape(label)}</a></li>')
    if labels:
        element.insert(0,html.fragment_fromstring('<div id="anchor-navigation-ex-navbar"><i class="fa fa-anchor"></i><ul>'+''.join(labels)+'</ul></div>'))
    for link in element.xpath('.//a[@href]'):
        href=link.get('href')
        parsed=urlsplit(href)
        if not parsed.scheme and not parsed.netloc and parsed.path.lower().endswith('.md'):
            published=parsed.path[:-3]+'.html'
            if PurePosixPath(published).name.lower()=='readme.html':
                published=posixpath.join(posixpath.dirname(published),'index.html')
            link.set('href',parsed._replace(path=published).geturl())
    return (element.text or '')+''.join(html.tostring(child,encoding='unicode') for child in element)


def load_template(page, metadata, title, source):
    existing=ROOT/'templates'/page
    has_existing=existing.is_file()
    template=(existing if has_existing else ROOT/'templates'/'index.html').read_text()
    base=posixpath.relpath('.',posixpath.dirname(page) or '.')
    def configure(match):
        configuration=json.loads(match.group(2))
        configuration['basePath']=base
        configuration['page']['title']=title
        configuration['file']['path']=source
        configuration['config']['links']['sidebar']={'返回梦空间':'/'}
        return match.group(1)+json.dumps(configuration,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+match.group(3)
    return CONFIG.sub(configure,template),has_existing


def navigation_links(doc, page, ordered, inherit):
    # Chapter order and physical content paths are independent of the notes URL prefix.
    prev_nodes=doc.xpath('//a[contains(concat(" ",@class," ")," navigation-prev ")] | //link[@rel="prev"]')
    next_nodes=doc.xpath('//a[contains(concat(" ",@class," ")," navigation-next ")] | //link[@rel="next"]')
    if page not in ordered and inherit:
        return
    for node in [*prev_nodes,*next_nodes]:
        node.drop_tree()
    body=doc.xpath('//div[@class="book-body"]')[0]
    head=doc.find('head')
    index=list(ordered).index(page)
    order=list(ordered)
    choices=[]
    if index:
        choices.append(('prev',order[index-1]))
    if index<len(order)-1:
        choices.append(('next',order[index+1]))
    for direction,dest in choices:
        href=link_from(page,dest)
        label=('Previous page: ' if direction=='prev' else 'Next page: ')+ordered[dest]['title']
        relation=html.Element('link',rel=direction,href=href)
        head.append(relation)
        anchor=html.Element('a',href=href,attrib={'class':f'navigation navigation-{direction}','aria-label':label})
        anchor.append(html.Element('i',attrib={'class':f'fa fa-angle-{"left" if direction=="prev" else "right"}'}))
        body.append(anchor)


def repair_local_links(doc, route, destinations):
    for element in doc.xpath('//*[@href or @src]'):
        attribute = 'href' if 'href' in element.attrib else 'src'
        address = element.get(attribute)
        decoded = unquote(address)
        if decoded.startswith('“https:/') and decoded.endswith('”'):
            element.set(attribute, re.sub(r'^https:/+', 'https://', decoded[1:-1]))
            continue
        parsed = urlsplit(address)
        if parsed.scheme or parsed.netloc or not parsed.path or parsed.path.startswith('/'):
            continue
        target = posixpath.normpath(posixpath.join(posixpath.dirname(route), unquote(parsed.path)))
        normalized = destinations.get(target.casefold())
        if normalized is not None and normalized != target:
            element.set(attribute, parsed._replace(path=link_from(route, normalized)).geturl())


def render_page(route, metadata, tree, ordered, destinations):
    source=metadata['source']
    title=ordered.get(route,metadata)['title']
    markdown=(ROOT/source).read_text()
    pristine=metadata.get('source_sha256') == sha256(markdown.encode()).hexdigest()
    markup=metadata['original'] if pristine else with_headings(MARKDOWN.render(markdown),metadata)+metadata.get('footer','')
    template,existing=load_template(route,metadata,title,source)
    doc=html.document_fromstring(template.replace(BODY,markup))
    if not existing:
        for element in doc.xpath('//head//link[@href] | //script[@src]'):
            attribute='href' if element.tag=='link' else 'src'
            href=element.get(attribute)
            parsed=urlsplit(href)
            if parsed.path.startswith('gitbook/'):
                element.set(attribute, parsed._replace(path=link_from(route,parsed.path)).geturl())
    old_nav=doc.xpath('//ul[@class="summary"]')[0]
    old_nav.getparent().replace(old_nav,html.fragment_fromstring(render_nav(tree,route)))
    doc.find('.//title').text=f'{title} · Zengmenglu Zone'
    anchors=doc.xpath('//div[contains(concat(" ",normalize-space(@class)," ")," book-header ")]//h1/a')
    for anchor in anchors:
        anchor.text=title
        anchor.set('href',link_from(route,'index.html'))
    navigation_links(doc,route,ordered,existing)
    section=doc.xpath('//section[contains(concat(" ",normalize-space(@class)," ")," markdown-section ")]')[0]
    for nav in section.xpath('.//*[@id="anchor-navigation-ex-navbar" or @id="anchorNavigationExGoTop"] | .//footer'):
        nav.drop_tree()
    body=metadata.get('old_body') if pristine else escape(' '.join(section.text_content().split()),quote=False)
    # Re-parse only for the serialized page after reading the search text; preserve the original rendered footer.
    saved_doc=html.document_fromstring(template.replace(BODY,markup))
    original_section=saved_doc.xpath('//section[contains(concat(" ",normalize-space(@class)," ")," markdown-section ")]')[0]
    section.getparent().replace(section,original_section)
    repair_local_links(doc,route,destinations)
    return html.tostring(doc,encoding='unicode',doctype='<!DOCTYPE html>'), title, body or ''


def main():
    parser=ArgumentParser(description=__doc__)
    parser.add_argument('output',type=Path,help='GitBook site output directory, such as dist/gitbook')
    dest=parser.parse_args().output
    legacy=json.loads((ROOT/'legacy.json').read_text())
    old_index=json.loads((ROOT/'old-index.json').read_text())
    tree,ordered=read_summary(legacy)
    if 'index.html' not in ordered:
        raise ValueError('SUMMARY.md needs a link to content/README.md')
    pages={**legacy,**{page:entry for page,entry in ordered.items() if page not in legacy}}
    paths=set(pages)|{file.relative_to(ROOT/'static').as_posix() for file in (ROOT/'static').rglob('*') if file.is_file()}
    destinations={path.casefold():path for path in paths}
    indexed_by_path={key.casefold():value for key,value in old_index.items()}
    shutil.copytree(ROOT/'static',dest,dirs_exist_ok=True)
    search_index={}
    for page,metadata in pages.items():
        old_key='./' if page=='index.html' else page
        original_entry=indexed_by_path.get(old_key.casefold(),{})
        metadata['old_body']=original_entry.get('body')
        output,title,body=render_page(page,metadata,tree,ordered,destinations)
        file=dest/page
        file.parent.mkdir(parents=True,exist_ok=True)
        file.write_text(output)
        if page in ordered:
            search_index[old_key]={
                'url':old_key,'title':title,'keywords':original_entry.get('keywords',''),'body':body,
            }
    (dest/'search_plus_index.json').write_text(json.dumps(search_index,ensure_ascii=False,separators=(',',':'))+'\n')
    print(f'{len(pages)} GitBook pages, {len(search_index)} search entries → {dest}')


if __name__=='__main__':
    main()
