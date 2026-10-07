/*
 * 赚钱本能测试 · 交互、计分与渲染
 * ---------------------------------------------------------------
 * 内容全部来自 data.js（window.MoneyTestData），本文件只负责流程与呈现：
 *   封面 → 8 道题 → 分析中 → 结果页 → 重新测试
 * 计分与并列规则与原版一致。无任何外部依赖。
 */
(function () {
  'use strict';

  var DATA = window.MoneyTestData;
  var root = document.getElementById('money-test');
  if (!DATA || !root) return;

  var view = document.getElementById('mt-view');
  var toastEl = document.getElementById('mt-toast');

  var state = { screen: 'cover', index: 0, answers: {}, result: null };
  var locked = false;
  var timers = [];
  var toastTimer = null;

  /* ---------- 小工具 ---------- */

  function later(fn, ms) {
    timers.push(window.setTimeout(fn, ms));
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function pad2(n) {
    return String(n).length < 2 ? '0' + n : String(n);
  }

  function findResultType(type) {
    for (var i = 0; i < DATA.resultTypes.length; i++) {
      if (DATA.resultTypes[i].id === type) return DATA.resultTypes[i];
    }
    return { id: type, name: type, keywords: [], shareKeywords: [] };
  }

  function toast(message) {
    toastEl.innerHTML = '<div class="mt-toast__body"></div>';
    toastEl.firstChild.textContent = message;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.hidden = true;
    }, 2600);
  }

  /* ---------- 计分（与原版实现一致） ---------- */

  function emptyBoard() {
    var board = {};
    DATA.scoringRules.types.forEach(function (type) {
      board[type] = 0;
    });
    return board;
  }

  function typesOfPickedOption(questionId, answers) {
    var question = DATA.questions.filter(function (q) {
      return q.id === questionId;
    })[0];
    if (!question) return [];
    var option = question.options.filter(function (o) {
      return o.id === answers[questionId];
    })[0];
    if (!option) return [];
    return option.scores.map(function (s) {
      return s.type;
    });
  }

  function narrowByQuestion(candidates, questionId, answers) {
    var types = typesOfPickedOption(questionId, answers);
    var filtered = candidates.filter(function (type) {
      return types.indexOf(type) >= 0;
    });
    return filtered.length ? filtered : candidates;
  }

  function pickResult(answers) {
    var rules = DATA.scoringRules;
    var list = rules.types;
    var points = emptyBoard();
    var strongHits = emptyBoard();

    DATA.questions.forEach(function (question) {
      var picked = answers[question.id];
      if (!picked) return;
      var option = question.options.filter(function (o) {
        return o.id === picked;
      })[0];
      if (!option) return;
      option.scores.forEach(function (s) {
        points[s.type] += s.points;
        if (s.points >= rules.strongHitPoints) strongHits[s.type] += 1;
      });
    });

    var max = Math.max.apply(
      null,
      list.map(function (type) {
        return points[type];
      })
    );
    var candidates = list.filter(function (type) {
      return points[type] === max;
    });
    if (candidates.length === 1) return candidates[0];

    var maxStrong = Math.max.apply(
      null,
      candidates.map(function (type) {
        return strongHits[type];
      })
    );
    candidates = candidates.filter(function (type) {
      return strongHits[type] === maxStrong;
    });
    if (candidates.length === 1) return candidates[0];

    candidates = narrowByQuestion(candidates, rules.tieBreak.primaryQuestion, answers);
    if (candidates.length === 1) return candidates[0];

    return narrowByQuestion(candidates, rules.tieBreak.secondaryQuestion, answers)[0];
  }

  /* ---------- 各屏渲染 ---------- */

  function renderCover() {
    var c = DATA.cover;
    state.screen = 'cover';
    view.innerHTML =
      '<section class="mt-screen mt-cover">' +
      '<img class="mt-cover__bg" src="' +
      esc(c.image) +
      '" alt="' +
      esc(c.imageAlt) +
      '">' +
      '<div class="mt-cover__scrim"></div>' +
      '<div class="mt-cover__inner">' +
      '<div class="mt-anim-fade-in"><p class="mt-cover__eyebrow">' +
      esc(c.eyebrow) +
      '</p></div>' +
      '<div class="mt-anim-fade-in-up" style="animation-delay:150ms">' +
      '<h1 class="mt-cover__title">' +
      c.titleLines
        .map(function (line) {
          return esc(line);
        })
        .join('<br>') +
      '</h1>' +
      '<div class="mt-cover__rule"></div>' +
      '<p class="mt-cover__subtitle">' +
      esc(c.subtitle) +
      '</p>' +
      '<div class="mt-cover__bullets">' +
      c.bullets
        .map(function (bullet) {
          return (
            '<div class="mt-cover__bullet"><span></span><span>' + esc(bullet) + '</span></div>'
          );
        })
        .join('') +
      '</div>' +
      '</div>' +
      '<div class="mt-anim-fade-in-up" style="animation-delay:350ms">' +
      '<p class="mt-cover__footnote">' +
      esc(c.footnote) +
      '</p>' +
      '<button type="button" class="mt-btn-start" data-action="start">' +
      esc(c.cta) +
      '</button>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  function renderQuestion(index) {
    var question = DATA.questions[index];
    var total = DATA.questions.length;
    var percent = (question.id / total) * 100;
    state.screen = 'question';

    var optionsHtml = question.options
      .map(function (option, i) {
        return (
          '<button type="button" class="mt-option mt-anim-rise-in" data-option="' +
          esc(option.id) +
          '" style="animation-delay:' +
          i * 70 +
          'ms" aria-label="' +
          esc(option.text) +
          '">' +
          '<img src="' +
          esc(option.image) +
          '" alt="' +
          esc(option.text) +
          '" loading="lazy">' +
          '<span class="mt-option__scrim"></span>' +
          '<span class="mt-option__text">' +
          esc(option.text) +
          '</span>' +
          '</button>'
        );
      })
      .join('');

    view.innerHTML =
      '<section class="mt-screen mt-question">' +
      '<div class="mt-progress">' +
      '<div class="mt-progress__track"><div class="mt-progress__bar" style="width:' +
      percent +
      '%"></div></div>' +
      '<span class="mt-progress__label">' +
      pad2(question.id) +
      ' / ' +
      pad2(total) +
      '</span>' +
      '</div>' +
      '<div class="mt-question__head">' +
      '<p class="mt-scene">SCENE ' +
      pad2(question.id) +
      '</p>' +
      '<h2 class="mt-question__title">' +
      esc(question.title) +
      '</h2>' +
      '<div class="mt-question__rule"></div>' +
      '</div>' +
      '<div class="mt-options">' +
      optionsHtml +
      '</div>' +
      '<p class="mt-hint">点击选项即提交，自动进入下一题</p>' +
      '</section>';
  }

  function renderAnalysis(onDone) {
    var steps = DATA.analysisSteps;
    var dots = '';
    for (var i = 0; i < 36; i++) {
      var size = (Math.random() * 2 + 1).toFixed(2);
      dots +=
        '<span class="mt-analysis__dot" style="top:' +
        (Math.random() * 100).toFixed(2) +
        '%;left:' +
        (Math.random() * 100).toFixed(2) +
        '%;width:' +
        size +
        'px;height:' +
        size +
        'px;animation-delay:' +
        (Math.random() * 3).toFixed(2) +
        's;animation-duration:' +
        (2.5 + Math.random() * 3).toFixed(2) +
        's"></span>';
    }
    state.screen = 'analysis';
    view.innerHTML =
      '<section class="mt-screen mt-analysis">' +
      '<div class="mt-analysis__decor">' +
      '<div class="mt-analysis__blob mt-analysis__blob--a"></div>' +
      '<div class="mt-analysis__blob mt-analysis__blob--b"></div>' +
      '</div>' +
      '<div class="mt-analysis__dots">' +
      dots +
      '</div>' +
      '<div class="mt-analysis__inner">' +
      '<p class="mt-analysis__text mt-anim-fade-in">' +
      esc(steps[0].text) +
      '</p>' +
      '<div class="mt-analysis__meter">' +
      '<div class="mt-analysis__track"><div class="mt-analysis__fill" style="width:0%"></div></div>' +
      '<p class="mt-analysis__percent">0%</p>' +
      '</div>' +
      '<p class="mt-analysis__tail mt-anim-fade-in" hidden>' +
      esc(DATA.analysisTail) +
      '</p>' +
      '</div>' +
      '</section>';

    var textEl = view.querySelector('.mt-analysis__text');
    var fillEl = view.querySelector('.mt-analysis__fill');
    var percentEl = view.querySelector('.mt-analysis__percent');
    var tailEl = view.querySelector('.mt-analysis__tail');

    later(function () {
      textEl.textContent = steps[1].text;
    }, 1000);
    later(function () {
      textEl.textContent = steps[2].text;
    }, 2000);
    later(function () {
      fillEl.style.width = '100%';
      percentEl.textContent = '100%';
    }, 3000);
    later(function () {
      tailEl.hidden = false;
    }, 3500);
    later(onDone, 4300);
  }

  function listItems(items) {
    return items
      .map(function (item) {
        return (
          '<div class="mt-list-item"><span class="mt-list-item__dot"></span>' +
          '<p class="mt-list-item__text">' +
          esc(item) +
          '</p></div>'
        );
      })
      .join('');
  }

  function section(index, title, bodyHtml) {
    return (
      '<section class="mt-section">' +
      '<div class="mt-section__head">' +
      '<span class="mt-section__index">' +
      index +
      '</span>' +
      '<h3 class="mt-section__title">' +
      esc(title) +
      '</h3>' +
      '</div>' +
      '<div class="mt-section__body">' +
      bodyHtml +
      '</div>' +
      '</section>'
    );
  }

  function chipsHtml(items, className) {
    return items
      .map(function (item) {
        return '<span class="' + className + '">' + esc(item) + '</span>';
      })
      .join('');
  }

  function renderResult(type) {
    var meta = findResultType(type);
    var copy = DATA.resultCopy[type];
    var cover = DATA.cover;
    state.screen = 'result';
    state.result = type;

    view.innerHTML =
      '<section class="mt-screen mt-result">' +
      '<div class="mt-result__hero mt-anim-fade-in-up">' +
      '<p class="mt-result__eyebrow">你的赚钱本能更接近</p>' +
      '<h1 class="mt-result__name">' +
      esc(meta.name) +
      '</h1>' +
      '<div class="mt-result__rule"></div>' +
      '<div class="mt-chips">' +
      chipsHtml(meta.keywords, 'mt-chip') +
      '</div>' +
      '<p class="mt-result__quote">' +
      esc(copy.heroQuote) +
      '</p>' +
      '</div>' +
      '<div class="mt-sections">' +
      section('01', '你为什么是这一型', '<p class="mt-section__text">' + esc(copy.why) + '</p>') +
      section('02', '你真正容易赚到什么钱', '<div class="mt-money-box"><p>' + esc(copy.money) + '</p></div>') +
      section('03', '你的三个天然优势', listItems(copy.advantages)) +
      section('04', '你最容易掉进去的坑', listItems(copy.pitfalls)) +
      section(
        '05',
        '适合尝试的方向',
        '<p class="mt-section__lead">你更容易在以下类型的工作中获得优势</p>' +
          listItems(copy.directions)
      ) +
      section('06', '给你的行动建议', listItems(copy.advice)) +
      '</div>' +
      '<div class="mt-gold-wrap">' +
      '<div class="mt-gold-card"><p>' +
      esc(copy.goldQuote) +
      '</p><span></span></div>' +
      '</div>' +
      '<div class="mt-share">' +
      '<p class="mt-share__label">分享你的结果</p>' +
      '<div class="mt-share__card-wrap">' +
      '<div class="mt-card" id="mt-share-card">' +
      '<div class="mt-card__frame"></div>' +
      '<div class="mt-card__inner">' +
      '<p class="mt-card__header">' +
      esc(cover.verdictBadge) +
      '</p>' +
      '<div class="mt-card__center">' +
      '<p class="mt-card__label">' +
      esc(cover.shareLabel) +
      '</p>' +
      '<h3 class="mt-card__name">' +
      esc(meta.name) +
      '</h3>' +
      '<div class="mt-card__rule"></div>' +
      '<div class="mt-card__chips">' +
      chipsHtml(meta.shareKeywords, 'mt-card__chip') +
      '</div>' +
      '<p class="mt-card__quote">' +
      esc(copy.goldQuote) +
      '</p>' +
      '</div>' +
      '<div class="mt-card__footer">' +
      '<p class="mt-card__footer-top">' +
      esc(cover.shareFooterTop) +
      '</p>' +
      '<p class="mt-card__footer-bottom">' +
      esc(cover.shareFooterBottom) +
      '</p>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="mt-actions">' +
      '<div class="mt-actions__inner">' +
      '<button type="button" class="mt-btn mt-btn--primary" data-action="save-card">保存结果卡</button>' +
      '<button type="button" class="mt-btn mt-btn--ghost" data-action="restart">再测一次</button>' +
      '</div>' +
      '</div>' +
      '</section>';
  }

  /* ---------- 流程控制 ---------- */

  function startTest() {
    clearTimers();
    locked = false;
    state.index = 0;
    state.answers = {};
    state.result = null;
    renderQuestion(0);
    window.scrollTo({ top: 0 });
  }

  function goCover() {
    clearTimers();
    locked = false;
    state.index = 0;
    state.answers = {};
    state.result = null;
    renderCover();
    window.scrollTo({ top: 0 });
  }

  function finishTest() {
    var type = pickResult(state.answers);
    renderResult(type);
    window.scrollTo({ top: 0 });
  }

  function selectOption(button) {
    if (locked) return;
    var question = DATA.questions[state.index];
    if (!question || state.answers[question.id]) return;
    locked = true;

    var optionId = button.getAttribute('data-option');
    button.classList.add('is-pressing');
    later(function () {
      button.classList.remove('is-pressing');
      button.classList.add('is-spring');
    }, 130);
    later(function () {
      button.classList.remove('is-spring');
      button.classList.add('is-exiting');
    }, 280);
    later(function () {
      state.answers[question.id] = optionId;
      locked = false;
      if (state.index < DATA.questions.length - 1) {
        state.index += 1;
        renderQuestion(state.index);
      } else {
        renderAnalysis(finishTest);
      }
    }, 460);
  }

  function saveCard(button) {
    if (!window.MoneyTestShareCard) return;
    var meta = findResultType(state.result);
    var copy = DATA.resultCopy[state.result];
    button.disabled = true;
    var label = button.textContent;
    button.textContent = '保存中…';
    window.MoneyTestShareCard.download(
      {
        badge: DATA.cover.verdictBadge,
        label: DATA.cover.shareLabel,
        name: meta.name,
        shareKeywords: meta.shareKeywords,
        quote: copy.goldQuote,
        footerTop: DATA.cover.shareFooterTop,
        footerBottom: DATA.cover.shareFooterBottom,
        fileName: '我的赚钱本能-' + meta.name + '.png'
      },
      function (ok) {
        button.disabled = false;
        button.textContent = label;
        toast(ok ? '结果卡已保存到本地' : '保存失败，请长按卡片区域保存图片');
      }
    );
  }

  function onViewClick(event) {
    var target = event.target;
    var actionEl = target.closest ? target.closest('[data-action]') : null;
    if (actionEl) {
      var action = actionEl.getAttribute('data-action');
      if (action === 'start') return startTest();
      if (action === 'restart') return goCover();
      if (action === 'save-card') return saveCard(actionEl);
      return;
    }
    var optionEl = target.closest ? target.closest('.mt-option') : null;
    if (optionEl) selectOption(optionEl);
  }

  function init() {
    view.addEventListener('click', onViewClick);
    goCover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
