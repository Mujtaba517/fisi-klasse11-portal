/* Seam-free deformation of one shared texture; no cut-out arms or limbs. */
(function(){
'use strict';
let current=null;
const VS=`
attribute vec2 aPosition;
uniform float uTime;
uniform float uAction;
uniform float uProgress;
uniform float uReduced;
uniform vec2 uFit;
varying vec2 vUV;
vec2 turn(vec2 p,vec2 c,float a){float s=sin(a),co=cos(a);vec2 d=p-c;return c+vec2(d.x*co-d.y*s,d.x*s+d.y*co);}
void main(){
 vec2 original=aPosition*vec2(1199.,1312.);vec2 p=original;vUV=aPosition;
 float t=uTime;float env=sin(clamp(uProgress,0.,1.)*3.14159265);env*=env;
 float active=step(.5,uAction)*env;float wave=1.-step(1.5,uAction);float dance=step(1.5,uAction)*(1.-step(2.5,uAction));float hop=step(2.5,uAction)*(1.-step(3.5,uAction));float twist=step(3.5,uAction);
 float idleWave=pow(max(0.,sin(t*.82)),5.)*.10;
 float shoulder=idleWave*sin(t*5.)+active*(wave*.20*sin(t*9.)+dance*.28*sin(t*6.)+twist*.25*sin(t*7.));
 float elbow=idleWave*sin(t*5.+.4)+active*(wave*.28*sin(t*11.)+dance*.32*sin(t*6.+.8)+twist*.28*sin(t*8.));
 vec2 armPoint=(original-vec2(911.,658.))/vec2(112.,154.);
 float armArea=1.-smoothstep(.55,1.15,length(armPoint));
 float protectFace=smoothstep(822.,890.,original.x);
 float armWeight=armArea*protectFace;
 vec2 arm=turn(original,vec2(842.,757.),shoulder);
 float fore=(1.-smoothstep(650.,740.,original.y))*smoothstep(848.,910.,original.x);
 arm=mix(arm,turn(arm,vec2(900.,699.),elbow),fore);
 p+= (arm-original)*armWeight;
 // The book-holding paw has its own shoulder and wrist timing.
 float holdWeight=(1.-smoothstep(.45,1.15,length((original-vec2(443.,848.))/vec2(92.,120.))));
 float holdAngle=active*(dance*.14*sin(t*6.+2.1)+twist*.17*sin(t*7.+1.7)+wave*.035*sin(t*4.));
 vec2 hold=turn(original,vec2(475.,950.),holdAngle);
 hold=turn(hold,vec2(438.,870.),active*(dance+twist)*.065*sin(t*9.+1.));
 p+=(hold-original)*holdWeight;
 float tailWeight=(1.-smoothstep(321.,425.,original.x))*smoothstep(740.,805.,original.y)*(1.-smoothstep(1040.,1110.,original.y));
 p+=(turn(original,vec2(390.,1010.),.075*sin(t*2.1))-original)*tailWeight;
 float ankle=smoothstep(1000.,1150.,original.y);
 float left=ankle*(1.-smoothstep(510.,582.,original.x));float right=ankle*smoothstep(554.,618.,original.x);
 float rhythm=t*(dance*7.+twist*8.+(1.-dance-twist)*3.1);
 float amplitude=4.+active*(dance*65.+twist*58.+wave*9.);
 float liftL=max(0.,sin(rhythm))*amplitude;float liftR=max(0.,-sin(rhythm))*amplitude;
 p+=(turn(original,vec2(470.,1102.),-.0035*liftL)-original+vec2(-.15*liftL,-liftL))*left;
 p+=(turn(original,vec2(665.,1100.),.0035*liftR)-original+vec2(.15*liftR,-liftR))*right;
 float body=1.-smoothstep(1030.,1220.,original.y);
 p+=vec2(sin(t*1.6)*2.,sin(t*3.2)*1.7)*body;
 float sway=active*(dance*.045*sin(t*7.)+twist*.055*sin(t*6.));
 p=turn(p,vec2(570.,1175.),sway);
 p.x+=active*(dance*18.*sin(t*7.)+twist*22.*sin(t*6.));
 float bounce=hop*active*abs(sin(t*7.))*65.+dance*active*abs(sin(t*7.))*10.;
 p.y-=bounce;
 p=mix(p,original,uReduced);
 gl_Position=vec4((p.x/1199.*2.-1.)*uFit.x,(1.-p.y/1312.*2.)*uFit.y,0.,1.);
}`;
const FS=`precision mediump float;uniform sampler2D uTexture;varying vec2 vUV;void main(){gl_FragColor=texture2D(uTexture,vUV);}`;
function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s}
function mount(){
 const canvas=document.querySelector('.lumo-mesh');if(current?.canvas===canvas)return;if(current)current.stop();current=null;if(!canvas)return;
 let raf=0,stopped=false,program,texture,buffer;const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,preserveDrawingBuffer:false});
 canvas.addEventListener('webglcontextlost',()=>{canvas.dataset.ready='false';stopped=true;cancelAnimationFrame(raf)},{once:true});
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 if(!gl){current=createCanvasMesh(canvas,media);return}
 try{
  program=gl.createProgram();gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const vertices=[],cols=58,rows=64;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){let a=[x/cols,y/rows],b=[(x+1)/cols,y/rows],c=[x/cols,(y+1)/rows],d=[(x+1)/cols,(y+1)/rows];vertices.push(...a,...b,...c,...c,...b,...d)}
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);let a=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const uniforms={};for(const name of ['uTime','uAction','uProgress','uReduced','uTexture','uFit'])uniforms[name]=gl.getUniformLocation(program,name);
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const state={canvas,action:0,started:0,duration:1,stop(){stopped=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);media.removeEventListener?.('change',wake);gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program)},play(name){if(media.matches)return;this.action={wave:1,dance:2,hop:3,twist:4}[name]||1;this.started=performance.now();this.duration={wave:2100,dance:4200,hop:2700,twist:4600}[name]||2100;canvas.dataset.motion=name;wake()}};current=state;
  let ready=false;
  function draw(now){raf=0;if(stopped||!ready)return;const size=canvas.getBoundingClientRect();const ratio=Math.min(devicePixelRatio||1,3),w=Math.max(1,Math.round(size.width*ratio)),h=Math.max(1,Math.round(size.height*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);const sourceAspect=1199/1312,canvasAspect=w/h;gl.uniform2f(uniforms.uFit,Math.min(1,sourceAspect/canvasAspect),Math.min(1,canvasAspect/sourceAspect));let progress=state.action?Math.min(1,(now-state.started)/state.duration):0;if(progress>=1){state.action=0;canvas.dataset.motion='idle';progress=0}gl.useProgram(program);gl.uniform1f(uniforms.uTime,now/1000);gl.uniform1f(uniforms.uAction,state.action);gl.uniform1f(uniforms.uProgress,progress);gl.uniform1f(uniforms.uReduced,media.matches?1:0);gl.uniform1i(uniforms.uTexture,0);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);canvas.dataset.ready='true';if(!media.matches&&!document.hidden)raf=requestAnimationFrame(draw)}
  function wake(){if(!stopped&&ready&&!raf)raf=requestAnimationFrame(draw)}
  function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()}
  const image=new Image();image.onload=()=>{if(stopped)return;gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;canvas.dataset.renderer='mesh';canvas.dataset.motion='idle';wake()};image.onerror=()=>{canvas.dataset.renderer='error'};image.decoding='async';image.src='assets/lumo-3d-clean.png';document.addEventListener('visibilitychange',visibility);media.addEventListener?.('change',wake);
 }catch(error){canvas.dataset.renderer='error';console.error('Lumo renderer:',error)}
}
function createCanvasMesh(canvas,media){
 const ctx=canvas.getContext('2d',{alpha:true});let stopped=false,ready=false,raf=0,lastDraw=0,img=new Image();const cols=28,rows=32,vertices=[],triangles=[];
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const smooth=(a,b,v)=>{let x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x)};
 const rotate=(x,y,cx,cy,angle)=>{const co=Math.cos(angle),si=Math.sin(angle),dx=x-cx,dy=y-cy;return [cx+dx*co-dy*si,cy+dx*si+dy*co]};
 const state={canvas,action:0,started:0,duration:1,stop(){stopped=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);media.removeEventListener?.('change',wake)},play(name){if(media.matches)return;this.action={wave:1,dance:2,hop:3,twist:4}[name]||1;this.started=performance.now();this.duration={wave:2100,dance:4200,hop:2700,twist:4600}[name]||2100;canvas.dataset.motion=name;wake()}};
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++)vertices.push({x:x/cols*1199,y:y/rows*1312});
 const vertex=(x,y)=>y*(cols+1)+x;
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){let a=vertex(x,y),b=vertex(x+1,y),c=vertex(x,y+1),d=vertex(x+1,y+1);triangles.push([a,b,c],[c,b,d])}
 function deform(v,t,act,progress){let x=v.x,y=v.y,px=x,py=y,env=Math.sin(clamp(progress,0,1)*Math.PI)**2,active=act?env:0;let wave=act===1?1:0,dance=act===2?1:0,hop=act===3?1:0,twist=act===4?1:0,idleWave=Math.max(0,Math.sin(t*.82))**5*.1;
 let shoulder=idleWave*Math.sin(t*5)+active*(wave*.20*Math.sin(t*9)+dance*.28*Math.sin(t*6)+twist*.25*Math.sin(t*7));
 let elbow=idleWave*Math.sin(t*5+.4)+active*(wave*.28*Math.sin(t*11)+dance*.32*Math.sin(t*6+.8)+twist*.28*Math.sin(t*8));
 let armArea=1-smooth(.55,1.15,Math.hypot((x-911)/112,(y-658)/154)),armWeight=armArea*smooth(822,890,x);let ar=rotate(x,y,842,757,shoulder),fo=smooth(740,650,y)*smooth(848,910,x),fr=rotate(ar[0],ar[1],900,699,elbow);ar=[ar[0]*(1-fo)+fr[0]*fo,ar[1]*(1-fo)+fr[1]*fo];px+=(ar[0]-x)*armWeight;py+=(ar[1]-y)*armWeight;
 let holdWeight=1-smooth(.45,1.15,Math.hypot((x-443)/92,(y-848)/120)),holdAngle=active*(dance*.14*Math.sin(t*6+2.1)+twist*.17*Math.sin(t*7+1.7)+wave*.035*Math.sin(t*4)),hold=rotate(x,y,475,950,holdAngle);hold=rotate(hold[0],hold[1],438,870,active*(dance+twist)*.065*Math.sin(t*9+1));px+=(hold[0]-x)*holdWeight;py+=(hold[1]-y)*holdWeight;
 let tailWeight=(1-smooth(321,425,x))*smooth(740,805,y)*(1-smooth(1040,1110,y)),ta=rotate(x,y,390,1010,.075*Math.sin(t*2.1));px+=(ta[0]-x)*tailWeight;py+=(ta[1]-y)*tailWeight;
 let ankle=smooth(1000,1150,y),left=ankle*(1-smooth(510,582,x)),right=ankle*smooth(554,618,x),rhythm=t*(dance*7+twist*8+(1-dance-twist)*3.1),amplitude=4+active*(dance*65+twist*58+wave*9),liftL=Math.max(0,Math.sin(rhythm))*amplitude,liftR=Math.max(0,-Math.sin(rhythm))*amplitude,lf=rotate(x,y,470,1102,-.0035*liftL),rf=rotate(x,y,665,1100,.0035*liftR);px+=(lf[0]-x-.15*liftL)*left+(rf[0]-x+.15*liftR)*right;py+=(lf[1]-y-liftL)*left+(rf[1]-y-liftR)*right;
 let bodyShift=active*(dance*26*Math.sin(t*6)+twist*36*Math.sin(t*7)),turnAngle=active*(dance*.045*Math.sin(t*6)+twist*.07*Math.sin(t*7)),all=rotate(px,py,570,1080,turnAngle);px=all[0]+bodyShift;py=all[1]-active*hop*42*Math.abs(Math.sin(t*7))+active*(dance+twist)*6*Math.cos(t*12);
 return media.matches?[x,y]:[px,py];
 }
 function draw(now){raf=0;if(stopped||!ready)return;if(now-lastDraw<40&&!media.matches){raf=requestAnimationFrame(draw);return}lastDraw=now;
 const rect=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,3),w=Math.max(1,Math.round(rect.width*ratio)),h=Math.max(1,Math.round(rect.height*ratio));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}const scale=Math.min(w/1199,h/1312),ox=(w-1199*scale)/2,oy=(h-1312*scale)/2;let progress=state.action?clamp((now-state.started)/state.duration,0,1):0;if(progress>=1){state.action=0;canvas.dataset.motion='idle';progress=0}
 const dest=vertices.map(v=>{let p=deform(v,now/1000,state.action,progress);return [p[0]*scale+ox,p[1]*scale+oy]});ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.globalCompositeOperation='lighter';
 for(const tri of triangles){let [i,j,k]=tri,v0=vertices[i],v1=vertices[j],v2=vertices[k],p0=dest[i],p1=dest[j],p2=dest[k],sx1=v1.x-v0.x,sy1=v1.y-v0.y,sx2=v2.x-v0.x,sy2=v2.y-v0.y,det=sx1*sy2-sx2*sy1,dx1=p1[0]-p0[0],dy1=p1[1]-p0[1],dx2=p2[0]-p0[0],dy2=p2[1]-p0[1];let a=(dx1*sy2-dx2*sy1)/det,b=(dy1*sy2-dy2*sy1)/det,c=(dx2*sx1-dx1*sx2)/det,d=(dy2*sx1-dy1*sx2)/det,e=p0[0]-a*v0.x-c*v0.y,f=p0[1]-b*v0.x-d*v0.y,cx=(p0[0]+p1[0]+p2[0])/3,cy=(p0[1]+p1[1]+p2[1])/3;
 ctx.save();ctx.beginPath();[p0,p1,p2].forEach((q,n)=>{const dx=q[0]-cx,dy=q[1]-cy,len=Math.hypot(dx,dy)||1,xx=q[0],yy=q[1];n?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)});ctx.closePath();ctx.clip();ctx.setTransform(a,b,c,d,e,f);ctx.drawImage(img,0,0);ctx.restore();}
 canvas.dataset.ready='true';canvas.dataset.frames=String((Number(canvas.dataset.frames)||0)+1);if(!media.matches&&!document.hidden)raf=requestAnimationFrame(draw);
 }
 function wake(){if(ready&&!stopped&&!raf)raf=requestAnimationFrame(draw)}function visibility(){if(document.hidden){cancelAnimationFrame(raf);raf=0}else wake()}
 img.onload=()=>{ready=true;canvas.dataset.renderer='canvas-mesh';canvas.dataset.motion='idle';wake()};img.onerror=()=>canvas.dataset.renderer='error';img.decoding='async';img.src='assets/lumo-3d-clean.png';document.addEventListener('visibilitychange',visibility);media.addEventListener?.('change',wake);return state;
}
window.LumoMotion={mount,play(name){current?.play(name)},destroy(){current?.stop();current=null}};
})();
