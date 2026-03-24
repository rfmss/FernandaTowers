// === util.js — t2s(), s2t(), shade2(), calcStars(), helpers ===

const t2s=(r,c)=>({x:OX+(c-r)*(TW/2),y:OY+(c+r)*(TH/2)});
const s2t=(px,py)=>({row:Math.floor(((py-OY)/(TH/2)-(px-OX)/(TW/2))/2),col:Math.floor(((py-OY)/(TH/2)+(px-OX)/(TW/2))/2)});

const cv=document.getElementById('canvas');
const cx=cv.getContext('2d');
let W,H,off,offCx;
function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;OX=W/2-(COLS-ROWS)*(TW/4);OY=H/2-(COLS+ROWS)*(TH/4)+TH;rebuildOff();}
window.addEventListener('resize',()=>{if(CURMAP!=null)resize();});
function shade2(hex,d){var n=parseInt(hex.replace('#',''),16);return 'rgb('+Math.min(255,Math.max(0,(n>>16)+d))+','+Math.min(255,Math.max(0,((n>>8)&255)+d))+','+Math.min(255,Math.max(0,(n&255)+d))+')';}
function shade(hex,d){const n=parseInt(hex.replace('#',''),16);return `rgb(${Math.min(255,Math.max(0,(n>>16)+d))},${Math.min(255,Math.max(0,((n>>8)&255)+d))},${Math.min(255,Math.max(0,(n&255)+d))})`;}
function isoTile(c,x,y,top,lft,rgt,sk){const hw=TW/2,hh=TH/2,d=TD;c.lineWidth=.6;c.strokeStyle=sk;c.beginPath();c.moveTo(x,y-hh);c.lineTo(x+hw,y);c.lineTo(x,y+hh);c.lineTo(x-hw,y);c.closePath();c.fillStyle=top;c.fill();c.stroke();c.beginPath();c.moveTo(x-hw,y);c.lineTo(x,y+hh);c.lineTo(x,y+hh+d);c.lineTo(x-hw,y+d);c.closePath();c.fillStyle=lft;c.fill();c.stroke();c.beginPath();c.moveTo(x,y+hh);c.lineTo(x+hw,y);c.lineTo(x+hw,y+d);c.lineTo(x,y+hh+d);c.closePath();c.fillStyle=rgt;c.fill();c.stroke();}
