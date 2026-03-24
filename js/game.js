// === game.js — spawn, update, wave, loop, victory, gameOver ===

function spawnEnemy(type,wiOverride,xOverride,yOverride){const d=EDEFS[type];enemies.push({active:true,type,hp:d.hp,mhp:d.hp,spd:d.spd,reward:d.reward,col:d.col,r:d.r,split:d.split,fly:d.fly,isBoss:d.isBoss||false,wi:wiOverride||0,prog:0,x:xOverride||0,y:yOverride||0,slow:1,slowt:0,destX:0,destY:0});}
let bossEnemy=null;
function startWave(){
  S.waveIdx++;if(S.waveIdx>=WAVES.length){victory();return;}
  S.waveActive=true;S.buildPhase=false;wt=0;qc=0;buildQueue(WAVES[S.waveIdx]);
  const isBW=WAVES[S.waveIdx].some(g=>g.t==='amelia');
  const bi=MAPOBJ.banners[S.waveIdx]||{ceremony:`ONDA ${S.waveIdx+1}`,quote:''};
  if(isBW){showBossBanner();SFX.boss();}else{showBanner(S.waveIdx+1,bi);setPhase(`ONDA ${String(S.waveIdx+1).padStart(2,'0')}`);SFX.waveStart();}
  setStatus('');hud();
}
function endWave(){S.waveActive=false;S.buildPhase=true;btimer=0;bossEnemy=null;hideBossHpBar();if(S.waveIdx+1<WAVES.length){S.gold+=30;floaty(W/2,H/2-60,'+30 prestígio','#D4A017');setPhase('FASE DE CAMPANHA');hud();}else{victory();}}
function tickBuild(dt){if(!S.buildPhase||S.waveIdx>=WAVES.length-1)return;btimer+=dt;const rem=Math.ceil(BUILD-btimer);setStatus(`campanha — próxima onda em ${rem}s  [espaço]`);if(btimer>=BUILD)startWave();}

