/*
 * 站内搜索：读取首页生成的 index.json，用 fuse.js 在标题和正文里查找。
 * 纯前端实现，不需要任何后端。
 */
(function () {
  'use strict';

  const box = document.getElementById('search-box');
  if (!box) return;

  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const statusEl = document.getElementById('search-status');
  const indexUrl = box.dataset.indexUrl;
  let fuse = null;
  let timer = null;
  let total = 0;

  statusEl.textContent = '正在加载搜索索引…';

  fetch(indexUrl, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (items) {
      total = items.length;
      fuse = new Fuse(items, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'content', weight: 1 }
        ],
        includeScore: true,
        threshold: 0.35,
        ignoreLocation: true,
        tokenize: true
      });
      statusEl.textContent = total > 0 ? '' : '索引里还没有文章。';
    })
    .catch(function (err) {
      statusEl.textContent = '索引加载失败：' + err.message;
    });

  function render(hits) {
    resultsEl.innerHTML = '';

    if (!hits.length) {
      statusEl.textContent = '没有找到相关文章，换个词试试？';
      return;
    }

    const shown = hits.length;
    statusEl.textContent =
      '共找到 ' + shown + ' 篇' + (shown < total ? '（仅显示前 ' + shown + ' 条）' : '');

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

  function doSearch() {
    const q = input.value.trim();
    if (!q) {
      resultsEl.innerHTML = '';
      statusEl.textContent = '';
      return;
    }
    if (!fuse) {
      statusEl.textContent = '索引还没加载完，稍等一下再搜…';
      return;
    }
    const hits = fuse.search(q, { limit: 20 });
    render(hits);
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(doSearch, 200);
  });
})();
