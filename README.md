# 极简中文个人博客（Hugo）

纯中文、极简风格的个人博客，参考 yihui.org 的排版气质：白底、宋体、大量留白。
博客自己看为主，写日常思考、读书笔记和生活片段。

> 想用手机自己发文字/照片/视频？请看 [docs/手机更新指南.md](docs/手机更新指南.md)。

## 目录结构

```
project1/
├── hugo.toml                  # 站点配置（名称、域名、导航）
├── content/
│   ├── _index.md              # 首页（模板自动列最近文章）
│   ├── about.md               # 关于页（占位，自行替换）
│   ├── posts/                 # 文章目录，如 posts/xxx.md
│   │   └── ...                # 示例文章
│   └── search/
│       └── _index.md          # 搜索页容器
├── archetypes/                # hugo new 命令的文章模板
├── themes/minimal/            # 本项目自带的极简主题
│   ├── layouts/               # 页面模板
│   └── static/                # CSS / 搜索脚本 / fuse.js
└── .github/workflows/deploy.yml  # GitHub Pages 自动部署
```

## 本地预览

1. 安装 [Hugo Extended](https://gohugo.io/installation/)。Windows 推荐：

   ```powershell
   winget install Hugo.Hugo.Extended
   ```

2. 在项目目录里启动预览（`-D` 表示草稿也显示）：

   ```powershell
   hugo server -D
   ```

3. 浏览器打开 <http://localhost:1313/>。

## 写新文章

```powershell
hugo new posts/我的文章.md
```

然后编辑 `content/posts/我的文章.md`：填标题、日期、分类，把正文写在两个 `---` 下面。
把 `draft: true` 改成 `draft: false` 才会出现在正式构建里。

可选的分类示例：技术折腾、读书笔记、生活片段、产品思考。也可以随意新增，分类页会自动生成。

## 首次部署到 GitHub Pages

目的：把代码推到 GitHub 后，GitHub Actions 自动构建并发布，以后每次 `git push` 就是一次发布。

1. 先在 GitHub 上新建一个仓库（空仓库即可，不要勾选 README）。

2. 在项目目录执行（把 `你的用户名` 和 `你的仓库名` 换成真实的）：

   ```powershell
   git init
   git add .
   git commit -m "初始化博客"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. 打开仓库 Settings → Pages：
   - Source 选择 **GitHub Actions**。
   - 如果系统提示需要打开 Actions 权限，跟着提示确认。

4. 等待几分钟，第一次推送后 Actions 会自动跑完。页面地址：

   - 仓库叫 `你的用户名.github.io` 时：`https://你的用户名.github.io/`
   - 其他仓库名时：`https://你的用户名.github.io/你的仓库名/`

部署脚本会自动识别以上两种情况，`hugo.toml` 里的 `baseURL` 只影响本地构建，正式发布以 Actions 计算出的地址为准。

## 换名字和域名

- 博客名：改 `hugo.toml` 里的 `title`；
- 头像：直接覆盖 `themes/minimal/static/img/avatar.jpg` 这张小图即可；不想要头像就把 `hugo.toml` 里的 `avatar` 那一行删掉；
- 关于页：改 `content/about.md`；
- 自定义域名：仓库 Settings → Pages → Custom domain 填你的域名，再把 `hugo.toml` 里的 `baseURL` 同步改成 `https://你的域名/`。

## 常见问题

- 搜不到内容：先确认浏览器打开的是 `/search/`，并且页面提示“正在加载搜索索引…”后消失。搜索索引 `index.json` 会在每次 `hugo` 构建时自动重新生成。
- 分类页是空的：文章 front matter 里写了 `categories:` 就会自动出现。
- 想要更多文章模板格式：参考 `content/posts/` 里的示例文章。

## 主题风格修改

所有视觉样式都在 `themes/minimal/static/css/main.css`，开头用注释标出了配色变量，改颜色、字号、行距都很直观。
