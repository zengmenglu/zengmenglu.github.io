# 梦空间

首页、飞机与火车绘本书柜、阅读页和笔记由这个仓库统一发布。

- 绘本书目和素材在 `dream-space/library.json` 与 `dream-space/assets/`。
- 笔记原稿在 `dream-space/notes/content/`。修改已有笔记只需编辑对应 Markdown。新增文章时，在 `dream-space/notes/SUMMARY.md` 加入目录项。
- GitHub Pages 工作流使用 `dream-space/build.py` 生成 `dist/` 与搜索索引。根目录的站点快照提供从分支发布时的初始站点。

本地预览：

```sh
python3 -m venv .venv
.venv/bin/pip install -r dream-space/notes/requirements.txt
.venv/bin/python dream-space/build.py
.venv/bin/python -m http.server 8000 --bind 127.0.0.1 --directory dist
```
