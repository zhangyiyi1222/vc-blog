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
  const managePanel = document.getElementById('managePanel');
  const postListEl = document.getElementById('postList');
  const status2El = document.getElementById('status2');
  const confirmBox = document.getElementById('confirmBox');
  const confirmMsg = document.getElementById('confirmMsg');
  const confirmOkBtn = document.getElementById('confirmOk');
  const confirmCancelBtn = document.getElementById('confirmCancel');

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
    tokenBtn.hidden = true;
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
  function setStatus2(text, type) { setStatus(text, type, status2El); }

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
    if (editing && editing.single && selectedFiles.length) { setStatus('这篇旧格式单文件不能加图：请先删除旧文，再新建一篇发图', 'err'); return; }
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
      const mdPath = editing ? (editing.mdPath || folder + '/index.md') : folder + '/index.md';
      await githubPut(mdPath, md, message, false, editing && editing.sha);
      setStatus('成功！约 1 分钟后更新。', 'ok');
      if (editing) loadPosts(true);
      resetForm();
    } catch (err) {
      setStatus('失败：' + err.message, 'err');
    } finally { publishBtn.disabled = false; }
  });

  cancelBtn.addEventListener('click', function () { resetForm(); setStatus('已取消编辑'); });

  // ---------- 管理列表 ----------

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
    if (!token()) { postListEl.innerHTML = '<li style="color:#b3261e;">未检测到令牌：请到“关于”页底部保存令牌后再点日志</li>'; return; }
    if (!quiet) setStatus2('加载中…');
    try {
      tree = (await apiGet('git/trees/main?recursive=1')).tree || [];
      const blobs = tree.filter(function (b) { return b.type === 'blob' && isPostBlob(b.path); });
      postListEl.innerHTML = '';
      if (!blobs.length) { setStatus2('还没有文章'); return; }
      const meta = await fetchPostMeta();
      const rows = blobs.map(function (b) {
        const m = meta ? meta.get(b.path) : null;
        const fallback = b.path.split('/').pop() === 'index.md'
          ? b.path.slice('content/posts/'.length, -'/index.md'.length)
          : b.path.slice('content/posts/'.length, -'.md'.length);
        return { b: b, date: m && m.date ? m.date : '', title: m && m.title ? m.title : fallback };
      });
      rows.sort(function (x, y) {
        if (!x.date && !y.date) return y.b.path.localeCompare(x.b.path);
        if (!x.date) return 1;
        if (!y.date) return -1;
        return y.date.localeCompare(x.date);
      });
      rows.forEach(function (row) {
        const li = document.createElement('li');
        const top = document.createElement('div');
        top.className = 'p-row';
        const dt = document.createElement('span');
        dt.className = 'p-date';
        dt.textContent = row.date || '日期待补';
        const btns = document.createElement('span');
        btns.className = 'p-btns';
        const edit = document.createElement('button');
        edit.textContent = '编辑';
        edit.addEventListener('click', function () { startEdit(row.b); });
        const del = document.createElement('button');
        del.textContent = '删除';
        del.style.borderColor = '#d9a0a0';
        del.addEventListener('click', function () { removePost(row.b); });
        btns.appendChild(edit);
        btns.appendChild(del);
        top.appendChild(dt);
        top.appendChild(btns);
        const a = document.createElement('a');
        a.textContent = row.title;
        a.href = 'https://zhangzhongwei.top' + postPathToUrl(row.b.path);
        a.target = '_blank';
        li.appendChild(top);
        li.appendChild(a);
        postListEl.appendChild(li);
      });
      setStatus2(meta ? '共 ' + rows.length + ' 篇，按日期从新到旧' : '共 ' + rows.length + ' 篇（索引未取到，按名称排）');
    } catch (err) { setStatus2('加载失败：' + err.message, 'err'); }
  }

  async function fetchPostMeta() {
    try {
      const res = await fetch('./index.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const arr = await res.json();
      const meta = new Map();
      if (Array.isArray(arr)) {
        arr.forEach(function (e) {
          var p = String(e.path || '');
          if (!p) return;
          if (p.indexOf('content/') !== 0) p = 'content/' + p;
          meta.set(p, { date: String(e.date || '').slice(0, 10), title: String(e.title || '') });
        });
      }
      return meta;
    } catch (err) { return null; }
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
      const isSingle = !blob.path.endsWith('/index.md');
      editing = {
        path: blob.path, sha: data.sha, mode: blob.path === 'content/about.md' ? 'about' : 'post',
        single: isSingle,
        mdPath: isSingle ? blob.path : blob.path.slice(0, -'/index.md'.length) + '/index.md',
        folder: isSingle ? blob.path.slice(0, -'.md'.length) : blob.path.slice(0, -'/index.md'.length)
      };
      publishBtn.textContent = '保存修改';
      cancelBtn.hidden = false;
      setWriteVisible(true);
      managePanel.hidden = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStatus('正在编辑：' + blob.path);
    } catch (err) { setStatus2('读取失败：' + err.message, 'err'); }

  }

  function askConfirm(message) {
    return new Promise(function (resolve) {
      confirmMsg.textContent = message;
      confirmBox.hidden = false;
      function done(ok) {
        confirmBox.hidden = true;
        confirmOkBtn.removeEventListener('click', onOk);
        confirmCancelBtn.removeEventListener('click', onCancel);
        resolve(ok);
      }
      function onOk() { done(true); }
      function onCancel() { done(false); }
      confirmOkBtn.addEventListener('click', onOk);
      confirmCancelBtn.addEventListener('click', onCancel);
    });
  }

  async function removePost(blob) {
    if (!(await askConfirm('确定删除这篇吗？连同里面的图片/视频会一起删除，且不可恢复。'))) return;
    setStatus2('准备删除…');
    try {
      const prefix = blob.path.endsWith('/index.md') ? blob.path.slice(0, -'/index.md'.length) : '';
      const items = prefix
        ? tree.filter(function (b) { return b.type === 'blob' && b.path.indexOf(prefix + '/') === 0; })
        : [blob];
      for (let i = items.length - 1; i >= 0; i--) {
        setStatus2('正在删除 ' + (items.length - i) + '/' + items.length + '…');
        await githubDelete(items[i].path, items[i].sha);
      }
      setStatus2('已删除，稍等约 1 分钟生效', 'ok');
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
  const moduleHint = document.getElementById('moduleHint');
  const aboutPanel = document.getElementById('aboutPanel');
  const aboutBody = document.getElementById('aboutBody');
  const saveAboutBtn = document.getElementById('saveAboutBtn');
  const aboutToken = document.getElementById('aboutToken');
  const saveAboutTokenBtn = document.getElementById('saveAboutToken');
  let aboutHeader = ''; let aboutSha = null;
  async function loadAbout() {
    aboutToken.value = token();
    if (!token()) { aboutBody.value = '请先在上方输入令牌并点“保存令牌”'; return; }
    const data = await apiGet('contents/' + encodePath('content/about.md'));
    const raw = base64Decode(data.content);
    const i = raw.indexOf('---', 4);
    aboutHeader = raw.slice(0, i + 3);
    aboutBody.value = raw.slice(i + 3).trim();
    aboutSha = data.sha;
  }
  if (saveAboutBtn) saveAboutBtn.addEventListener('click', async function () {
    if (!token()) { setStatus('请先保存令牌', 'err'); return; }
    try {
      await githubPut('content/about.md', aboutHeader + '\n\n' + aboutBody.value.trim() + '\n', '修改关于页', false, aboutSha);
      const fresh = await apiGet('contents/' + encodePath('content/about.md')); aboutSha = fresh.sha;
      setStatus('关于页已保存', 'ok');
    } catch (err) { setStatus('保存失败：' + err.message, 'err'); }
  });
  if (saveAboutTokenBtn) saveAboutTokenBtn.addEventListener('click', async function () {
    const t = aboutToken.value.trim();
    if (!t) { setStatus('令牌不能为空', 'err'); return; }
    tokenEl.value = t; try { localStorage.setItem(TOKEN_KEY, t); } catch (e) {}
    setStatus('令牌已保存');
    await loadAbout();
  });
  const homePanel = document.getElementById('homePanel');
  const homeHelloEl = document.getElementById('homeHello');
  const homeTaglineEl = document.getElementById('homeTagline');
  const homeFooterEl = document.getElementById('homeFooter');
  const saveHomeBtn = document.getElementById('saveHomeBtn');
  const photoInput = document.getElementById('photoInput');
  const photoUploadBtn = document.getElementById('photoUpload');
  const photoGrid = document.getElementById('photoGrid');
  let siteConfigSha = null;
  async function loadHomePanel() {
    if (!token()) { setStatus('请先填写令牌', 'err'); return; }
    const site = await apiGet('contents/data/site.json');
    const cfg = JSON.parse(base64Decode(site.content));
    homeHelloEl.value = cfg.hello || ''; homeTaglineEl.value = cfg.tagline || ''; homeFooterEl.value = cfg.footer || '';
    siteConfigSha = site.sha;
    const homeData = await apiGet('contents/data/home.json');
    homeConfig = JSON.parse(base64Decode(homeData.content)); homeConfigSha = homeData.sha;
    renderHomePhotos();
  }
  function renderHomePhotos() {
    photoGrid.innerHTML = '';
    (homeConfig.photos || []).forEach(function (name) {
      const wrap = document.createElement('div');
      const img = document.createElement('img');
      img.src = 'https://raw.githubusercontent.com/' + USER + '/' + REPO + '/main/static/img/home/' + encodeURIComponent(name);
      img.style.cssText = 'width:86px;height:64px;object-fit:cover;display:block;border:1px solid #eee;';
      const rm = document.createElement('button'); rm.textContent = '移除'; rm.style.fontSize = '.75rem';
      rm.addEventListener('click', function () { deleteHomePhoto(name); });
      wrap.appendChild(img); wrap.appendChild(rm); photoGrid.appendChild(wrap);
    });
  }
  async function saveSiteText() {
    const cfg = { hello: homeHelloEl.value.trim(), tagline: homeTaglineEl.value.trim(), footer: homeFooterEl.value.trim() };
    await githubPut('data/site.json', JSON.stringify(cfg, null, 2), '更新首页文字', false, siteConfigSha);
    const fresh = await apiGet('contents/data/site.json'); siteConfigSha = fresh.sha;
    setStatus('首页文字已保存', 'ok');
  }
  async function deleteHomePhoto(name) {
    if (!confirm('从首页移除这张相片？')) return;
    tree = (await apiGet('git/trees/main?recursive=1')).tree || [];
    const blob = tree.find(function (b) { return b.type === 'blob' && b.path === 'static/img/home/' + name; });
    if (blob) await githubDelete(blob.path, blob.sha);
    homeConfig.photos = homeConfig.photos.filter(function (n) { return n !== name; });
    const fresh = await apiGet('contents/data/home.json'); homeConfigSha = fresh.sha;
    await githubPut('data/home.json', JSON.stringify(homeConfig, null, 2), '更新首页相片', false, homeConfigSha);
    const after = await apiGet('contents/data/home.json'); homeConfigSha = after.sha;
    renderHomePhotos();
  }
  if (saveHomeBtn) saveHomeBtn.addEventListener('click', function () { saveSiteText(); });
  if (photoUploadBtn) photoUploadBtn.addEventListener('click', async function () {
    try {
      for (let i = 0; i < photoInput.files.length; i++) {
        const f = photoInput.files[i]; const data = await readAsDataURL(f);
        const name = 'home-' + Date.now() + '-' + (i + 1) + '.' + fileExt(f.name);
        await githubPut('static/img/home/' + name, data.split(',')[1], '上传首页相片', true);
        homeConfig.photos.push(name);
      }
      const fresh = await apiGet('contents/data/home.json'); homeConfigSha = fresh.sha;
      await githubPut('data/home.json', JSON.stringify(homeConfig, null, 2), '更新首页相片', false, homeConfigSha);
      photoInput.value = ''; renderHomePhotos();
    } catch (err) { setStatus('上传失败：' + err.message, 'err'); }
  });
  const writeControls = document.querySelectorAll('.field, #publish, #cancelEdit');
  function setWriteVisible(on) {
    writeControls.forEach(function (el) { el.style.display = on ? '' : 'none'; });
    tokenBox.style.display = (on || !tokenEl.value.trim()) ? '' : 'none';
  }
  function pickBlob(path) { return tree.find(function (b) { return b.type === 'blob' && b.path === path; }); }
  document.querySelectorAll('#moduleNav button').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      const m = btn.dataset.module;
      document.querySelectorAll('#moduleNav button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      managePanel.hidden = true;
      homePanel.hidden = true;
      aboutPanel.hidden = true;
      if (m === 'write') { setWriteVisible(true); moduleHint.textContent = '填写并发布新日志，图片可插在文字中间。'; return; }
      if (m === 'about') { setWriteVisible(false); aboutPanel.hidden = false; await loadAbout(); moduleHint.textContent = '关于'; return; }
      if (!token()) {
        setWriteVisible(true);
        tokenBox.hidden = false; tokenBtn.hidden = true;
        moduleHint.textContent = '请先粘贴 GitHub 令牌，然后点一下页面空白处保存';
        setStatus('未检测到令牌', 'err');
        return;
      }
      if (m === 'logs') { setWriteVisible(false); managePanel.hidden = false; await loadPosts(true); moduleHint.textContent = '编辑或删除旧文'; return; }
      if (m === 'home') { setWriteVisible(false); homePanel.hidden = false; moduleHint.textContent = '首页：改大字/小字/页脚，或管理相片。'; await loadHomePanel(); return; }
    });
  });
  if (tokenEl.value.trim()) { setWriteVisible(false); managePanel.hidden = true; moduleHint.textContent = '选择要管理的栏目：落笔、首页、日志、门类、关于。'; }
  const writeBtn = document.querySelector('#moduleNav button[data-module="write"]');
  if (writeBtn) writeBtn.click();
})();