let baseX=0,baseY=0;
function updateBasePos(){if(!WP)return;const last=WP[WP.length-1];const p=t2s(last[0],last[1]);baseX=p.x;baseY=p.y-TH/4;}
function updEnemies(dt){
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i];if(!e.active)continue;
    if(e.slowt>0)e.slowt-=dt;else e.slow=1;
    const spd=e.spd*e.slow;
    if(e.isBoss){bossEnemy=e;showBossHpBar(e.hp/e.mhp);}
    if(e.fly){
      if(e.destX===0&&e.destY===0){const sp=t2s(WP[0][0],WP[0][1]);e.x=sp.x;e.y=sp.y-TH/4;e.destX=baseX;e.destY=baseY;}
      const dx=e.destX-e.x,dy=e.destY-e.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<spd*TW*dt+4){e.active=false;S.lives=Math.max(0,S.lives-1);flashLivesLost();hud();if(S.lives<=0)gameOver();}
      else{e.x+=dx/dist*spd*TW*dt;e.y+=dy/dist*spd*TW*dt;}
      continue;
    }
    const ni=e.wi+1;if(ni>=WP.length){e.active=false;S.lives=Math.max(0,S.lives-1);flashLivesLost();hud();if(S.lives<=0)gameOver();continue;}
    e.prog+=spd*dt;if(e.prog>=1){e.prog-=1;e.wi++;}
    const[r0,c0]=WP[e.wi],[r1,c1]=WP[Math.min(e.wi+1,WP.length-1)];
    const p0=t2s(r0,c0),p1=t2s(r1,c1);e.x=p0.x+(p1.x-p0.x)*e.prog;e.y=p0.y+(p1.y-p0.y)*e.prog-TH/4;
  }
}
function updTowers(dt){
  for(const t of towers){
    t.cd=Math.max(0,(t.cd||0)-dt);if(t.cd>0)continue;
    const base=TDEFS[t.type],st=towerStats(t),rpx=st.range*TW*.85;
    let best=null,bs=-1;
    for(const e of enemies){if(!e.active)continue;const dx=e.x-t.sx,dy=e.y-t.sy;if(Math.sqrt(dx*dx+dy*dy)>rpx)continue;const score=e.fly?(WP.length+10):(e.isBoss?WP.length+5:e.wi+e.prog);if(score>bs){bs=score;best=e;}}
    if(!best)continue;t.cd=1/st.rate;
    const slot=projs.find(p=>!p.active);if(!slot)continue;
    base.sfx();Object.assign(slot,{active:true,x:t.sx,y:t.sy-14,tgt:best,spd:300,dmg:st.dmg,splash:base.splash,slow:base.slow,col:base.pcol,sz:base.psz});
  }
}
function updProjs(dt){for(const p of projs){if(!p.active)continue;if(!p.tgt.active){p.active=false;continue;}const dx=p.tgt.x-p.x,dy=p.tgt.y-p.y,d=Math.sqrt(dx*dx+dy*dy);if(d<p.spd*dt+5){hitP(p);p.active=false;}else{p.x+=dx/d*p.spd*dt;p.y+=dy/d*p.spd*dt;}}}
function hitP(p){SFX.hit();if(p.splash>0){for(const e of enemies){if(!e.active)continue;const dx=e.x-p.tgt.x,dy=e.y-p.tgt.y;if(Math.sqrt(dx*dx+dy*dy)<=p.splash)dmgE(e,p.dmg,p.slow);}splash.push({x:p.tgt.x,y:p.tgt.y,mr:p.splash,t:0,dur:.38});}else{dmgE(p.tgt,p.dmg,p.slow);}}
function dmgE(e,d,slow){e.hp-=d;if(slow<1){e.slow=slow;e.slowt=2.2;}if(e.hp<=0)killEnemy(e);}
function killEnemy(e){SFX.death();if(e.split){for(let i=0;i<2;i++){spawnEnemy('academico',e.wi,e.x+(i*8-4),e.y);const mini=enemies[enemies.length-1];mini.hp=40;mini.mhp=40;mini.r=4;mini.spd=1.4;mini.reward=5;mini.x=e.x+(i*8-4);mini.y=e.y;mini.prog=e.prog;}}if(e.isBoss){bossEnemy=null;hideBossHpBar();}e.active=false;S.gold+=e.reward;S.score+=e.reward*10;floaty(e.x,e.y-14,`+${e.reward}`,'#D4A017');hud();}

