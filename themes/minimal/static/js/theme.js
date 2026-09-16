/*
 * 右上角日间/夜间模式小按钮
 * 主题挂在 <html> 上（head 里的内联脚本提前设置，避免切换页面时闪白）
 */
(function () {
  'use strict';
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const KEY = 'blog-theme';

  function apply(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(KEY, theme); } catch (e) { /* 忽略 */ }
  }

  btn.addEventListener('click', function () {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    apply(next);
  });

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* 忽略 */ }
  if (saved === 'dark') {
    apply('dark');
  } else if (saved === 'light') {
    apply('light');
  } else {
    const darkOk = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    apply(darkOk ? 'dark' : 'light');
  }
})();
