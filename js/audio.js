// === audio.js — Web Audio API, SFX, temas musicais ===

// AUDIO
var audioCtx = null,
  soundOn = false;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function beep(freq, type, dur, vol) {
  if (!soundOn) return;
  try {
    var a = getAudio(),
      o = a.createOscillator(),
      g = a.createGain();
    o.connect(g);
    g.connect(a.destination);
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, a.currentTime);
    g.gain.setValueAtTime(vol || 0.12, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + (dur || 0.12));
    o.start();
    o.stop(a.currentTime + (dur || 0.12));
  } catch (e) {}
}
var SFX = {
  shoot: function shoot() {
    return beep(520, 'square', 0.06, .07);
  },
  cannon: function cannon() {
    return beep(75, 'sawtooth', 0.2, .16);
  },
  critica: function critica() {
    return beep(920, 'sine', 0.16, .07);
  },
  hit: function hit() {
    return beep(200, 'square', 0.05, .05);
  },
  death: function death() {
    beep(170, 'sawtooth', .12, .12);
    setTimeout(function () {
      return beep(110, 'sawtooth', .1, .09);
    }, 90);
  },
  boss: function boss() {
    [110, 140, 180].forEach(function (f, i) {
      return setTimeout(function () {
        return beep(f, 'sawtooth', .25, .2);
      }, i * 200);
    });
  },
  waveStart: function waveStart() {
    beep(330, 'sine', .14, .1);
    setTimeout(function () {
      return beep(440, 'sine', .14, .1);
    }, 160);
    setTimeout(function () {
      return beep(550, 'sine', .18, .12);
    }, 320);
  },
  upgrade: function upgrade() {
    beep(660, 'sine', .1, .1);
    setTimeout(function () {
      return beep(880, 'sine', .12, .12);
    }, 100);
  },
  lose: function lose() {
    beep(200, 'sawtooth', .3, .16);
    setTimeout(function () {
      return beep(140, 'sawtooth', .4, .16);
    }, 300);
  },
  victory: function victory() {
    [440, 550, 660, 880, 1100].forEach(function (f, i) {
      return setTimeout(function () {
        return beep(f, 'sine', .22, .13);
      }, i * 110);
    });
  }
};
document.getElementById('snd-btn').addEventListener('click', function () {
  soundOn = !soundOn;
  if (soundOn) getAudio().resume();
  document.getElementById('snd-btn').textContent = soundOn ? '🔊 som on' : '🔇 som off';
});

// MÚSICA
var musicCtx = null,
  musicNodes = [],
  musicOn = false,
  currentTheme = -1;
function getMCtx() {
  if (!musicCtx) musicCtx = new (window.AudioContext || window.webkitAudioContext)();
  return musicCtx;
}
function stopMusic() {
  for (var _i = 0; _i < musicNodes.length; _i++) {
    try {
      musicNodes[_i].stop();
    } catch (e) {}
  }
  musicNodes = [];
}
var THEMES = [{
  bpm: 58,
  chords: [[261, 329, 392], [294, 370, 440], [261, 329, 415]],
  type: 'sine',
  vol: .055
}, {
  bpm: 52,
  chords: [[392, 494, 587], [349, 440, 523], [330, 415, 494]],
  type: 'sine',
  vol: .065
}, {
  bpm: 48,
  chords: [[261, 329, 392], [246, 311, 370], [261, 311, 392]],
  type: 'triangle',
  vol: .05
}, {
  bpm: 62,
  chords: [[220, 277, 330], [208, 262, 311], [220, 294, 370]],
  type: 'triangle',
  vol: .05
}, {
  bpm: 68,
  chords: [[174, 220, 261], [164, 207, 247], [174, 220, 293]],
  type: 'sawtooth',
  vol: .038
}, {
  bpm: 44,
  chords: [[130, 164, 196], [123, 155, 185], [130, 164, 207]],
  type: 'triangle',
  vol: .055
}, {
  bpm: 50,
  chords: [[261, 329, 392, 523], [294, 370, 440, 587], [246, 311, 370, 494]],
  type: 'sine',
  vol: .075
}];
function playTheme(mapIdx) {
  if (!musicOn) return;
  if (currentTheme === mapIdx) return;
  stopMusic();
  currentTheme = mapIdx;
  var ctx = getMCtx(),
    theme = THEMES[Math.min(mapIdx, THEMES.length - 1)],
    beat = 60 / theme.bpm,
    ni = 0;
  function sched() {
    if (!musicOn || currentTheme !== mapIdx) return;
    var chord = theme.chords[ni % theme.chords.length];
    var master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(theme.vol, ctx.currentTime + .5);
    master.gain.setValueAtTime(theme.vol, ctx.currentTime + beat * 3.2);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + beat * 4.3);
    master.connect(ctx.destination);
    musicNodes.push(master);
    for (var j = 0; j < chord.length; j++) {
      (function (freq, fi) {
        var osc = ctx.createOscillator(),
          g = ctx.createGain();
        osc.type = theme.type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        var lfo = ctx.createOscillator(),
          lg = ctx.createGain();
        lfo.frequency.value = 3.5 + fi * .4;
        lg.gain.value = 1.2;
        lfo.connect(lg);
        lg.connect(osc.frequency);
        lfo.start();
        lfo.stop(ctx.currentTime + beat * 4.6);
        musicNodes.push(lfo);
        g.gain.value = 1 / chord.length;
        osc.connect(g);
        g.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + beat * 4.4);
        musicNodes.push(osc);
      })(chord[j], j);
    }
    ni++;
    setTimeout(sched, beat * 3900);
  }
  sched();
}
function toggleMusic() {
  musicOn = !musicOn;
  var ctx = getMCtx();
  if (musicOn) {
    ctx.resume();
    if (CURMAP != null) playTheme(CURMAP);
  } else {
    stopMusic();
    currentTheme = -1;
  }
  document.getElementById('music-btn').textContent = musicOn ? '🎵 música on' : '🎵 música off';
}