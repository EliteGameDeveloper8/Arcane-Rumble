/* STORM ARENA v3 - load with <script src="v3.js"></script> right before </body>, AFTER the v2 script block */
(()=>{
const ptch=(f,r)=>{let s=f.toString();for(const[a,b]of r){if(!s.includes(a))console.warn('v3: patch missed',a);else s=s.replace(a,()=>b)}return(0,eval)('('+s+')')};
// v2 keeps its ray-caster private, so v3 gets its own copy (used by the aim indicator)
const rayR=(ox,oy,dx,dy,L)=>{let b=L;for(const w of Wl){let t0=0,t1=b;
  if(dx){let u=(w.x-ox)/dx,v=(w.x+w.w-ox)/dx;if(u>v){const s=u;u=v;v=s}if(u>t0)t0=u;if(v<t1)t1=v}else if(ox<w.x||ox>w.x+w.w)continue;
  if(dy){let u=(w.y-oy)/dy,v=(w.y+w.h-oy)/dy;if(u>v){const s=u;u=v;v=s}if(u>t0)t0=u;if(v<t1)t1=v}else if(oy<w.y||oy>w.y+w.h)continue;
  if(t0<=t1)b=t0}return b};

// ---------- Enter key joins when the room code is valid (4 chars) ----------
for(const id of['rc','nm'])$(id).addEventListener('keydown',e=>{if(e.key=='Enter'&&st=='menu'&&$('rc').value.trim().length==4)$('bj').click()});

// ---------- lobby: pick / change your wizard while waiting ----------
sendLobby=ptch(sendLobby,[['l:lobby.map(x=>x.n)','l:lobby.map(x=>x.n),k:lobby.map(x=>x.k|0)']]);
drawLobby=ptch(drawLobby,[['d.textContent=x.n','d.textContent=CL[x.k|0].i+" "+x.n+" ("+CL[x.k|0].n+")"']]);
mk=ptch(mk,[["else if(m.t=='i'&&","else if(m.t=='k'){const l=lobby.find(x=>x.conn==c);if(l&&m.k>=0&&m.k<CL.length){l.k=m.k|0;sendLobby()}}else if(m.t=='i'&&"]]);
const c2=document.createElement('div');c2.style.cssText='display:flex;gap:6px;justify-content:center;flex-wrap:wrap';
CL.forEach((c,i)=>{const d=document.createElement('div');d.className='cc';d.style.width='62px';d.innerHTML='<b>'+c.i+'</b>'+c.n;d.onclick=()=>pick(i);c2.appendChild(d)});
const lb=$('lobby'),hint=document.createElement('small');hint.textContent='Pick your wizard (you can change until the game starts)';
lb.insertBefore(hint,$('ls'));lb.insertBefore(c2,$('ls'));lb.style.overflowY='auto';lb.style.justifyContent='safe center';
const p0=pick;pick=function(i){p0(i);[...c2.children].forEach((x,j)=>x.classList.toggle('s',j==i));
  if(st=='lobby'){if(host){lobby[0].k=i;sendLobby()}else if(hc&&hc.open)hc.send({t:'k',k:i})}};pick(cls);

// ---------- countdown before the game starts ----------
const cdE=document.createElement('div');cdE.style.cssText='position:fixed;inset:0;display:none;align-items:center;justify-content:center;font:900 150px system-ui;color:#ffd23f;text-shadow:0 8px 0 #b8860b,0 0 30px #000;pointer-events:none;z-index:20';document.body.appendChild(cdE);
let cdT=0;
window.cdown=(n,done)=>{clearInterval(cdT);let k=n;const t=()=>{if(k<=0){clearInterval(cdT);cdE.style.display='none';done&&done();return}cdE.textContent=k--;cdE.style.display='flex'};t();cdT=setInterval(t,1000)};
const bs2=$('bs').onclick;
$('bs').onclick=()=>{if(!host||st!='lobby'||cdE.style.display=='flex')return;
  if($('s5').value!='1'&&lobby.length<2){bs2();return} // original shows the "need 2 players" message
  bc({t:'c'});cdown(3,bs2)};

// ---------- sync: lobby list, countdown, moving springs / wells ----------
onData=ptch(onData,[["if(m.t=='l'){","if(m.t=='c')cdown(3);else if(m.t=='l'){"],
 ['lobby=m.l.map(n=>({n}))','lobby=m.l.map((n,i)=>({n,k:m.k?m.k[i]:0}))'],
 ['(m.ev||[]).forEach(e=>evFx(...e));','(m.ev||[]).forEach(e=>evFx(...e));(m.sz||[]).forEach((a,i)=>{if(Sz[i]){Sz[i].x=a[0];Sz[i].y=a[1]}});']]);
step=ptch(step,[['ev:EV.splice(0)}','ev:EV.splice(0),sz:Sz.map(z=>[z.x|0,z.y|0])}']]);
const st1=step;step=dt=>{ // springs (heal) and wells (ultimate) glide to a new spot every ~20-35s
  for(const z of Sz){if(z.tx==null){if((z.wt=(z.wt==null?12+Math.random()*18:z.wt)-dt)<=0){const q=fp(C,C,A-420);z.tx=q.x;z.ty=q.y}}
    else{const d=Math.hypot(z.tx-z.x,z.ty-z.y);if(d<6){z.tx=null;z.wt=20+Math.random()*15}else{z.x+=(z.tx-z.x)/d*110*dt;z.y+=(z.ty-z.y)/d*110*dt}}}
  st1(dt)};

// ---------- zones / pads stay visible on top of dark roofs ----------
function zTop(m){if(!Bd.length)return;const mb=bi(m);g.save();g.beginPath();Bd.forEach((q,k)=>{if(k!=mb)g.rect(q.x+22,q.y+22,q.w-44,q.h-44)});g.clip();g.textAlign='center';
  for(const z of Sz){const sp=z.k=='spring';g.globalAlpha=.8;g.fillStyle=sp?'#3fc7e8':'#8a5cff';g.strokeStyle=sp?'#bff4ff':'#e0ccff';g.lineWidth=4;g.beginPath();g.arc(z.x,z.y,z.r,0,7);g.fill();g.stroke();g.globalAlpha=1;g.font='26px sans-serif';g.fillStyle='#fff';g.fillText(sp?'\u{1F4A7}':'\u{1F52E}',z.x,z.y+9)}
  for(const z of Zn){const fr=z.T?z.t/z.T:z.f,c=z.k=='met'?'255,70,40':({fire:'255,140,40',frost:'140,220,255',heal:'90,255,140'})[z.k]||'255,255,255';
    g.fillStyle='rgba('+c+',.45)';g.strokeStyle='rgba('+c+',1)';g.lineWidth=4;g.beginPath();g.arc(z.x,z.y,z.k=='met'?z.r:z.r*Math.min(1,fr/.15),0,7);g.fill();g.stroke()}
  g.restore()}
const r1=window.roofs;window.roofs=m=>{r1(m);zTop(m)};

// ---------- map: no brown road grid, distinct biomes ----------
streets=()=>{};
const BT=[['#d9c27a','#c4ab5f','d'],['#e3eef3','#c5d9e3','s'],['#2f4a3c','#243d31','w'],['#7fb04f','#69983f','m']]; // desert, snow, swamp, lush meadow
window.Bm=[];
const w3=world;world=s=>{w3(s);const r=rng(s^0x9e37);Bm=[];
  for(let i=0;i<8;i++){const a=r()*6.283,q=Math.sqrt(r())*(A-550),b={x:C+Math.cos(a)*q,y:C+Math.sin(a)*q,t:i%4,cs:[],dc:[]},R0=260+r()*260;
    for(let j=0;j<6;j++){const aa=r()*6.283,d=r()*R0*.6;b.cs.push([Math.cos(aa)*d,Math.sin(aa)*d,R0*(.45+r()*.35)])}
    for(let j=0;j<16;j++){const c=b.cs[j%6],aa=r()*6.283,d=r()*c[2]*.8;b.dc.push([c[0]+Math.cos(aa)*d,c[1]+Math.sin(aa)*d])}
    Bm.push(b)}
  Dc=Dc.filter(d=>!Bm.some(b=>b.t<3&&b.cs.some(c=>Math.hypot(d.x-b.x-c[0],d.y-b.y-c[1])<c[2])))}; // no flowers in sand / snow / swamp
const pt1=window.patches;window.patches=()=>{pt1();
  for(const b of Bm){const[f,e,k]=BT[b.t];
    for(const[ex,col]of[[14,e],[0,f]]){g.fillStyle=col;g.beginPath();for(const[dx,dy,rr]of b.cs){g.moveTo(b.x+dx+rr+ex,b.y+dy);g.arc(b.x+dx,b.y+dy,rr+ex,0,7)}g.fill()}
    for(const[dx,dy]of b.dc){const x=b.x+dx,y=b.y+dy;
      if(k=='d'){g.strokeStyle='#b49a4e';g.lineWidth=4;g.beginPath();g.arc(x,y,16,3.4,6);g.stroke()}
      else if(k=='s'){g.fillStyle='#fff';g.beginPath();g.arc(x,y,6,0,7);g.fill()}
      else if(k=='w'){g.fillStyle='#1d3a52';g.beginPath();g.ellipse(x,y,24,11,0,0,7);g.fill()}
      else{g.fillStyle='#ffe27a';g.beginPath();g.arc(x,y,5,0,7);g.fill()}}}};

// ---------- minimap: only players you can actually see (no "just shot" reveal across the map) ----------
let flash=0,DE=[],lt3=performance.now();
const ov1=window.ov;window.ov=(m,w,h)=>{const s=P.map(p=>p.fl|0);P.forEach(p=>p.fl=(p.fl|0)&~16);ov1(m,w,h);P.forEach((p,i)=>p.fl=s[i]);
  if(flash>0){g.fillStyle='rgba(255,255,255,'+Math.min(.7,flash)+')';g.fillRect(0,0,w,h)}};

// ---------- aim indicator: shows the lane your shot will travel (width = hit size, length = range, stops at walls) ----------
function aimI(){const q=P[me];if(!q||q.hp<=0||st!='play')return;
  const c=CL[q.cl],a=input().a,dx=Math.cos(a),dy=Math.sin(a),R0=c.bs*c.bt,L=Math.min(R0,rayR(q.x,q.y,dx,dy,R0)),f=mouse.d||(tch.a&&Math.hypot(tch.ax,tch.ay)>.15);
  g.save();g.translate(q.x,q.y);g.rotate(a);const gr=g.createLinearGradient(0,0,L,0);gr.addColorStop(0,c.sc+(f?'99':'55'));gr.addColorStop(1,c.sc+'00');
  g.fillStyle=gr;g.fillRect(26,-22,Math.max(0,L-26),44);g.strokeStyle=c.sc+'aa';g.lineWidth=2;g.setLineDash([10,8]);
  g.beginPath();g.moveTo(26,-22);g.lineTo(L,-22);g.moveTo(26,22);g.lineTo(L,22);g.stroke();g.restore()}

// ---------- big death effect + delayed end screen so you can see the final KO ----------
function deathUpd(dt){
  const m=P[me]&&P[me].hp>0?P[me]:P.find(p=>p.hp>0)||P[me]||{x:C,y:C};
  for(const p of P){const al=p.hp>0;if(p._D==null)p._D=al;
    if(p._D&&!al&&(st!='play'||p===P[me]||seen(p,m))){const x=p.x,y=p.y,c=COLS[p.c&7];
      DE.push({k:'r',x,y,R:260,t:.9,l:.9,c},{k:'r',x,y,R:150,t:.7,l:.7,c:'#fff'},{k:'f',x,y,t:.25,l:.25},{k:'s',x,y,t:1.8,l:1.8});
      for(let n=0;n<34;n++){const a=Math.random()*6.283,v=120+Math.random()*420;DE.push({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:.9,l:.9,c:n%3?c:'#fff',r:5+Math.random()*6})}
      if(p===P[me]||st!='play')flash=.5}
    p._D=al}
  for(const f of DE){f.t-=dt;f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt}DE=DE.filter(f=>f.t>0);flash=Math.max(0,flash-dt*1.2)}
function deathFx(){for(const f of DE){const k=f.t/f.l;g.globalAlpha=Math.min(1,k*1.5);
  if(f.k=='r'){g.strokeStyle=f.c;g.lineWidth=3+10*k;g.beginPath();g.arc(f.x,f.y,f.R*(1-k)+10,0,7);g.stroke()}
  else if(f.k=='f'){g.fillStyle='#fff';g.beginPath();g.arc(f.x,f.y,70*(1-k)+30,0,7);g.fill()}
  else if(f.k=='p'){g.fillStyle=f.c;g.beginPath();g.arc(f.x,f.y,f.r*k+1,0,7);g.fill()}
  else{g.font='bold 46px sans-serif';g.textAlign='center';g.fillText('\u{1F480}',f.x,f.y-60*(1-k))}}
  g.globalAlpha=1}
const dfx=window.drawFx;window.drawFx=()=>{aimI();dfx();deathFx()};
const d3=draw;draw=()=>{const n=performance.now();deathUpd(Math.min(.05,(n-lt3)/1000));lt3=n;
  if(st=='play'&&cdE.style.display=='flex'){clearInterval(cdT);cdE.style.display='none'}d3()};
const f1=finish;finish=w=>{const was=st=='play';f1(w);if(was){show(null);setTimeout(()=>{if(st=='over')show('end')},1800)}};
})();