function drawTower(t){
  const def=TDEFS[t.type];const{x,y}=t2s(t.row,t.col);t.sx=x;t.sy=y;
  const lv=t.level||1,st=towerStats(t),bw=14+lv*2,bh=15+lv*2,d=7+lv;
  const sel=S.selTower===t;
  cx.beginPath();cx.arc(x,y-TH/4,st.range*TW*.85,0,Math.PI*2);
  cx.strokeStyle=sel?(t.type==='critica'?'rgba(91,170,200,.35)':'rgba(212,160,23,.28)'):(t.type==='critica'?'rgba(91,170,200,.07)':'rgba(212,160,23,.04)');
  cx.lineWidth=sel?1.5:1;cx.stroke();
  if(sel){cx.fillStyle=t.type==='critica'?'rgba(91,170,200,.04)':'rgba(212,160,23,.03)';cx.fill();}
  const lvB=(lv-1)*16,top=shade(def.col,lvB),lft=shade(def.col,-20+lvB),rgt=shade(def.col,-10+lvB),sk=shade(def.col,-38);
  cx.lineWidth=.9;cx.strokeStyle=sk;
  cx.beginPath();cx.moveTo(x,y-bh-bw/2);cx.lineTo(x+bw,y-bh);cx.lineTo(x,y-bh+bw/2);cx.lineTo(x-bw,y-bh);cx.closePath();cx.fillStyle=top;cx.fill();cx.stroke();
  cx.beginPath();cx.moveTo(x-bw,y-bh);cx.lineTo(x,y-bh+bw/2);cx.lineTo(x,y-bh+bw/2+d);cx.lineTo(x-bw,y-bh+d);cx.closePath();cx.fillStyle=lft;cx.fill();cx.stroke();
  cx.beginPath();cx.moveTo(x,y-bh+bw/2);cx.lineTo(x+bw,y-bh);cx.lineTo(x+bw,y-bh+d);cx.lineTo(x,y-bh+bw/2+d);cx.closePath();cx.fillStyle=rgt;cx.fill();cx.stroke();
  if(t.type==='sonia'){cx.beginPath();cx.moveTo(x,y-bh-bw/2-1);cx.lineTo(x+1.5,y-bh-bw/2-10-lv*2);cx.lineTo(x-1.5,y-bh-bw/2-10-lv*2);cx.closePath();cx.fillStyle=def.acc;cx.fill();}
  else if(t.type==='publico'){cx.beginPath();cx.arc(x,y-bh-bw/2+2,4+lv,0,Math.PI*2);cx.fillStyle=def.acc;cx.fill();cx.beginPath();cx.arc(x,y-bh-bw/2+2,2+lv*.5,0,Math.PI*2);cx.fillStyle='#060402';cx.fill();}
  else{cx.beginPath();cx.moveTo(x,y-bh-bw/2-12-lv*2);cx.lineTo(x+3+lv,y-bh-bw/2-3);cx.lineTo(x-3-lv,y-bh-bw/2-3);cx.closePath();cx.fillStyle=def.acc;cx.fill();}
  const ps=6,pw=4,py2=y+TH/4+6,tw2=lv*ps;for(let i=0;i<lv;i++){const px=x-tw2/2+i*ps+pw/2;cx.fillStyle=def.acc;cx.fillRect(px-pw/2,py2,pw,pw);}
  if(sel){cx.beginPath();cx.moveTo(x,y-bh-bw/2-2);cx.lineTo(x+bw+2,y-bh-1);cx.lineTo(x,y-bh+bw/2+2);cx.lineTo(x-bw-2,y-bh-1);cx.closePath();cx.strokeStyle='rgba(212,160,23,.6)';cx.lineWidth=1.2;cx.stroke();}
}
function drawEnemy(e){
  if(e.fly){cx.beginPath();cx.ellipse(e.x-e.r*1.2,e.y-2,e.r*1.0,e.r*.35,Math.PI*.15,0,Math.PI*2);cx.fillStyle='rgba(74,56,160,.4)';cx.fill();cx.beginPath();cx.ellipse(e.x+e.r*1.2,e.y-2,e.r*1.0,e.r*.35,-Math.PI*.15,0,Math.PI*2);cx.fillStyle='rgba(74,56,160,.4)';cx.fill();}
  if(e.isBoss){const pulse=.7+.3*Math.sin(Date.now()*.004);cx.beginPath();cx.arc(e.x,e.y,e.r*1.8*pulse,0,Math.PI*2);cx.fillStyle='rgba(123,47,190,.1)';cx.fill();cx.beginPath();cx.arc(e.x,e.y,e.r*1.4,0,Math.PI*2);cx.strokeStyle='rgba(200,160,255,.35)';cx.lineWidth=2;cx.stroke();}
  cx.beginPath();cx.ellipse(e.x,e.y+e.r+(e.fly?-2:1),e.r*.85,e.r*(e.fly?.12:.28),0,0,Math.PI*2);cx.fillStyle='rgba(0,0,0,.22)';cx.fill();
  cx.beginPath();cx.arc(e.x,e.y,e.r,0,Math.PI*2);cx.fillStyle=e.slow<1?'#5BAAC8':e.col;cx.fill();cx.strokeStyle=shade(e.col,-28);cx.lineWidth=e.isBoss?2.5:1.5;cx.stroke();
  cx.beginPath();cx.arc(e.x,e.y,e.r*.36,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,.16)';cx.fill();
  if(e.split){cx.beginPath();cx.arc(e.x,e.y,e.r+2,0,Math.PI*2);cx.strokeStyle='rgba(160,80,0,.4)';cx.lineWidth=1;cx.setLineDash([3,3]);cx.stroke();cx.setLineDash([]);}
  const bw=e.r*2.8*(e.isBoss?1.8:1),bh=3,bx=e.x-bw/2,by=e.y-e.r-8;
  cx.fillStyle='rgba(0,0,0,.28)';cx.fillRect(bx,by,bw,bh);
  const pct=e.hp/e.mhp;cx.fillStyle=e.isBoss?'#9B4FEE':(pct>.5?'#4CAF50':pct>.25?'#FF9800':'#C8200A');cx.fillRect(bx,by,bw*pct,bh);
}
function drawProj(p){cx.beginPath();cx.arc(p.x,p.y,p.sz/2,0,Math.PI*2);cx.fillStyle=p.col;cx.fill();cx.beginPath();cx.arc(p.x,p.y,p.sz,0,Math.PI*2);cx.fillStyle=p.col+'28';cx.fill();}
function updSplash(dt){for(let i=splash.length-1;i>=0;i--){const s=splash[i];s.t+=dt;if(s.t>=s.dur){splash.splice(i,1);continue;}const p=s.t/s.dur,r=s.mr*p;cx.beginPath();cx.arc(s.x,s.y,r,0,Math.PI*2);cx.strokeStyle=`rgba(212,160,23,${.5*(1-p)})`;cx.lineWidth=2;cx.stroke();}}

