/*
 * 手机内容管理：新建 / 编辑 / 删除 Hugo 文章（GitHub API + Actions 自动部署）
 */
(function () {
  'use strict';

  const USER = 'zhangyiyi1222';
  const REPO = 'vc-blog';
  const BRANCH = 'main';
  const TOKEN_KEY = 'zzw-editor-token';

  const tokenEl = document.getElementById('token');
  const tokenBox = document.getElementById('tokenBox');
  const tokenBtn = document.getElementById('tokenBtn');
  const titleEl = document.getElementById('title');
  const dateEl = document.getElementById('date');
  const categoryEl = document.getElementById('category');
  const newCategoryEl = document.getElementById('newCategory');
  const bodyEl = document.getElementById('body');
  const filesEl = document.getElementById('files');
  const fileListEl = document.getElementById('fileList');
  const publishBtn = document.getElementById('publish');
  const cancelBtn = document.getElementById('cancelEdit');
  const statusEl = document.getElementById('status');
  const manageToggle = document.getElementById('manageToggle');
  const managePanel = document.getElementById('managePanel');
  const postListEl = document.getElementById('postList');
  const status2El = document.getElementById('status2');

  let editing = null; // { path, sha, folder }
  let tree = [];

  try { const s = localStorage.getItem(TOKEN_KEY); if (s) tokenEl.value = s; } catch (e) {}
  dateEl.value = new Date().toISOString().slice(0, 10);

  function syncTokenUI() {
    tokenBox.hidden = !!tokenEl.value.trim();
    tokenBtn.hidden = !tokenEl.value.trim();
  }
  syncTokenUI();
  if (tokenEl.value.trim()) { managePanel.hidden = false; loadPosts(true); }
  tokenEl.addEventListener('change', function () {
    try { localStorage.setItem(TOKEN_KEY, tokenEl.value.trim()); } catch (e) {}
    syncTokenUI();
    if (tokenEl.value.trim()) { managePanel.hidden = false; loadPosts(false); }
  });
  tokenBtn.addEventListener('click', function () {
    tokenBox.hidden = !tokenBox.hidden;
  });

  function setStatus(text, type, el) {
    const target = el || statusEl;
    target.textContent = text;
    target.className = 'status' + (type ? ' ' + type : '');
  }
  function token() { return tokenEl.value.trim(); }

  function base64Encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  }
  function base64Decode(str) {
    const clean = String(str).replace(/\s/g, '');
    const bin = atob(clean);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function encodePath(path) { return path.split('/').map(encodeURIComponent).join('/'); }
  function fileExt(name) { const m = /\.([a-zA-Z0-9]+)$/.exec(name || ''); return m ? m[1].toLowerCase() : 'bin'; }
  function safeTitle(s) { return String(s || '').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '-').slice(0, 40) || 'post'; }
  function p2(n) { return String(n).padStart(2, '0'); }
  function dateTimeString(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':00+08:00'; }

  function headers() { return { 'Authorization': 'token ' + token(), 'Accept': 'application/vnd.github+json' }; }

  function apiGet(path) {
    return fetch('https://api.github.com/repos/' + USER + '/' + REPO + '/' + path, { headers: headers() })
      .then(function (r) { if (!r.ok) return r.json().then(function (e) { throw new Error(e.message); }); return r.json(); });
  }

  function githubPut(path, content, message, contentIsBase64, sha) {
    const body = { message: message, content: contentIsBase64 ? content : base64Encode(content), branch: BRANCH };
    if (sha) body.sha = sha;
    return fetch('https://api.github.com/repos/' + USER + '/' + REPO + '/contents/' + encodePath(path), {
      method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, headers()),
      body: JSON.stringify(body)
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw new Error(e.message || 'HTTP ' + r.status); });
      return r.json();
    });
  }

  function githubDelete(path, sha) {
    return fetch('https://api.github.com/repos/' + USER + '/' + REPO + '/contents/' + encodePath(path), {
      method: 'DELETE', headers: Object.assign({ 'Content-Type': 'application/json' }, headers()),
      body: JSON.stringify({ message: '删除：' + path, branch: BRANCH, sha: sha })
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (e) { throw new Error(e.message); });
      return r.json();
    });
  }

  function readAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = function () { reject(new Error('读文件失败')); };
      r.readAsDataURL(file);
    });
  }

  function parseFrontMatter(raw) {
    const lines = raw.replace(/\r\n/g, '\n').split('\n');
    let i = 0;
    if (lines[0].trim() === '---') i = 1;
    let title = '', date = '', category = '';
    let bodyStart = 0;
    for (; i < lines.length; i++) {
      if (lines[i].trim() === '---') { bodyStart = i + 1; break; }
      const line = lines[i];
      const t = line.match(/^title:\s*"?(.*?)"?\s*$/);
      if (t) title = t[1];
      const d = line.match(/^date:\s*(\S+)/);
      if (d) date = d[1].slice(0, 10);
      if (/^categories:/.test(line)) { while (i + 1 < lines.length && /^\s+-\s*/.test(lines[i + 1])) { i++; category = lines[i].replace(/^\s+-\s*/, '').trim(); } }
    }
    const body = lines.slice(bodyStart).join('\n').trim();
    return { title: title, date: date, category: category, body: body };
  }

  function buildMarkdown(title, date, category, body, mediaLines) {
    return '---\n' +
      'title: "' + title.replace(/"/g, '“') + '"\n' +
      'date: ' + dateTimeString(new Date(date + 'T12:00:00+08:00')) + '\n' +
      (category ? 'categories:\n' + '  - ' + category + '\n' : '') +
      'draft: false\n' +
      '---\n\n' + body + '\n' +
      (mediaLines.length ? '\n' + mediaLines.join('\n\n') + '\n' : '');
  }

  function resetForm() {
    titleEl.value = ''; bodyEl.value = ''; filesEl.value = ''; fileListEl.textContent = '';
    dateEl.value = new Date().toISOString().slice(0, 10);
    editing = null;
    publishBtn.textContent = '发布';
    cancelBtn.hidden = true;
  }

  // ---------- 上传新文章 ----------
  publishBtn.addEventListener('click', async function () {
    const t = token();
    const title = titleEl.value.trim();
    const category = newCategoryEl.value.trim() || categoryEl.value.trim();
    const body = bodyEl.value.trim();
    const date = dateEl.value;
    if (!t) { setStatus('请先填写 GitHub 令牌'); return; }
    if (!title) { setStatus('请填写标题', 'err'); return; }
    if (!body) { setStatus('正文还没有内容', 'err'); return; }
    try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}

    if (editing && editing.mode === 'about') {
      publishBtn.disabled = true;
      try {
        const md = buildMarkdown(title, date, '', body, []);
        await githubPut(editing.path, md, '修改关于页', false, editing.sha);
        setStatus('关于页已保存', 'ok');
        loadPosts(true);
        resetForm();
      } catch (err) { setStatus('保存失败：' + err.message, 'err'); }
      finally { publishBtn.disabled = false; }
      return;
    }
    if (editing && editing.mode === 'sitejson') {
      publishBtn.disabled = true;
      try {
        JSON.parse(body); // 简单校验
        await githubPut(editing.path, body, '修改首页文案', false, editing.sha);
        setStatus('首页文案已保存', 'ok');
        loadPosts(true);
        resetForm();
      } catch (err) { setStatus('保存失败：' + err.message, 'err'); }
      finally { publishBtn.disabled = false; }
      return;
    }
    const folder = editing ? editing.folder : 'content/posts/' + date + '-' + safeTitle(title);
    const message = (editing ? '修改：' : '发布：') + title;
    const files = Array.prototype.slice.call(filesEl.files);
    const mediaLines = [];
    publishBtn.disabled = true;

    try {
      let finalBody = body;
      const tailMedia = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.size > 25 * 1024 * 1024) throw new Error(f.name + ' 超过 25MB');
        setStatus('上传 ' + (i + 1) + '/' + files.length + '…');
        const data = await readAsDataURL(f);
        const name = 'media-' + Date.now() + '-' + (i + 1) + '.' + fileExt(f.name);
        await githubPut(folder + '/' + name, data.split(',')[1], message, true);
        const line = f.type.indexOf('video') === 0
          ? '{{< video src="' + name + '" >}}'
          : '![' + title + '](' + name + ')';
        const token = '[[IMG-' + (i + 1) + ']]';
        if (finalBody.indexOf(token) >= 0) {
          finalBody = finalBody.replace(token, line);
        } else {
          tailMedia.push(line);
        }
      }
      setStatus('写入文章…');
      const finalText = finalBody + (tailMedia.length ? '\n\n' + tailMedia.join('\n\n') + '\n' : '');
      const md = buildMarkdown(title, date, category, finalText, []);
      await githubPut(folder + '/index.md', md, message, false, editing && editing.sha);
      setStatus('成功！约 1 分钟后更新。', 'ok');
      if (editing) loadPosts(true);
      resetForm();
    } catch (err) {
      setStatus('失败：' + err.message, 'err');
    } finally { publishBtn.disabled = false; }
  });

  cancelBtn.addEventListener('click', function () { resetForm(); setStatus('已取消编辑'); });

  // ---------- 管理列表 ----------
  manageToggle.addEventListener('click', function () {
    managePanel.hidden = !managePanel.hidden;
    if (!managePanel.hidden) loadPosts();
  });
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', function () { loadPosts(false); });

  function postPathToUrl(p) {
    if (p.endsWith('/index.md')) {
      const folder = p.slice('content/posts/'.length, -'/index.md'.length);
      return '/posts/' + encodeURIComponent(folder) + '/';
    }
    const base = p.slice('content/posts/'.length, -'.md'.length);
    return '/posts/' + encodeURIComponent(base) + '/';
  }

  function isPostBlob(p) {
    if (!p.startsWith('content/posts/') || p === 'content/posts/_index.md') return false;
    if (p.endsWith('/index.md')) return true;
    if (/^content\/posts\/[^/]+\.md$/.test(p)) return true;
    return false;
  }

  async function loadPosts(quiet) {
    if (!token()) { setStatus2('请先填 GitHub 令牌再管理', 'err'); return; }
    if (!quiet) setStatus2('加载中…');
    try {
      tree = (await apiGet('git/trees/main?recursive=1')).tree || [];
      const blobs = tree.filter(function (b) { return b.type === 'blob' && isPostBlob(b.path); });
      blobs.sort(function (a, b) { return b.path.localeCompare(a.path); });
      postListEl.innerHTML = '';
      const aboutBlob = tree.find(function (b) { return b.type === 'blob' && b.path === 'content/about.md'; });
      if (aboutBlob) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = '关于页面';
        a.href = 'https://zhangzhongwei.top/about/';
        a.target = '_blank';
        li.appendChild(a);
        const edit = document.createElement('button');
        edit.textContent = '编辑';
        edit.addEventListener('click', function () { startEdit(aboutBlob); });
        li.appendChild(edit);
        postListEl.appendChild(li);
      }
      const siteBlob = tree.find(function (b) { return b.type === 'blob' && b.path === 'data/site.json'; });
      if (siteBlob) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = '首页问候与小字';
        a.href = 'https://zhangzhongwei.top/';
        a.target = '_blank';
        li.appendChild(a);
        const edit = document.createElement('button');
        edit.textContent = '编辑';
        edit.addEventListener('click', function () { startEdit(siteBlob); });
        li.appendChild(edit);
        postListEl.appendChild(li);
      }
      if (!blobs.length) { return; }
      blobs.forEach(function (b) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = b.path.split('/').pop() === 'index.md'
          ? b.path.slice('content/posts/'.length, -'/index.md'.length)
          : b.path.slice('content/posts/'.length, -'.md'.length);
        a.href = 'https://zhangzhongwei.top' + postPathToUrl(b.path);
        a.target = '_blank';
        li.appendChild(a);
        const edit = document.createElement('button');
        edit.textContent = '编辑';
        edit.addEventListener('click', function () { startEdit(b); });
        const del = document.createElement('button');
        del.textContent = '删除';
        del.style.borderColor = '#d9a0a0';
        del.addEventListener('click', function () { removePost(b); });
        li.appendChild(edit);
        li.appendChild(del);
        postListEl.appendChild(li);
      });
      setStatus2('共 ' + blobs.length + ' 篇');
    } catch (err) { setStatus2('加载失败：' + err.message, 'err'); }
  }

  async function startEdit(blob) {
    setStatus2('读取文章…');
    try {
      const data = await apiGet('contents/' + encodePath(blob.path));
      const raw = base64Decode(data.content);
      if (blob.path === 'data/site.json') {
        titleEl.value = '首页问候与小字';
        bodyEl.value = raw.trim();
        editing = { path: blob.path, sha: data.sha, mode: 'sitejson' };
        publishBtn.textContent = '保存修改';
        cancelBtn.hidden = false;
        setStatus('正在编辑首页文案，只改双引号里的字');
        return;
      }
      const fm = parseFrontMatter(raw);
      titleEl.value = fm.title;
      dateEl.value = fm.date;
      if (fm.category) {
        if (!Array.prototype.some.call(categoryEl.options, function (o) { return o.value === fm.category; })) {
          const o = document.createElement('option'); o.value = fm.category; o.textContent = fm.category; categoryEl.appendChild(o);
        }
        categoryEl.value = fm.category;
      }
      bodyEl.value = fm.body;
      editing = { path: blob.path, sha: data.sha, mode: blob.path === 'content/about.md' ? 'about' : 'post', folder: blob.path.slice(0, -'/index.md'.length) };
      publishBtn.textContent = '保存修改';
      cancelBtn.hidden = false;
      managePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setStatus('正在编辑：' + blob.path);
    } catch (err) { setStatus('读取失败：' + err.message, 'err'); }
  }

  async function removePost(blob) {
    if (!confirm('确定删除这篇吗？连同里面的图片/视频会一起删除，且不可恢复。')) return;
    setStatus2('删除中…');
    try {
      const prefix = blob.path.endsWith('/index.md') ? blob.path.slice(0, -'/index.md'.length) : '';
      const items = prefix
        ? tree.filter(function (b) { return b.type === 'blob' && b.path.indexOf(prefix + '/') === 0; })
        : [blob];
      for (let i = items.length - 1; i >= 0; i--) {
        await githubDelete(items[i].path, items[i].sha);
      }
      setStatus2('已删除');
      loadPosts(true);
    } catch (err) { setStatus2('删除失败：' + err.message, 'err'); }
  }

  filesEl.addEventListener('change', function () {
  const files = Array.prototype.slice.call(filesEl.files);
  fileListEl.textContent = files.length
    ? files.map(function (f) { return f.name + '（' + Math.round(f.size / 1024) + ' KB）'; }).join('；')
    : '';
  });

  const noteBtn = document.getElementById('noteBtn');
  if (noteBtn) noteBtn.addEventListener('click', function () {
    bodyEl.value += (bodyEl.value ? '\n\n' : '') + '{{< note >}}在这里写小字注释{{< /note >}}' + '\n';
    bodyEl.focus();
  });

  const mediaBtn = document.getElementById('mediaBtn');
  if (mediaBtn) mediaBtn.addEventListener('click', function () {
    const n = filesEl.files.length;
    if (!n) { setStatus('请先选择图片/视频再点插入', 'err'); return; }
    const tokens = [];
    for (let i = 1; i <= n; i++) tokens.push('[[IMG-' + i + ']]');
    const insert = (bodyEl.value ? '\n\n' : '') + tokens.join('\n\n') + '\n';
    const pos = bodyEl.selectionStart == null ? bodyEl.value.length : bodyEl.selectionStart;
    bodyEl.value = bodyEl.value.slice(0, pos) + insert + bodyEl.value.slice(bodyEl.selectionEnd == null ? pos : bodyEl.selectionEnd);
    bodyEl.focus();
    setStatus('已插入占位符：图片会出现在这里');
  });
})();
