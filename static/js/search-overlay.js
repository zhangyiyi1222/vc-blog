/*
 * 站内搜索浮层：点导航上的放大镜就地弹开，不跳页、不打断阅读。
 * 搜索索引（index.json）和 fuse.js 都按需加载 —— 只有第一次打开搜索时才会下载，
 * 平时浏览页面不加载这两个文件，页面更轻。
 */
(function () {
  'use strict';

  const overlay = document.getElementById('search-overlay');
  const openBtn = document.getElementById('search-open');
  if (!overlay || !openBtn) return;

  const input = document.getElementById('search-overlay-input');
  const resultsEl = document.getElementById('search-overlay-results');
  const statusEl = document.getElementById('search-overlay-status');
  const indexUrl = overlay.dataset.indexUrl || 'index.json';
  const fuseUrl = overlay.dataset.fuseUrl || 'js/fuse.min.js';

  let fuse = null;
  let total = 0;
  let loading = null;
  let loaded = false;
  let timer = null;
  let lastFocus = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = src;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('搜索引擎加载失败')); };
      document.head.appendChild(s);
    });
  }

  function ensureIndex() {
    if (loaded) return Promise.resolve();
    if (loading) return loading;
    statusEl.textContent = '正在准备搜索…';
    loading = Promise.all([
      window.Fuse ? Promise.resolve() : loadScript(fuseUrl),
      fetch(indexUrl, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
    ]).then(function (out) {
      const items = out[1] || [];
      total = items.length;
      fuse = new window.Fuse(items, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'content', weight: 1 }
        ],
        includeScore: true,
        threshold: 0.35,
        ignoreLocation: true,
        tokenize: true
      });
      loaded = true;
      statusEl.textContent = '';
    }).catch(function (err) {
      loading = null;
      statusEl.textContent = '搜索准备失败：' + err.message;
      throw err;
    });
    return loading;
  }

  function render(hits) {
    resultsEl.innerHTML = '';
    if (!hits.length) {
      statusEl.textContent = '没有找到相关文章，换个词试试？';
      return;
    }
    statusEl.textContent = '共找到 ' + hits.length + ' 篇';
    hits.forEach(function (hit) {
      const item = hit.item;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.appendChild(a);
      if (item.date) {
        const time = document.createElement('time');
        time.textContent = item.date;
        li.appendChild(time);
      }
      resultsEl.appendChild(li);
    });
  }

  function run() {
    const q = input.value.trim();
    if (!q) {
      resultsEl.innerHTML = '';
      statusEl.textContent = fuse ? '' : statusEl.textContent;
      return;
    }
    if (!fuse) {
      ensureIndex().then(run, function () {});
      return;
    }
    render(fuse.search(q, { limit: 20 }));
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('search-open');
    window.setTimeout(function () { input.focus(); }, 30);
    ensureIndex().catch(function () {});
  }

  function close() {
    overlay.hidden = true;
    document.documentElement.classList.remove('search-open');
    input.value = '';
    resultsEl.innerHTML = '';
    if (loaded) statusEl.textContent = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  openBtn.addEventListener('click', open);

  overlay.addEventListener('click', function (e) {
    const t = e.target;
    if (t && t.closest && t.closest('[data-search-close]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      clearTimeout(timer);
      run();
    }
  });
})();