let hov=null;
function setHov(px,py){const t=s2t(px,py);hov=(t.row>=0&&t.row<ROWS&&t.col>=0&&t.col<COLS)?t:null;}
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();setHov(e.clientX-r.left,e.clientY-r.top);});
cv.addEventListener('mouseleave',()=>hov=null);
let touchMoved=false;
cv.addEventListener('touchstart',e=>{e.preventDefault();touchMoved=false;const t=e.touches[0],r=cv.getBoundingClientRect();setHov(t.clientX-r.left,t.clientY-r.top);},{passive:false});
cv.addEventListener('touchmove',e=>{e.preventDefault();touchMoved=true;const t=e.touches[0],r=cv.getBoundingClientRect();setHov(t.clientX-r.left,t.clientY-r.top);},{passive:false});
cv.addEventListener('touchend',e=>{e.preventDefault();if(!touchMoved){const t=e.changedTouches[0],r=cv.getBoundingClientRect();handleTap(t.clientX-r.left,t.clientY-r.top);}},{passive:false});
function drawHov(){if(!hov||!S.selType)return;const{row,col}=hov,{x,y}=t2s(row,col),hw=TW/2,hh=TH/2;const isp=MAP[row][col]===1,occ=towers.some(t=>t.row===row&&t.col===col);const def=TDEFS[S.selType],ok=!isp&&!occ&&S.gold>=def.cost;cx.beginPath();cx.moveTo(x,y-hh);cx.lineTo(x+hw,y);cx.lineTo(x,y+hh);cx.lineTo(x-hw,y);cx.closePath();cx.strokeStyle=ok?'rgba(212,160,23,.8)':'rgba(120,110,100,.3)';cx.lineWidth=1.5;cx.stroke();cx.fillStyle=ok?'rgba(212,160,23,.06)':'rgba(0,0,0,.02)';cx.fill();}

function handleTap(px,py){
  if(S.gameOver)return;const{row,col}=s2t(px,py);if(row<0||row>=ROWS||col<0||col>=COLS)return;
  const existing=towers.find(t=>t.row===row&&t.col===col);
  if(existing){S.selTower=existing;S.selType=null;refreshPanel();showUpgradePanel(existing);return;}
  if(!S.selType||MAP[row][col]===1){S.selTower=null;hideUpgradePanel();return;}
  const def=TDEFS[S.selType];if(S.gold<def.cost){floaty(px,py-20,'SEM PRESTÍGIO','#555');return;}
  S.gold-=def.cost;towers.push({row,col,type:S.selType,cd:0,sx:0,sy:0,level:1});S.selTower=null;hideUpgradePanel();hud();
}
cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect();handleTap(e.clientX-r.left,e.clientY-r.top);});

