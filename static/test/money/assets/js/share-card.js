/*
 * 赚钱本能测试 · 结果分享卡（3:4 PNG）
 * ---------------------------------------------------------------
 * 用原生 Canvas 重画结果卡并导出 PNG，不引入任何第三方截图库。
 * 只负责画图，文案由 app.js 传入。
 */
(function () {
  'use strict';

  var SERIF = '"MT Serif CN", "Noto Serif SC", "Songti SC", "STSong", serif';
  var SANS =
    '"Noto Sans SC", -apple-system, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';
  var DESIGN = { width: 600, height: 800, scale: 2 };

  function hsl(h, s, l, a) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var hp = h / 60;
    var x = c * (1 - Math.abs((hp % 2) - 1));
    var rgb = [0, 0, 0];
    if (hp < 1) rgb = [c, x, 0];
    else if (hp < 2) rgb = [x, c, 0];
    else if (hp < 3) rgb = [0, c, x];
    else if (hp < 4) rgb = [0, x, c];
    else if (hp < 5) rgb = [x, 0, c];
    else rgb = [c, 0, x];
    var m = l - c / 2;
    return (
      'rgba(' +
      rgb
        .map(function (v) {
          return Math.round((v + m) * 255);
        })
        .join(',') +
      ',' +
      (a === undefined ? 1 : a) +
      ')'
    );
  }

  var COLOR = {
    background: hsl(42, 55, 96),
    primary: hsl(220, 31, 15),
    accent: hsl(39, 57, 42),
    accentSoft: hsl(39, 57, 42, 0.12),
    accentLine: hsl(39, 57, 42, 0.35),
    accentRule: hsl(39, 57, 42, 0.5),
    header: hsl(40, 16, 45),
    quote: hsl(40, 16, 30)
  };

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function setFont(ctx, size, weight, serif) {
    ctx.font = (weight || '400') + ' ' + size + 'px ' + (serif ? SERIF : SANS);
  }

  /** 逐字绘制，用来模拟 CSS 的 letter-spacing */
  function drawSpaced(ctx, text, centerX, baselineY, spacing) {
    var chars = text.split('');
    var widths = chars.map(function (ch) {
      return ctx.measureText(ch).width;
    });
    var total =
      widths.reduce(function (sum, w) {
        return sum + w;
      }, 0) +
      spacing * (chars.length - 1);
    var x = centerX - total / 2;
    var previous = ctx.textAlign;
    ctx.textAlign = 'left';
    chars.forEach(function (ch, i) {
      ctx.fillText(ch, x, baselineY);
      x += widths[i] + spacing;
    });
    ctx.textAlign = previous;
  }

  function wrapLines(ctx, text, maxWidth) {
    var lines = [];
    var line = '';
    for (var i = 0; i < text.length; i++) {
      var candidate = line + text[i];
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = text[i];
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function draw(ctx, config) {
    var W = DESIGN.width;
    var H = DESIGN.height;

    ctx.save();
    ctx.fillStyle = COLOR.background;
    ctx.fillRect(0, 0, W, H);

    // 内描边
    ctx.strokeStyle = COLOR.accentLine;
    ctx.lineWidth = 1;
    roundedRect(ctx, 24, 24, W - 48, H - 48, 18);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // 顶部小标题
    setFont(ctx, 13, '400', true);
    ctx.fillStyle = COLOR.header;
    drawSpaced(ctx, config.badge, W / 2, 76, 2.6);

    // 中部内容块（整体垂直居中）
    var quoteMaxWidth = 420;
    setFont(ctx, 16, '400', true);
    var quoteLines = wrapLines(ctx, config.quote, quoteMaxWidth);
    var lineHeight = 26;

    setFont(ctx, 13, '400', false);
    var chipSpacing = 8;
    var chipPadX = 14;
    var chipHeight = 30;
    var chipWidths = (config.shareKeywords || []).map(function (word) {
      return ctx.measureText(word).width + chipPadX * 2;
    });
    var chipsWidth = chipWidths.reduce(function (sum, w) {
      return sum + w;
    }, 0);
    if (chipWidths.length > 1) chipsWidth += chipSpacing * (chipWidths.length - 1);

    var blockHeight =
      14 + // 我的结果
      14 +
      46 + // 结果名
      22 +
      1 + // 分隔线
      22 +
      chipHeight +
      30 +
      quoteLines.length * lineHeight;
    var y = Math.max(150, (H - blockHeight) / 2);

    // 我的结果
    setFont(ctx, 13, '400', false);
    ctx.fillStyle = COLOR.accent;
    drawSpaced(ctx, config.label, W / 2, y + 12, 3.9);
    y += 14 + 14;

    // 结果名
    setFont(ctx, 44, '600', true);
    ctx.fillStyle = COLOR.primary;
    ctx.fillText(config.name, W / 2, y + 34);
    y += 46 + 22;

    // 分隔线
    ctx.fillStyle = COLOR.accentRule;
    ctx.fillRect(W / 2 - 24, y, 48, 1);
    y += 1 + 22;

    // 关键词
    var chipX = W / 2 - chipsWidth / 2;
    setFont(ctx, 13, '400', false);
    (config.shareKeywords || []).forEach(function (word, i) {
      ctx.fillStyle = COLOR.accentSoft;
      roundedRect(ctx, chipX, y, chipWidths[i], chipHeight, chipHeight / 2);
      ctx.fill();
      ctx.fillStyle = COLOR.accent;
      ctx.textAlign = 'center';
      ctx.fillText(word, chipX + chipWidths[i] / 2, y + chipHeight / 2 + 5);
      chipX += chipWidths[i] + chipSpacing;
    });
    y += chipHeight + 30;

    // 金句
    setFont(ctx, 16, '400', true);
    ctx.fillStyle = COLOR.quote;
    quoteLines.forEach(function (line, i) {
      ctx.fillText(line, W / 2, y + 14 + i * lineHeight);
    });

    // 底部
    setFont(ctx, 13, '400', false);
    ctx.fillStyle = COLOR.header;
    ctx.fillText(config.footerTop, W / 2, H - 60);
    setFont(ctx, 13, '400', true);
    ctx.fillStyle = COLOR.accent;
    drawSpaced(ctx, config.footerBottom, W / 2, H - 36, 1.3);

    ctx.restore();
  }

  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('400 16px "MT Serif CN"'),
      document.fonts.load('600 44px "MT Serif CN"')
    ])
      .then(function () {
        return document.fonts.ready;
      })
      .catch(function () {});
  }

  function download(config, done) {
    fontsReady().then(function () {
      var canvas = document.createElement('canvas');
      canvas.width = DESIGN.width * DESIGN.scale;
      canvas.height = DESIGN.height * DESIGN.scale;
      var ctx = canvas.getContext('2d');
      ctx.scale(DESIGN.scale, DESIGN.scale);
      try {
        draw(ctx, config);
        var link = document.createElement('a');
        link.download = config.fileName || '结果卡.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        link.remove();
        done(true);
      } catch (error) {
        done(false);
      }
    });
  }

  window.MoneyTestShareCard = { draw: draw, download: download };
})();
