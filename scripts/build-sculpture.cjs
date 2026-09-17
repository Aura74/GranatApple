/* A locally rendered trefoil sculpture. Parametric geometry, no runtime dependency. */
const fs = require('node:fs');
const path = require('node:path');
const TAU = Math.PI * 2;
const add = (a,b) => a.map((v,i)=>v+b[i]);
const sub = (a,b) => a.map((v,i)=>v-b[i]);
const scale = (a,s) => a.map(v=>v*s);
const dot = (a,b) => a.reduce((sum,v,i)=>sum+v*b[i],0);
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const unit = a => scale(a,1/Math.hypot(...a));
function rotate([x,y,z]) {
    const a=.85,b=-.28,c=-.4;
    [y,z]=[y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];
    [x,z]=[x*Math.cos(b)+z*Math.sin(b),-x*Math.sin(b)+z*Math.cos(b)];
    return [x*Math.cos(c)-y*Math.sin(c),x*Math.sin(c)+y*Math.cos(c),z];
}
const center = t => [(1+.36*Math.cos(3*t))*Math.cos(2*t),(1+.36*Math.cos(3*t))*Math.sin(2*t),.48*Math.sin(3*t)];
function vertex(t,p) {
    const c=center(t),tangent=unit(sub(center(t+.001),center(t-.001)));
    const n=unit(cross(tangent,[0,0,1])),b=unit(cross(tangent,n));
    const normal=add(scale(n,Math.cos(p)),scale(b,Math.sin(p)));
    return {p:rotate(add(c,scale(normal,.245))),n:rotate(normal)};
}
const faces=[],light=unit([-2,-3,5]);
for(let u=0;u<128;u++) for(let v=0;v<16;v++) {
    const points=[[u,v],[u+1,v],[u+1,v+1],[u,v+1]].map(([a,b])=>vertex(a/128*TAU,b/16*TAU));
    const normal=unit(points.reduce((sum,p)=>add(sum,p.n),[0,0,0]));
    if(normal[2]<-.3) continue;
    const diffuse=Math.max(0,dot(normal,light));
    const specular=Math.pow(Math.max(0,dot(normal,unit(add(light,[0,0,1])))),35);
    const intensity=.43+diffuse*.57;
    const rgb=[225,191,163].map((base,i)=>Math.round(Math.min(255,base*intensity+specular*[42,51,62][i])));
    faces.push({depth:points.reduce((s,p)=>s+p.p[2],0)/4,svg:`<path d="${points.map((p,i)=>`${i?'L':'M'}${(300+p.p[0]*146).toFixed(2)} ${(246+p.p[1]*146).toFixed(2)}`).join('')}Z" fill="rgb(${rgb.join(' ')})" stroke="rgb(${rgb.join(' ')})" stroke-width=".65" stroke-linejoin="round"/>`});
}
faces.sort((a,b)=>a.depth-b.depth);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500"><defs><radialGradient id="s"><stop stop-color="#423124" stop-opacity=".28"/><stop offset="1" stop-color="#423124" stop-opacity="0"/></radialGradient></defs><ellipse cx="302" cy="456" rx="173" ry="25" fill="url(#s)"/>${faces.map(f=>f.svg).join('')}</svg>`;
fs.writeFileSync(path.join(__dirname,'../images/curiosity-sculpture.svg'),svg);
console.log(`Sculpture: ${faces.length} shaded faces, ${Math.round(svg.length/1024)} KB`);