document.querySelectorAll('.tower-btn').forEach(b=>{
  b.addEventListener('click',()=>{S.selType=b.dataset.type;S.selTower=null;hideUpgradePanel();refreshPanel();});
  b.addEventListener('touchstart',e=>{e.stopPropagation();S.selType=b.dataset.type;S.selTower=null;hideUpgradePanel();refreshPanel();},{passive:true});
});
document.getElementById('btn-cancel').addEventListener('click',()=>{S.selType=null;refreshPanel();});
function refreshPanel(){document.querySelectorAll('.tower-btn').forEach(b=>{const def=TDEFS[b.dataset.type];b.classList.toggle('active',b.dataset.type===S.selType);b.classList.toggle('cant-afford',S.gold<def.cost);});}
function showUpgradePanel(t){const lv=t.level||1,st=towerStats(t),cost=towerUpgradeCost(t),def=TDEFS[t.type];document.getElementById('up-type').textContent=def.label;document.getElementById('up-level').innerHTML=`NVL <em>${lv}</em> / 3`;const maxSt=towerStats({type:t.type,level:3});document.getElementById('up-dmg').textContent=st.dmg;document.getElementById('up-dmg-bar').style.width=`${(st.dmg/maxSt.dmg)*100}%`;document.getElementById('up-rng').textContent=st.range;document.getElementById('up-rng-bar').style.width=`${(st.range/maxSt.range)*100}%`;document.getElementById('up-rate').textContent=`${st.rate}/s`;document.getElementById('up-rate-bar').style.width=`${(st.rate/maxSt.rate)*100}%`;const btn=document.getElementById('up-btn');if(!cost){btn.textContent='NÍVEL MÁXIMO';btn.disabled=true;}else if(S.gold<cost){btn.textContent=`Fortalecer ◆ ${cost}`;btn.disabled=true;}else{btn.textContent=`Fortalecer ◆ ${cost}`;btn.disabled=false;}document.getElementById('upgrade-panel').classList.add('show');}
function hideUpgradePanel(){document.getElementById('upgrade-panel').classList.remove('show');S.selTower=null;}
document.getElementById('up-btn').addEventListener('click',()=>{const t=S.selTower;if(!t)return;const cost=towerUpgradeCost(t);if(!cost||S.gold<cost)return;S.gold-=cost;t.level=(t.level||1)+1;S.score+=50;SFX.upgrade();floaty(t.sx,t.sy-20,`NVL ${t.level}!`,'#D4A017');showUpgradePanel(t);hud();});
document.getElementById('up-close').addEventListener('click',hideUpgradePanel);
document.addEventListener('keydown',e=>{if(e.key==='1'){S.selType='sonia';S.selTower=null;hideUpgradePanel();refreshPanel();}if(e.key==='2'){S.selType='publico';S.selTower=null;hideUpgradePanel();refreshPanel();}if(e.key==='3'){S.selType='critica';S.selTower=null;hideUpgradePanel();refreshPanel();}if(e.key==='Escape'){S.selType=null;S.selTower=null;hideUpgradePanel();refreshPanel();}if(e.key===' '&&S.buildPhase&&!S.gameOver){e.preventDefault();startWave();}});

