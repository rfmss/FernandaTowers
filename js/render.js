function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// === render.js — rebuildOff(), draw*, render() ===

function rebuildOff() {
  if (!W || !MAP) return;
  off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  offCx = off.getContext('2d');
  var pal = MAPOBJ && MAPOBJ.palette || {
    path: '#2A2318',
    floor: '#161412',
    accent: '#D4A017'
  };
  for (var ri = 0; ri < ROWS; ri++) {
    for (var ci = 0; ci < COLS; ci++) {
      var rp = t2s(ri, ci),
        p = MAP[ri][ci] === 1;
      p ? isoTile(offCx, rp.x, rp.y, pal.path, shade(pal.path, -10), shade(pal.path, -18), shade(pal.path, -28)) : isoTile(offCx, rp.x, rp.y, pal.floor, shade(pal.floor, -5), shade(pal.floor, -11), shade(pal.floor, -18));
    }
  }
  var lbl = function lbl(r, c, col, t) {
    var lp = t2s(r, c);
    offCx.fillStyle = col;
    offCx.font = 'bold 7px Courier Prime';
    offCx.textAlign = 'center';
    offCx.textBaseline = 'middle';
    offCx.fillText(t, lp.x, lp.y - 1);
  };
  lbl(WP[0][0], WP[0][1], pal.accent || '#D4A017', 'INÍCIO');
  lbl(WP[WP.length - 1][0], WP[WP.length - 1][1], '#F0EDE8', 'BASE');
  // Draw portrait badge at base
  (function () {
    var last = WP[WP.length - 1],
      lpos = t2s(last[0], last[1]),
      x = lpos.x,
      y = lpos.y,
      r = 18;
    var img = document.getElementById('_fernanda_portrait');
    offCx.save();
    offCx.beginPath();
    offCx.arc(x, y - TH - r, r, 0, Math.PI * 2);
    offCx.fillStyle = '#0A0908';
    offCx.fill();
    offCx.beginPath();
    offCx.arc(x, y - TH - r, r, 0, Math.PI * 2);
    offCx.clip();
    if (img && img.complete) {
      var iw = img.naturalWidth || 1456,
        ih = img.naturalHeight || 816;
      var sx = iw * 0.30,
        sy = ih * 0.05,
        sw = iw * 0.40,
        sh = ih * 0.68;
      offCx.drawImage(img, sx, sy, sw, sh, x - r, y - TH - r * 2, r * 2, r * 2);
    }
    offCx.restore();
    offCx.beginPath();
    offCx.arc(x, y - TH - r, r, 0, Math.PI * 2);
    offCx.strokeStyle = '#D4A017';
    offCx.lineWidth = 1.5;
    offCx.stroke();
  })();
}
var towers = [],
  enemies = [],
  projs = Array.from({
    length: 140
  }, function () {
    return {
      active: false
    };
  }),
  splash = [];
var queue = [];
var wt = 0,
  qc = 0,
  btimer = 0;
var BUILD = 8;
function buildQueue(groups) {
  queue.length = 0;
  var t = 0;
  var _iterator = _createForOfIteratorHelper(groups),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var g = _step.value;
      for (var i = 0; i < g.n; i++) {
        queue.push({
          t: g.t,
          at: t
        });
        t += g.iv;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  queue.sort(function (a, b) {
    return a.at - b.at;
  });
}
function tickSpawner(dt) {
  if (!S.waveActive) return;
  wt += dt;
  while (qc < queue.length && queue[qc].at <= wt) {
    spawnEnemy(queue[qc].t);
    qc++;
  }
  if (qc >= queue.length && enemies.every(function (e) {
    return !e.active;
  })) endWave();
}