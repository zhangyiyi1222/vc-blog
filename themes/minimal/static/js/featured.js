/*
 * 首页“今日一篇”：读取 index.json，
 * 每天自动换一篇文章；也可以点“换一篇”手动换。
 */
(function () {
  'use strict';

  const box = document.getElementById('featured-post');
  if (!box) return;

  const titleEl = box.querySelector('.featured-title a');
  const kickerEl = box.querySelector('.featured-kicker');
  const excerptEl = box.querySelector('.featured-excerpt');
  const readEl = box.querySelector('.featured-foot a');
  const nextBtn = document.getElementById('featured-next');

  const indexUrl = document.querySelector('meta[name="featured-index"]')
    ? document.querySelector('meta[name="featured-index"]').content
    : 'index.json';

  let items = [];
  let current = -1;

  function cleanText(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function show(i, auto) {
    const item = items[i];
    if (!item) return;
    current = i;
    if (titleEl) {
      titleEl.textContent = item.title;
      titleEl.href = item.url;
    }
    if (readEl) readEl.href = item.url;
    if (excerptEl) {
      const text = cleanText(item.content);
      excerptEl.textContent = text.length > 180 ? text.slice(0, 180) + '…' : text;
    }
    if (kickerEl) {
      const label = auto ? '今日一篇' : '随手一翻';
      kickerEl.textContent = '· ' + (item.date || '') + ' · ' + label + ' ·';
    }
  }

  function dayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  fetch(indexUrl, { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      items = data;
      if (!items.length) return;
      const i = dayIndex() % items.length;
      show(i, true);
    })
    .catch(function () {
      // 保留模板里服务端渲染的那篇作为兜底
    });

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!items.length) {
        nextBtn.textContent = '再试一下';
        return;
      }
      const next = (current + 1) % items.length;
      show(next, false);
    });
  }
})();