function hud(){document.getElementById('h-gold').innerHTML=`<em>${S.gold}</em>`;document.getElementById('h-lives').textContent=S.lives;document.getElementById('h-score').textContent=S.score;const wi=S.waveIdx+1;document.getElementById('h-wave').innerHTML=wi<=0?'—':`${String(wi).padStart(2,'0')}<span style="font-size:11px;color:var(--muted)"> /${String(WAVES.length).padStart(2,'0')}</span>`;refreshPanel();if(S.selTower)showUpgradePanel(S.selTower);}
function setPhase(t){document.getElementById('h-phase').textContent=t;}
function setStatus(t){document.getElementById('s-wave').textContent=t;}
function showBanner(n,bi){const el=document.getElementById('wave-banner');document.getElementById('wb-ceremony').textContent=bi.ceremony||`ONDA ${n}`;document.getElementById('wb-num').textContent=String(n).padStart(2,'0');document.getElementById('wb-quote').textContent=bi.quote||'';el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800);}
function showBossBanner(){const el=document.getElementById('boss-banner');el.classList.add('show');setPhase('BOSS — AMÉLIA PÉREZ');setTimeout(()=>el.classList.remove('show'),3200);}
function showBossHpBar(pct){document.getElementById('boss-hpbar-wrap').classList.add('show');document.getElementById('boss-hpbar-fill').style.width=`${Math.max(0,pct*100)}%`;}
function hideBossHpBar(){document.getElementById('boss-hpbar-wrap').classList.remove('show');}
function floaty(x,y,txt,col){const el=document.createElement('div');el.className='floaty';el.textContent=txt;el.style.cssText=`left:${x}px;top:${y}px;color:${col}`;document.body.appendChild(el);setTimeout(()=>el.remove(),920);}
function gameOver(){S.gameOver=true;setPhase('FIM');SFX.lose();overlay('FIM DE JOGO','Pontução: '+S.score,'O cinema brasileiro resistiu até onde pôde.',false,0);}
function victory(){
  S.gameOver=true;setPhase('VITÓRIA');SFX.victory();
  var stars=saveResult(CURMAP,S.score,S.lives);
  var isOscar=CURMAP===6,starStr='',i;
  for(i=1;i<=3;i++) starStr+=(i<=stars?'★':'☆')+' ';
  var msgs=['','Boa campanha!','Excelente defesa!','Perfeita!'];
  var baseMsg=isOscar
    ?'"Ela perdeu tudo. E ficou de pé."\n— Salter Walles, 2025\n\nPara Fernanda Towers e Fernanda Montanha.\nDuas mulheres que resistiram.'
    :'O cinema brasileiro avança para a próxima cerimônia.';
  overlay(
    isOscar?'O DOURADO É NOSSO':'VITÓRIA',
    'Pontuação: '+S.score,
    baseMsg+'\n'+starStr+msgs[stars],
    isOscar,stars
  );
}
function overlay(title,sub,msg,isGolden,stars){
  var el=document.createElement('div');
  el.style.cssText='position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(8,7,6,.93);font-family:"Courier Prime",monospace;padding:20px;text-align:center;';
  var sr='',mh='',i,ln;
  if(stars&&stars>0){
    var sh='';
    for(i=1;i<=3;i++) sh+='<span style="font-size:26px;color:'+(i<=stars?'#D4A017':'#282420')+';text-shadow:'+(i<=stars?'0 0 8px rgba(212,160,23,.6)':'none')+'">★</span>';
    sr='<div style="margin-bottom:14px;">'+sh+'</div>';
  }
  var lines=(msg||'').split('\n');
  for(i=0;i<lines.length;i++){
    ln=lines[i];
    mh+=ln?'<div style="font-size:11px;color:#6A6560;margin-top:6px;letter-spacing:.06em;max-width:320px;">'+ln+'</div>':'<div style="height:5px"></div>';
  }
  el.innerHTML=(
    sr+
    '<div style="font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:#D4A017;margin-bottom:10px;">Fernanda Towers</div>'+
    '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(36px,7vw,68px);color:#F0EDE8;letter-spacing:.08em;line-height:1;">'+title+'</div>'+
    '<div style="font-size:12px;color:#6A6560;margin-top:10px;letter-spacing:.15em;">'+sub+'</div>'+
    mh+
    '<div style="display:flex;gap:10px;margin-top:22px;">'+
      '<div style="font-size:9px;letter-spacing:.2em;color:#6A6560;border:1px solid #2A2820;padding:8px 16px;cursor:pointer;" onmouseover="this.style.color=\'#F0EDE8\'" onmouseout="this.style.color=\'#6A6560\'" onclick="location.reload()">[ REINICIAR ]</div>'+
      '<div style="font-size:9px;letter-spacing:.2em;color:#6A6560;border:1px solid #2A2820;padding:8px 16px;cursor:pointer;" onmouseover="this.style.color=\'#F0EDE8\'" onmouseout="this.style.color=\'#6A6560\'" onclick="backToMaps()">[ MAPAS ]</div>'+
    '</div>'
  );
  document.body.appendChild(el);
}

