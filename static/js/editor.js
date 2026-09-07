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
  let selectedFiles = [];
  let placedMedia = 0;
  let homeConfig = { photos: [] };
  let homeConfigSha = null;

  try { const s = localStorage.getItem(TOKEN_KEY); if (s) tokenEl.value = s; } catch (e) {}
  dateEl.value = new Date().toISOString().slice(0, 10);

  function syncTokenUI() {
    tokenBox.hidden = !!tokenEl.value.trim();
    tokenBtn.hidden = !tokenEl.value.trim();
  }
  syncTokenUI();
  if (tokenEl.value.trim()) { managePanel.hidden = true; }
  tokenEl.addEventListener('change', function () {
    try { localStorage.setItem(TOKEN_KEY, tokenEl.value.trim()); } catch (e) {}
    syncTokenUI();
    if (tokenEl.value.trim()) setWriteVisible(false);
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
    titleEl.value = ''; bodyEl.value = ''; filesEl.value = ''; fileListEl.textContent = ''; selectedFiles = []; placedMedia = 0;
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
    const files = selectedFiles.slice();
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
      if (/\[\[IMG-\d+\]\]/.test(finalBody)) throw new Error('还有未对应文件的图片占位符，请补选图片或删除 [[IMG-x]]');
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
    for (let i = 0; i < filesEl.files.length; i++) {
      selectedFiles.push(filesEl.files[i]);
    }
    filesEl.value = '';
    renderFiles();
  });

  function renderFiles() {
    fileListEl.innerHTML = '';
    selectedFiles.forEach(function (f, idx) {
      const s = document.createElement('span');
      s.style.display = 'inline-block';
      s.style.marginRight = '8px';
      s.textContent = (idx + 1) + '. ' + f.name + '（' + Math.round(f.size / 1024) + ' KB）';
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.textContent = '移除';
      rm.style.fontSize = '.75rem';
      rm.addEventListener('click', function () { selectedFiles.splice(idx, 1); if (placedMedia > selectedFiles.length) placedMedia = selectedFiles.length; renderFiles(); });
      s.appendChild(rm);
      fileListEl.appendChild(s);
    });
  }

  function insertAtCursor(text) {
    const pos = bodyEl.selectionStart == null ? bodyEl.value.length : bodyEl.selectionStart;
    const end = bodyEl.selectionEnd == null ? pos : bodyEl.selectionEnd;
    const before = bodyEl.value.slice(0, pos);
    const after = bodyEl.value.slice(end);
    const lead = before && !before.endsWith('\n') ? '\n\n' : '\n';
    const trail = after && !after.startsWith('\n') ? '\n' : '';
    bodyEl.value = before + lead + text + trail + after;
    bodyEl.focus();
  }

  const noteBtn = document.getElementById('noteBtn');
  if (noteBtn) noteBtn.addEventListener('click', function () {
    insertAtCursor('{{< note >}}在这里写小字注释{{< /note >}}');
  });
  const quoteBtn = document.getElementById('quoteBtn');
  if (quoteBtn) quoteBtn.addEventListener('click', function () {
    insertAtCursor('> 在这里写一句心里话');
  });

  const mediaBtn = document.getElementById('mediaBtn');
  if (mediaBtn) mediaBtn.addEventListener('click', function () {
    if (placedMedia >= selectedFiles.length) { setStatus('没有待插入的文件：先选图片/视频，再点这里', 'err'); return; }
    insertAtCursor('[[IMG-' + (placedMedia + 1) + ']]');
    placedMedia++;
    setStatus('已插入第 ' + placedMedia + ' 个图片占位符');
  });
  const photoPanel = document.getElementById('photoPanel');
  const photoInput = document.getElementById('photoInput');
  const photoGrid = document.getElementById('photoGrid');
  const photoUploadBtn = document.getElementById('photoUpload');
  async function loadHomePhotos() {
    if (!token()) { setStatus('请先填写令牌', 'err'); return; }
    tree = (await apiGet('git/trees/main?recursive=1')).tree || [];
    const cfg = await apiGet('contents/data/home.json');
    const conf = JSON.parse(base64Decode(cfg.content));
    homeConfig = conf; homeConfigSha = cfg.sha;
    photoGrid.innerHTML = '';
    conf.photos.forEach(function (name) {
      const wrap = document.createElement('div');
      const img = document.createElement('img');
      img.src = 'https://raw.githubusercontent.com/' + USER + '/' + REPO + '/main/static/img/home/' + encodeURIComponent(name);
      img.style.cssText = 'width:86px;height:64px;object-fit:cover;display:block;border:1px solid #eee;';
      const rm = document.createElement('button');
      rm.textContent = '移除';
      rm.style.fontSize = '.75rem';
      rm.addEventListener('click', function () { deleteHomePhoto(name); });
      wrap.appendChild(img); wrap.appendChild(rm); photoGrid.appendChild(wrap);
    });
    setStatus('首页相片共 ' + conf.photos.length + ' 张');
  }
  async function saveHomeConfig() {
    await githubPut('data/home.json', JSON.stringify(homeConfig, null, 2), '更新首页相片', false, homeConfigSha);
    const fresh = await apiGet('contents/data/home.json'); homeConfigSha = fresh.sha;
  }
  async function deleteHomePhoto(name) {
    if (!confirm('从首页移除这张相片？（原文件也删除）')) return;
    const blob = tree.find(function (b) { return b.type === 'blob' && b.path === 'static/img/home/' + name; });
    if (blob) await githubDelete(blob.path, blob.sha);
    homeConfig.photos = homeConfig.photos.filter(function (n) { return n !== name; });
    await saveHomeConfig(); await loadHomePhotos();
  }
  if (photoUploadBtn) photoUploadBtn.addEventListener('click', async function () {
    if (!token()) { setStatus('请先填写令牌', 'err'); return; }
    photoUploadBtn.disabled = true;
    try {
      for (let i = 0; i < photoInput.files.length; i++) {
        const f = photoInput.files[i];
        const data = await readAsDataURL(f);
        const name = 'home-' + Date.now() + '-' + (i + 1) + '.' + fileExt(f.name);
        await githubPut('static/img/home/' + name, data.split(',')[1], '上传首页相片', true);
        homeConfig.photos.push(name);
      }
      await saveHomeConfig(); photoInput.value = ''; await loadHomePhotos();
    } catch (err) { setStatus('相片上传失败：' + err.message, 'err'); }
    finally { photoUploadBtn.disabled = false; }
  });
  const moduleHint = document.getElementById('moduleHint');
  const writeControls = document.querySelectorAll('.field, #publish, #cancelEdit');
  function setWriteVisible(on) {
    writeControls.forEach(function (el) { el.style.display = on ? '' : 'none'; });
    tokenBox.style.display = (on || !tokenEl.value.trim()) ? '' : 'none';
  }
  function pickBlob(path) { return tree.find(function (b) { return b.type === 'blob' && b.path === path; }); }
  document.querySelectorAll('#moduleNav button').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const m = btn.dataset.module;
      managePanel.hidden = true;
      photoPanel.hidden = true;
      if (m === 'write') { setWriteVisible(true); moduleHint.textContent = '填写并发布新日志，图片可插在文字中间。'; return; }
      if (!token()) { setWriteVisible(true); moduleHint.textContent = '请先填写并保存令牌'; return; }
      if (m === 'logs') { setWriteVisible(false); managePanel.hidden = false; await loadPosts(true); moduleHint.textContent = '日志：点编辑改旧文章，点删除整篇删除。'; return; }
      if (m === 'category') { setWriteVisible(false); moduleHint.textContent = '写一篇或编辑文章时，在“或输入新分类”里填新名字即可添加分类；分类页会自动生成。'; return; }
      if (m === 'photos') { setWriteVisible(false); managePanel.hidden = true; photoPanel.hidden = false; moduleHint.textContent = '相片：选择相片后点“上传到首页”，点“移除”可删。'; await loadHomePhotos(); return; }
      if (m === 'about' || m === 'home') {
        await loadPosts(true);
        const target = m === 'about' ? pickBlob('content/about.md') : pickBlob('data/site.json');
        if (target) { setWriteVisible(true); await startEdit(target); moduleHint.textContent = m === 'about' ? '正在编辑关于页，改完点保存修改。' : '正在编辑首页大字/小字/页脚。'; }
        return;
      }
    });
  });
  if (tokenEl.value.trim()) { setWriteVisible(false); managePanel.hidden = true; moduleHint.textContent = '选择要管理的栏目：日志、关于、首页、相片、门类。'; }
})();
