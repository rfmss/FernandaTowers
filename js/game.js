function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// === game.js — spawn, update, wave, loop, victory, gameOver ===

function spawnEnemy(type, wiOverride, xOverride, yOverride) {
  var d = EDEFS[type];
  enemies.push({
    active: true,
    type: type,
    hp: d.hp,
    mhp: d.hp,
    spd: d.spd,
    reward: d.reward,
    col: d.col,
    r: d.r,
    split: d.split,
    fly: d.fly,
    isBoss: d.isBoss || false,
    wi: wiOverride || 0,
    prog: 0,
    x: xOverride || 0,
    y: yOverride || 0,
    slow: 1,
    slowt: 0,
    destX: 0,
    destY: 0
  });
}
var bossEnemy = null;
function startWave() {
  S.waveIdx++;
  if (S.waveIdx >= WAVES.length) {
    victory();
    return;
  }
  S.waveActive = true;
  S.buildPhase = false;
  wt = 0;
  qc = 0;
  buildQueue(WAVES[S.waveIdx]);
  var isBW = WAVES[S.waveIdx].some(function (g) {
    return g.t === 'amelia';
  });
  var bi = MAPOBJ.banners[S.waveIdx] || {
    ceremony: "ONDA ".concat(S.waveIdx + 1),
    quote: ''
  };
  if (isBW) {
    showBossBanner();
    SFX.boss();
  } else {
    showBanner(S.waveIdx + 1, bi);
    setPhase("ONDA ".concat(String(S.waveIdx + 1).padStart(2, '0')));
    SFX.waveStart();
  }
  setStatus('');
  hud();
}
function endWave() {
  S.waveActive = false;
  S.buildPhase = true;
  btimer = 0;
  bossEnemy = null;
  hideBossHpBar();
  if (S.waveIdx + 1 < WAVES.length) {
    S.gold += 30;
    floaty(W / 2, H / 2 - 60, '+30 prestígio', '#D4A017');
    setPhase('FASE DE CAMPANHA');
    hud();
  } else {
    victory();
  }
}
function tickBuild(dt) {
  if (!S.buildPhase || S.waveIdx >= WAVES.length - 1) return;
  btimer += dt;
  var rem = Math.ceil(BUILD - btimer);
  setStatus("campanha \u2014 pr\xF3xima onda em ".concat(rem, "s  [espa\xE7o]"));
  if (btimer >= BUILD) startWave();
}
var baseX = 0,
  baseY = 0;