function miniTower(c,x,y,col,acc,type){const bw=10,bh=12,d=5,sk=shade(col,-35);c.strokeStyle=sk;c.lineWidth=.8;c.beginPath();c.moveTo(x,y-bh-bw/2);c.lineTo(x+bw,y-bh);c.lineTo(x,y-bh+bw/2);c.lineTo(x-bw,y-bh);c.closePath();c.fillStyle=col;c.fill();c.stroke();c.beginPath();c.moveTo(x-bw,y-bh);c.lineTo(x,y-bh+bw/2);c.lineTo(x,y-bh+bw/2+d);c.lineTo(x-bw,y-bh+d);c.closePath();c.fillStyle=shade(col,-18);c.fill();c.stroke();c.beginPath();c.moveTo(x,y-bh+bw/2);c.lineTo(x+bw,y-bh);c.lineTo(x+bw,y-bh+d);c.lineTo(x,y-bh+bw/2+d);c.closePath();c.fillStyle=shade(col,-8);c.fill();c.stroke();if(type==='sonia'){c.beginPath();c.moveTo(x,y-bh-bw/2-1);c.lineTo(x+1,y-bh-bw/2-7);c.lineTo(x-1,y-bh-bw/2-7);c.closePath();c.fillStyle=acc;c.fill();}else if(type==='publico'){c.beginPath();c.arc(x,y-bh-bw/2+1,3.5,0,Math.PI*2);c.fillStyle=acc;c.fill();c.beginPath();c.arc(x,y-bh-bw/2+1,1.5,0,Math.PI*2);c.fillStyle='#060402';c.fill();}else{c.beginPath();c.moveTo(x,y-bh-bw/2-9);c.lineTo(x+3,y-bh-bw/2-2);c.lineTo(x-3,y-bh-bw/2-2);c.closePath();c.fillStyle=acc;c.fill();}}
function drawIcons(){[['icon-sonia','#2A2018','#D4A017','sonia'],['icon-publico','#1A1210','#C8200A','publico'],['icon-critica','#0A1820','#5BAAC8','critica']].forEach(([id,col,acc,t])=>{miniTower(document.getElementById(id).getContext('2d'),18,30,col,acc,t);});}

function drawMapPreview(mapIdx,canvasId){const m=MAPS[mapIdx];const c=document.getElementById(canvasId);const ctx=c.getContext('2d');const cw=c.width,ch=c.height;const rows=m.grid.length,cols=m.grid[0].length;const tw=14,th=7;const ox=cw/2-(cols-rows)*(tw/4);const oy=ch/2-(cols+rows)*(th/4)+th;ctx.clearRect(0,0,cw,ch);for(let r=0;r<rows;r++)for(let cc=0;cc<cols;cc++){const x=ox+(cc-r)*(tw/2),y=oy+(cc+r)*(th/2);const p=m.grid[r][cc]===1;ctx.beginPath();ctx.moveTo(x,y-th/2);ctx.lineTo(x+tw/2,y);ctx.lineTo(x,y+th/2);ctx.lineTo(x-tw/2,y);ctx.closePath();var pv=m.palette||{path:'#3A3020',floor:'#1A1816'};ctx.fillStyle=p?pv.path:pv.floor;ctx.fill();ctx.strokeStyle=p?shade2(pv.path,12):shade2(pv.floor,8);ctx.lineWidth=.5;ctx.stroke();}const sp=m.wp[0];const sx=ox+(sp[1]-sp[0])*(tw/2),sy=oy+(sp[1]+sp[0])*(th/2);ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fillStyle='#D4A017';ctx.fill();}
