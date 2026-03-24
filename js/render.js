// === render.js — rebuildOff(), draw*, render() ===

function rebuildOff(){if(!W||!MAP)return;off=document.createElement('canvas');off.width=W;off.height=H;offCx=off.getContext('2d');var pal=(MAPOBJ&&MAPOBJ.palette)||{path:'#2A2318',floor:'#161412',accent:'#D4A017'};for(var ri=0;ri<ROWS;ri++){for(var ci=0;ci<COLS;ci++){var rp=t2s(ri,ci),p=MAP[ri][ci]===1;p?isoTile(offCx,rp.x,rp.y,pal.path,shade(pal.path,-10),shade(pal.path,-18),shade(pal.path,-28)):isoTile(offCx,rp.x,rp.y,pal.floor,shade(pal.floor,-5),shade(pal.floor,-11),shade(pal.floor,-18));}}var lbl=function(r,c,col,t){var lp=t2s(r,c);offCx.fillStyle=col;offCx.font='bold 7px Courier Prime';offCx.textAlign='center';offCx.textBaseline='middle';offCx.fillText(t,lp.x,lp.y-1);};lbl(WP[0][0],WP[0][1],pal.accent||'#D4A017','INÍCIO');lbl(WP[WP.length-1][0],WP[WP.length-1][1],'#F0EDE8','BASE');
  // Draw portrait badge at base
  (function(){
    var last=WP[WP.length-1],lpos=t2s(last[0],last[1]),x=lpos.x,y=lpos.y,r=18;
    var img=document.getElementById('_fernanda_portrait');
    offCx.save();
    offCx.beginPath();offCx.arc(x,y-TH-r,r,0,Math.PI*2);offCx.fillStyle='#0A0908';offCx.fill();
    offCx.beginPath();offCx.arc(x,y-TH-r,r,0,Math.PI*2);offCx.clip();
    if(img&&img.complete){
      var iw=img.naturalWidth||1456,ih=img.naturalHeight||816;
      var sx=iw*0.30,sy=ih*0.05,sw=iw*0.40,sh=ih*0.68;
      offCx.drawImage(img,sx,sy,sw,sh,x-r,y-TH-r*2,r*2,r*2);
    }
    offCx.restore();
    offCx.beginPath();offCx.arc(x,y-TH-r,r,0,Math.PI*2);offCx.strokeStyle='#D4A017';offCx.lineWidth=1.5;offCx.stroke();
  })();}

const towers=[],enemies=[],projs=Array.from({length:140},()=>({active:false})),splash=[];
const queue=[];let wt=0,qc=0,btimer=0;
const BUILD=8;
function buildQueue(groups){queue.length=0;let t=0;for(const g of groups)for(let i=0;i<g.n;i++){queue.push({t:g.t,at:t});t+=g.iv;}queue.sort((a,b)=>a.at-b.at);}
function tickSpawner(dt){if(!S.waveActive)return;wt+=dt;while(qc<queue.length&&queue[qc].at<=wt){spawnEnemy(queue[qc].t);qc++;}if(qc>=queue.length&&enemies.every(e=>!e.active))endWave();}