function updateBasePos() {
  if (!WP) return;
  var last = WP[WP.length - 1];
  var p = t2s(last[0], last[1]);
  baseX = p.x;
  baseY = p.y - TH / 4;
}
function updEnemies(dt) {
  for (var i = enemies.length - 1; i >= 0; i--) {
    var e = enemies[i];
    if (!e.active) continue;
    if (e.slowt > 0) e.slowt -= dt;else e.slow = 1;
    var spd = e.spd * e.slow;
    if (e.isBoss) {
      bossEnemy = e;
      showBossHpBar(e.hp / e.mhp);
    }
    if (e.fly) {
      if (e.destX === 0 && e.destY === 0) {
        var sp = t2s(WP[0][0], WP[0][1]);
        e.x = sp.x;
        e.y = sp.y - TH / 4;
        e.destX = baseX;
        e.destY = baseY;
      }
      var dx = e.destX - e.x,
        dy = e.destY - e.y,
        dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < spd * TW * dt + 4) {
        e.active = false;
        S.lives = Math.max(0, S.lives - 1);
        flashLivesLost();
        hud();
        if (S.lives <= 0) gameOver();
      } else {
        e.x += dx / dist * spd * TW * dt;
        e.y += dy / dist * spd * TW * dt;
      }
      continue;
    }
    var ni = e.wi + 1;
    if (ni >= WP.length) {
      e.active = false;
      S.lives = Math.max(0, S.lives - 1);
      flashLivesLost();
      hud();
      if (S.lives <= 0) gameOver();
      continue;
    }
    e.prog += spd * dt;
    if (e.prog >= 1) {
      e.prog -= 1;
      e.wi++;
    }
    var _WP$e$wi = _slicedToArray(WP[e.wi], 2),
      r0 = _WP$e$wi[0],
      c0 = _WP$e$wi[1],
      _WP$Math$min = _slicedToArray(WP[Math.min(e.wi + 1, WP.length - 1)], 2),
      r1 = _WP$Math$min[0],
      c1 = _WP$Math$min[1];
    var p0 = t2s(r0, c0),
      p1 = t2s(r1, c1);
    e.x = p0.x + (p1.x - p0.x) * e.prog;
    e.y = p0.y + (p1.y - p0.y) * e.prog - TH / 4;
  }
}
function updTowers(dt) {
  var _iterator = _createForOfIteratorHelper(towers),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var t = _step.value;
      t.cd = Math.max(0, (t.cd || 0) - dt);
      if (t.cd > 0) continue;
      var base = TDEFS[t.type],
        st = towerStats(t),
        rpx = st.range * TW * .85;
      var best = null,
        bs = -1;
      var _iterator2 = _createForOfIteratorHelper(enemies),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var e = _step2.value;
          if (!e.active) continue;
          var dx = e.x - t.sx,
            dy = e.y - t.sy;
          if (Math.sqrt(dx * dx + dy * dy) > rpx) continue;
          var score = e.fly ? WP.length + 10 : e.isBoss ? WP.length + 5 : e.wi + e.prog;
          if (score > bs) {
            bs = score;
            best = e;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (!best) continue;
      t.cd = 1 / st.rate;
      var slot = projs.find(function (p) {
        return !p.active;
      });
      if (!slot) continue;
      base.sfx();
      Object.assign(slot, {
        active: true,
        x: t.sx,
        y: t.sy - 14,
        tgt: best,
        spd: 300,
        dmg: st.dmg,
        splash: base.splash,
        slow: base.slow,
        col: base.pcol,
        sz: base.psz
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function updProjs(dt) {
  var _iterator3 = _createForOfIteratorHelper(projs),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var p = _step3.value;
      if (!p.active) continue;
      if (!p.tgt.active) {
        p.active = false;
        continue;
      }
      var dx = p.tgt.x - p.x,
        dy = p.tgt.y - p.y,
        d = Math.sqrt(dx * dx + dy * dy);
      if (d < p.spd * dt + 5) {
        hitP(p);
        p.active = false;
      } else {
        p.x += dx / d * p.spd * dt;
        p.y += dy / d * p.spd * dt;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function hitP(p) {
  SFX.hit();
  if (p.splash > 0) {
    var _iterator4 = _createForOfIteratorHelper(enemies),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var e = _step4.value;
        if (!e.active) continue;
        var dx = e.x - p.tgt.x,
          dy = e.y - p.tgt.y;
        if (Math.sqrt(dx * dx + dy * dy) <= p.splash) dmgE(e, p.dmg, p.slow);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    splash.push({
      x: p.tgt.x,
      y: p.tgt.y,
      mr: p.splash,
      t: 0,
      dur: .38
    });
  } else {
    dmgE(p.tgt, p.dmg, p.slow);
  }
}
function dmgE(e, d, slow) {
  e.hp -= d;
  if (slow < 1) {
    e.slow = slow;
    e.slowt = 2.2;
  }
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e) {
  SFX.death();
  if (e.split) {
    for (var i = 0; i < 2; i++) {
      spawnEnemy('academico', e.wi, e.x + (i * 8 - 4), e.y);
      var mini = enemies[enemies.length - 1];
      mini.hp = 40;
      mini.mhp = 40;
      mini.r = 4;
      mini.spd = 1.4;
      mini.reward = 5;
      mini.x = e.x + (i * 8 - 4);
      mini.y = e.y;
      mini.prog = e.prog;
    }
  }
  if (e.isBoss) {
    bossEnemy = null;
    hideBossHpBar();
  }
  e.active = false;
  S.gold += e.reward;
  S.score += e.reward * 10;
  floaty(e.x, e.y - 14, "+".concat(e.reward), '#D4A017');
  hud();
}
function drawTower(t) {
  var def = TDEFS[t.type];
  var _t2s = t2s(t.row, t.col),
    x = _t2s.x,
    y = _t2s.y;
  t.sx = x;
  t.sy = y;
  var lv = t.level || 1,
    st = towerStats(t),
    bw = 14 + lv * 2,
    bh = 15 + lv * 2,
    d = 7 + lv;
  var sel = S.selTower === t;
  cx.beginPath();
  cx.arc(x, y - TH / 4, st.range * TW * .85, 0, Math.PI * 2);
  cx.strokeStyle = sel ? t.type === 'critica' ? 'rgba(91,170,200,.35)' : 'rgba(212,160,23,.28)' : t.type === 'critica' ? 'rgba(91,170,200,.07)' : 'rgba(212,160,23,.04)';
  cx.lineWidth = sel ? 1.5 : 1;
  cx.stroke();
  if (sel) {
    cx.fillStyle = t.type === 'critica' ? 'rgba(91,170,200,.04)' : 'rgba(212,160,23,.03)';
    cx.fill();
  }
  var lvB = (lv - 1) * 16,
    top = shade(def.col, lvB),
    lft = shade(def.col, -20 + lvB),
    rgt = shade(def.col, -10 + lvB),
    sk = shade(def.col, -38);
  cx.lineWidth = .9;
  cx.strokeStyle = sk;
  cx.beginPath();
  cx.moveTo(x, y - bh - bw / 2);
  cx.lineTo(x + bw, y - bh);
  cx.lineTo(x, y - bh + bw / 2);
  cx.lineTo(x - bw, y - bh);
  cx.closePath();
  cx.fillStyle = top;
  cx.fill();
  cx.stroke();
  cx.beginPath();
  cx.moveTo(x - bw, y - bh);
  cx.lineTo(x, y - bh + bw / 2);
  cx.lineTo(x, y - bh + bw / 2 + d);
  cx.lineTo(x - bw, y - bh + d);
  cx.closePath();
  cx.fillStyle = lft;
  cx.fill();
  cx.stroke();
  cx.beginPath();
  cx.moveTo(x, y - bh + bw / 2);
  cx.lineTo(x + bw, y - bh);
  cx.lineTo(x + bw, y - bh + d);
  cx.lineTo(x, y - bh + bw / 2 + d);
  cx.closePath();
  cx.fillStyle = rgt;
  cx.fill();
  cx.stroke();
  if (t.type === 'sonia') {
    cx.beginPath();
    cx.moveTo(x, y - bh - bw / 2 - 1);
    cx.lineTo(x + 1.5, y - bh - bw / 2 - 10 - lv * 2);
    cx.lineTo(x - 1.5, y - bh - bw / 2 - 10 - lv * 2);
    cx.closePath();
    cx.fillStyle = def.acc;
    cx.fill();
  } else if (t.type === 'publico') {
    cx.beginPath();
    cx.arc(x, y - bh - bw / 2 + 2, 4 + lv, 0, Math.PI * 2);
    cx.fillStyle = def.acc;
    cx.fill();
    cx.beginPath();
    cx.arc(x, y - bh - bw / 2 + 2, 2 + lv * .5, 0, Math.PI * 2);
    cx.fillStyle = '#060402';
    cx.fill();
  } else {
    cx.beginPath();
    cx.moveTo(x, y - bh - bw / 2 - 12 - lv * 2);
    cx.lineTo(x + 3 + lv, y - bh - bw / 2 - 3);
    cx.lineTo(x - 3 - lv, y - bh - bw / 2 - 3);
    cx.closePath();
    cx.fillStyle = def.acc;
    cx.fill();
  }
  var ps = 6,
    pw = 4,
    py2 = y + TH / 4 + 6,
    tw2 = lv * ps;
  for (var i = 0; i < lv; i++) {
    var px = x - tw2 / 2 + i * ps + pw / 2;
    cx.fillStyle = def.acc;
    cx.fillRect(px - pw / 2, py2, pw, pw);
  }
  if (sel) {
    cx.beginPath();
    cx.moveTo(x, y - bh - bw / 2 - 2);
    cx.lineTo(x + bw + 2, y - bh - 1);
    cx.lineTo(x, y - bh + bw / 2 + 2);
    cx.lineTo(x - bw - 2, y - bh - 1);
    cx.closePath();
    cx.strokeStyle = 'rgba(212,160,23,.6)';
    cx.lineWidth = 1.2;
    cx.stroke();
  }
}
function drawEnemy(e) {
  if (e.fly) {
    cx.beginPath();
    cx.ellipse(e.x - e.r * 1.2, e.y - 2, e.r * 1.0, e.r * .35, Math.PI * .15, 0, Math.PI * 2);
    cx.fillStyle = 'rgba(74,56,160,.4)';
    cx.fill();
    cx.beginPath();
    cx.ellipse(e.x + e.r * 1.2, e.y - 2, e.r * 1.0, e.r * .35, -Math.PI * .15, 0, Math.PI * 2);
    cx.fillStyle = 'rgba(74,56,160,.4)';
    cx.fill();
  }
  if (e.isBoss) {
    var pulse = .7 + .3 * Math.sin(Date.now() * .004);
    cx.beginPath();
    cx.arc(e.x, e.y, e.r * 1.8 * pulse, 0, Math.PI * 2);
    cx.fillStyle = 'rgba(123,47,190,.1)';
    cx.fill();
    cx.beginPath();
    cx.arc(e.x, e.y, e.r * 1.4, 0, Math.PI * 2);
    cx.strokeStyle = 'rgba(200,160,255,.35)';
    cx.lineWidth = 2;
    cx.stroke();
  }
  cx.beginPath();
  cx.ellipse(e.x, e.y + e.r + (e.fly ? -2 : 1), e.r * .85, e.r * (e.fly ? .12 : .28), 0, 0, Math.PI * 2);
  cx.fillStyle = 'rgba(0,0,0,.22)';
  cx.fill();
  cx.beginPath();
  cx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
  cx.fillStyle = e.slow < 1 ? '#5BAAC8' : e.col;
  cx.fill();
  cx.strokeStyle = shade(e.col, -28);
  cx.lineWidth = e.isBoss ? 2.5 : 1.5;
  cx.stroke();
  cx.beginPath();
  cx.arc(e.x, e.y, e.r * .36, 0, Math.PI * 2);
  cx.fillStyle = 'rgba(255,255,255,.16)';
  cx.fill();
  if (e.split) {
    cx.beginPath();
    cx.arc(e.x, e.y, e.r + 2, 0, Math.PI * 2);
    cx.strokeStyle = 'rgba(160,80,0,.4)';
    cx.lineWidth = 1;
    cx.setLineDash([3, 3]);
    cx.stroke();
    cx.setLineDash([]);
  }
  var bw = e.r * 2.8 * (e.isBoss ? 1.8 : 1),
    bh = 3,
    bx = e.x - bw / 2,
    by = e.y - e.r - 8;
  cx.fillStyle = 'rgba(0,0,0,.28)';
  cx.fillRect(bx, by, bw, bh);
  var pct = e.hp / e.mhp;
  cx.fillStyle = e.isBoss ? '#9B4FEE' : pct > .5 ? '#4CAF50' : pct > .25 ? '#FF9800' : '#C8200A';
  cx.fillRect(bx, by, bw * pct, bh);
}
function drawProj(p) {
  cx.beginPath();
  cx.arc(p.x, p.y, p.sz / 2, 0, Math.PI * 2);
  cx.fillStyle = p.col;
  cx.fill();
  cx.beginPath();
  cx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
  cx.fillStyle = p.col + '28';
  cx.fill();
}
function updSplash(dt) {
  for (var i = splash.length - 1; i >= 0; i--) {
    var s = splash[i];
    s.t += dt;
    if (s.t >= s.dur) {
      splash.splice(i, 1);
      continue;
    }
    var p = s.t / s.dur,
      r = s.mr * p;
    cx.beginPath();
    cx.arc(s.x, s.y, r, 0, Math.PI * 2);
    cx.strokeStyle = "rgba(212,160,23,".concat(.5 * (1 - p), ")");
    cx.lineWidth = 2;
    cx.stroke();
  }
}
var hov = null;
function setHov(px, py) {
  var t = s2t(px, py);
  hov = t.row >= 0 && t.row < ROWS && t.col >= 0 && t.col < COLS ? t : null;
}
cv.addEventListener('mousemove', function (e) {
  var r = cv.getBoundingClientRect();
  setHov(e.clientX - r.left, e.clientY - r.top);
});
cv.addEventListener('mouseleave', function () {
  return hov = null;
});
var touchMoved = false;
cv.addEventListener('touchstart', function (e) {
  e.preventDefault();
  touchMoved = false;
  var t = e.touches[0],
    r = cv.getBoundingClientRect();
  setHov(t.clientX - r.left, t.clientY - r.top);
}, {
  passive: false
});
cv.addEventListener('touchmove', function (e) {
  e.preventDefault();
  touchMoved = true;
  var t = e.touches[0],
    r = cv.getBoundingClientRect();
  setHov(t.clientX - r.left, t.clientY - r.top);
}, {
  passive: false
});
cv.addEventListener('touchend', function (e) {
  e.preventDefault();
  if (!touchMoved) {
    var t = e.changedTouches[0],
      r = cv.getBoundingClientRect();
    handleTap(t.clientX - r.left, t.clientY - r.top);
  }
}, {
  passive: false
});
function drawHov() {
  if (!hov || !S.selType) return;
  var _hov = hov,
    row = _hov.row,
    col = _hov.col,
    _t2s2 = t2s(row, col),
    x = _t2s2.x,
    y = _t2s2.y,
    hw = TW / 2,
    hh = TH / 2;
  var isp = MAP[row][col] === 1,
    occ = towers.some(function (t) {
      return t.row === row && t.col === col;
    });
  var def = TDEFS[S.selType],
    ok = !isp && !occ && S.gold >= def.cost;
  cx.beginPath();
  cx.moveTo(x, y - hh);
  cx.lineTo(x + hw, y);
  cx.lineTo(x, y + hh);
  cx.lineTo(x - hw, y);
  cx.closePath();
  cx.strokeStyle = ok ? 'rgba(212,160,23,.8)' : 'rgba(120,110,100,.3)';
  cx.lineWidth = 1.5;
  cx.stroke();
  cx.fillStyle = ok ? 'rgba(212,160,23,.06)' : 'rgba(0,0,0,.02)';
  cx.fill();
}
function handleTap(px, py) {
  if (S.gameOver) return;
  var _s2t = s2t(px, py),
    row = _s2t.row,
    col = _s2t.col;
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
  var existing = towers.find(function (t) {
    return t.row === row && t.col === col;
  });
  if (existing) {
    S.selTower = existing;
    S.selType = null;
    refreshPanel();
    showUpgradePanel(existing);
    return;
  }
  if (!S.selType || MAP[row][col] === 1) {
    S.selTower = null;
    hideUpgradePanel();
    return;
  }
  var def = TDEFS[S.selType];
  if (S.gold < def.cost) {
    floaty(px, py - 20, 'SEM PRESTÍGIO', '#555');
    return;
  }
  S.gold -= def.cost;
  towers.push({
    row: row,
    col: col,
    type: S.selType,
    cd: 0,
    sx: 0,
    sy: 0,
    level: 1
  });
  S.selTower = null;
  hideUpgradePanel();
  hud();
}
cv.addEventListener('click', function (e) {
  var r = cv.getBoundingClientRect();
  handleTap(e.clientX - r.left, e.clientY - r.top);
});
document.querySelectorAll('.tower-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    S.selType = b.dataset.type;
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  });
  b.addEventListener('touchstart', function (e) {
    e.stopPropagation();
    S.selType = b.dataset.type;
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  }, {
    passive: true
  });
});
document.getElementById('btn-cancel').addEventListener('click', function () {
  S.selType = null;
  refreshPanel();
});
function refreshPanel() {
  document.querySelectorAll('.tower-btn').forEach(function (b) {
    var def = TDEFS[b.dataset.type];
    b.classList.toggle('active', b.dataset.type === S.selType);
    b.classList.toggle('cant-afford', S.gold < def.cost);
  });
}
function showUpgradePanel(t) {
  var lv = t.level || 1,
    st = towerStats(t),
    cost = towerUpgradeCost(t),
    def = TDEFS[t.type];
  document.getElementById('up-type').textContent = def.label;
  document.getElementById('up-level').innerHTML = "NVL <em>".concat(lv, "</em> / 3");
  var maxSt = towerStats({
    type: t.type,
    level: 3
  });
  document.getElementById('up-dmg').textContent = st.dmg;
  document.getElementById('up-dmg-bar').style.width = "".concat(st.dmg / maxSt.dmg * 100, "%");
  document.getElementById('up-rng').textContent = st.range;
  document.getElementById('up-rng-bar').style.width = "".concat(st.range / maxSt.range * 100, "%");
  document.getElementById('up-rate').textContent = "".concat(st.rate, "/s");
  document.getElementById('up-rate-bar').style.width = "".concat(st.rate / maxSt.rate * 100, "%");
  var btn = document.getElementById('up-btn');
  if (!cost) {
    btn.textContent = 'NÍVEL MÁXIMO';
    btn.disabled = true;
  } else if (S.gold < cost) {
    btn.textContent = "Fortalecer \u25C6 ".concat(cost);
    btn.disabled = true;
  } else {
    btn.textContent = "Fortalecer \u25C6 ".concat(cost);
    btn.disabled = false;
  }
  document.getElementById('upgrade-panel').classList.add('show');
}
function hideUpgradePanel() {
  document.getElementById('upgrade-panel').classList.remove('show');
  S.selTower = null;
}
document.getElementById('up-btn').addEventListener('click', function () {
  var t = S.selTower;
  if (!t) return;
  var cost = towerUpgradeCost(t);
  if (!cost || S.gold < cost) return;
  S.gold -= cost;
  t.level = (t.level || 1) + 1;
  S.score += 50;
  SFX.upgrade();
  floaty(t.sx, t.sy - 20, "NVL ".concat(t.level, "!"), '#D4A017');
  showUpgradePanel(t);
  hud();
});
document.getElementById('up-close').addEventListener('click', hideUpgradePanel);
document.addEventListener('keydown', function (e) {
  if (e.key === '1') {
    S.selType = 'sonia';
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  }
  if (e.key === '2') {
    S.selType = 'publico';
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  }
  if (e.key === '3') {
    S.selType = 'critica';
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  }
  if (e.key === 'Escape') {
    S.selType = null;
    S.selTower = null;
    hideUpgradePanel();
    refreshPanel();
  }
  if (e.key === ' ' && S.buildPhase && !S.gameOver) {
    e.preventDefault();
    startWave();
  }
});
function hud() {
  document.getElementById('h-gold').innerHTML = "<em>".concat(S.gold, "</em>");
  document.getElementById('h-lives').textContent = S.lives;
  document.getElementById('h-score').textContent = S.score;
  var wi = S.waveIdx + 1;
  document.getElementById('h-wave').innerHTML = wi <= 0 ? '—' : "".concat(String(wi).padStart(2, '0'), "<span style=\"font-size:11px;color:var(--muted)\"> /").concat(String(WAVES.length).padStart(2, '0'), "</span>");
  refreshPanel();
  if (S.selTower) showUpgradePanel(S.selTower);
}
function setPhase(t) {
  document.getElementById('h-phase').textContent = t;
}
function setStatus(t) {
  document.getElementById('s-wave').textContent = t;
}
function showBanner(n, bi) {
  var el = document.getElementById('wave-banner');
  document.getElementById('wb-ceremony').textContent = bi.ceremony || "ONDA ".concat(n);
  document.getElementById('wb-num').textContent = String(n).padStart(2, '0');
  document.getElementById('wb-quote').textContent = bi.quote || '';
  el.classList.add('show');
  setTimeout(function () {
    return el.classList.remove('show');
  }, 2800);
}
function showBossBanner() {
  var el = document.getElementById('boss-banner');
  el.classList.add('show');
  setPhase('BOSS — AMÉLIA PÉREZ');
  setTimeout(function () {
    return el.classList.remove('show');
  }, 3200);
}
function showBossHpBar(pct) {
  document.getElementById('boss-hpbar-wrap').classList.add('show');
  document.getElementById('boss-hpbar-fill').style.width = "".concat(Math.max(0, pct * 100), "%");
}
function hideBossHpBar() {
  document.getElementById('boss-hpbar-wrap').classList.remove('show');
}
function floaty(x, y, txt, col) {
  var el = document.createElement('div');
  el.className = 'floaty';
  el.textContent = txt;
  el.style.cssText = "left:".concat(x, "px;top:").concat(y, "px;color:").concat(col);
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, 920);
}
function gameOver() {
  S.gameOver = true;
  setPhase('FIM');
  SFX.lose();
  overlay('FIM DE JOGO', 'Pontução: ' + S.score, 'O cinema brasileiro resistiu até onde pôde.', false, 0);
}
function victory() {
  S.gameOver = true;
  setPhase('VITÓRIA');
  SFX.victory();
  var stars = saveResult(CURMAP, S.score, S.lives);
  var isOscar = CURMAP === 6,
    starStr = '',
    i;
  for (i = 1; i <= 3; i++) starStr += (i <= stars ? '★' : '☆') + ' ';
  var msgs = ['', 'Boa campanha!', 'Excelente defesa!', 'Perfeita!'];
  var baseMsg = isOscar ? '"Ela perdeu tudo. E ficou de pé."\n— Salter Walles, 2025\n\nPara Fernanda Towers e Fernanda Montanha.\nDuas mulheres que resistiram.' : 'O cinema brasileiro avança para a próxima cerimônia.';
  overlay(isOscar ? 'O DOURADO É NOSSO' : 'VITÓRIA', 'Pontuação: ' + S.score, baseMsg + '\n' + starStr + msgs[stars], isOscar, stars);
}
function overlay(title, sub, msg, isGolden, stars) {
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(8,7,6,.93);font-family:"Courier Prime",monospace;padding:20px;text-align:center;';
  var sr = '',
    mh = '',
    i,
    ln;
  if (stars && stars > 0) {
    var sh = '';
    for (i = 1; i <= 3; i++) sh += '<span style="font-size:26px;color:' + (i <= stars ? '#D4A017' : '#282420') + ';text-shadow:' + (i <= stars ? '0 0 8px rgba(212,160,23,.6)' : 'none') + '">★</span>';
    sr = '<div style="margin-bottom:14px;">' + sh + '</div>';
  }
  var lines = (msg || '').split('\n');
  for (i = 0; i < lines.length; i++) {
    ln = lines[i];
    mh += ln ? '<div style="font-size:11px;color:#6A6560;margin-top:6px;letter-spacing:.06em;max-width:320px;">' + ln + '</div>' : '<div style="height:5px"></div>';
  }
  el.innerHTML = sr + '<div style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#D4A017;margin-bottom:10px;">Fernanda Towers</div>' + '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(36px,7vw,68px);color:#F0EDE8;letter-spacing:.08em;line-height:1;">' + title + '</div>' + '<div style="font-size:12px;color:#6A6560;margin-top:10px;letter-spacing:.15em;">' + sub + '</div>' + mh + '<div style="display:flex;gap:10px;margin-top:22px;">' + '<div style="font-size:9px;letter-spacing:.2em;color:#6A6560;border:1px solid #2A2820;padding:8px 16px;cursor:pointer;" onmouseover="this.style.color=\'#F0EDE8\'" onmouseout="this.style.color=\'#6A6560\'" onclick="location.reload()">[ REINICIAR ]</div>' + '<div style="font-size:9px;letter-spacing:.2em;color:#6A6560;border:1px solid #2A2820;padding:8px 16px;cursor:pointer;" onmouseover="this.style.color=\'#F0EDE8\'" onmouseout="this.style.color=\'#6A6560\'" onclick="backToMaps()">[ MAPAS ]</div>' + '</div>';
  document.body.appendChild(el);
}
function miniTower(c, x, y, col, acc, type) {
  var bw = 10,
    bh = 12,
    d = 5,
    sk = shade(col, -35);
  c.strokeStyle = sk;
  c.lineWidth = .8;
  c.beginPath();
  c.moveTo(x, y - bh - bw / 2);
  c.lineTo(x + bw, y - bh);
  c.lineTo(x, y - bh + bw / 2);
  c.lineTo(x - bw, y - bh);
  c.closePath();
  c.fillStyle = col;
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(x - bw, y - bh);
  c.lineTo(x, y - bh + bw / 2);
  c.lineTo(x, y - bh + bw / 2 + d);
  c.lineTo(x - bw, y - bh + d);
  c.closePath();
  c.fillStyle = shade(col, -18);
  c.fill();
  c.stroke();
  c.beginPath();
  c.moveTo(x, y - bh + bw / 2);
  c.lineTo(x + bw, y - bh);
  c.lineTo(x + bw, y - bh + d);
  c.lineTo(x, y - bh + bw / 2 + d);
  c.closePath();
  c.fillStyle = shade(col, -8);
  c.fill();
  c.stroke();
  if (type === 'sonia') {
    c.beginPath();
    c.moveTo(x, y - bh - bw / 2 - 1);
    c.lineTo(x + 1, y - bh - bw / 2 - 7);
    c.lineTo(x - 1, y - bh - bw / 2 - 7);
    c.closePath();
    c.fillStyle = acc;
    c.fill();
  } else if (type === 'publico') {
    c.beginPath();
    c.arc(x, y - bh - bw / 2 + 1, 3.5, 0, Math.PI * 2);
    c.fillStyle = acc;
    c.fill();
    c.beginPath();
    c.arc(x, y - bh - bw / 2 + 1, 1.5, 0, Math.PI * 2);
    c.fillStyle = '#060402';
    c.fill();
  } else {
    c.beginPath();
    c.moveTo(x, y - bh - bw / 2 - 9);
    c.lineTo(x + 3, y - bh - bw / 2 - 2);
    c.lineTo(x - 3, y - bh - bw / 2 - 2);
    c.closePath();
    c.fillStyle = acc;
    c.fill();
  }
}
function drawIcons() {
  [['icon-sonia', '#2A2018', '#D4A017', 'sonia'], ['icon-publico', '#1A1210', '#C8200A', 'publico'], ['icon-critica', '#0A1820', '#5BAAC8', 'critica']].forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 4),
      id = _ref2[0],
      col = _ref2[1],
      acc = _ref2[2],
      t = _ref2[3];
    miniTower(document.getElementById(id).getContext('2d'), 18, 30, col, acc, t);
  });
}
function drawMapPreview(mapIdx, canvasId) {
  var m = MAPS[mapIdx];
  var c = document.getElementById(canvasId);
  var ctx = c.getContext('2d');
  var cw = c.width,
    ch = c.height;
  var rows = m.grid.length,
    cols = m.grid[0].length;
  var tw = 14,
    th = 7;
  var ox = cw / 2 - (cols - rows) * (tw / 4);
  var oy = ch / 2 - (cols + rows) * (th / 4) + th;
  ctx.clearRect(0, 0, cw, ch);
  for (var r = 0; r < rows; r++) for (var cc = 0; cc < cols; cc++) {
    var x = ox + (cc - r) * (tw / 2),
      y = oy + (cc + r) * (th / 2);
    var p = m.grid[r][cc] === 1;
    ctx.beginPath();
    ctx.moveTo(x, y - th / 2);
    ctx.lineTo(x + tw / 2, y);
    ctx.lineTo(x, y + th / 2);
    ctx.lineTo(x - tw / 2, y);
    ctx.closePath();
    var pv = m.palette || {
      path: '#3A3020',
      floor: '#1A1816'
    };
    ctx.fillStyle = p ? pv.path : pv.floor;
    ctx.fill();
    ctx.strokeStyle = p ? shade2(pv.path, 12) : shade2(pv.floor, 8);
    ctx.lineWidth = .5;
    ctx.stroke();
  }
  var sp = m.wp[0];
  var sx = ox + (sp[1] - sp[0]) * (tw / 2),
    sy = oy + (sp[1] + sp[0]) * (th / 2);
  ctx.beginPath();
  ctx.arc(sx, sy, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#D4A017';
  ctx.fill();
}