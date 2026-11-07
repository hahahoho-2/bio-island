/* 원리 그림 엔진: 도면(격자) 위에 그림 부품(glyph)을 놓고, 현재 단계의 부품만 진하게 보여 줍니다. */
const Diagram=(()=>{
  const INK='var(--ink)';
  const F=(a,o)=>`fill="${a}" fill-opacity="${o===undefined?.2:o}"`;
  const S=(c,w)=>`stroke="${c||INK}" stroke-width="${w||1.4}" stroke-linejoin="round" stroke-linecap="round"`;

  const G={
    cell:a=>`<ellipse rx="28" ry="23" ${F(a)} ${S(a,2)}/><circle cx="-5" cy="-1" r="8" ${F(a,.55)}/>`,
    nucleus:a=>`<circle r="27" ${F(a)} ${S(a,2)}/><circle r="14" ${F(a,.5)}/><circle cx="-4" cy="-4" r="4" fill="var(--card)"/>`,
    dna:a=>`<path d="M-12 -26C16 -14 16 -6 0 0S-16 14 12 26" fill="none" ${S(a,2.5)}/><path d="M12 -26C-16 -14 -16 -6 0 0S16 14 -12 26" fill="none" ${S(INK,2)}/><path d="M-8 -18H8M-11 -9H11M-11 9H11M-8 18H8" ${S(a,1.5)} opacity=".7"/>`,
    plasmid:a=>`<circle r="19" fill="none" stroke="${a}" stroke-opacity=".35" stroke-width="7"/><path d="M-19 0A19 19 0 0 1 0 -19" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"/>`,
    bact:a=>`<rect x="-27" y="-13" width="54" height="26" rx="13" ${F(a)} ${S(a,2)}/><path d="M-14 4q4-9 8 0t8 0 8 0" fill="none" ${S(a,2)}/>`,
    tank:a=>`<rect x="-17" y="-22" width="34" height="48" rx="6" fill="var(--card)" ${S()}/><path d="M-17 -2H17V20a6 6 0 0 1-6 6H-11a6 6 0 0 1-6-6Z" ${F(a,.4)}/><circle cx="-6" cy="12" r="2.5" fill="${a}"/><circle cx="5" cy="5" r="2" fill="${a}"/><circle cx="3" cy="16" r="2" fill="${a}"/><path d="M0 -22V-30H12" fill="none" ${S()}/>`,
    dish:a=>`<ellipse cy="6" rx="30" ry="12" ${F(INK,.12)} ${S()}/><ellipse cy="2" rx="30" ry="12" fill="var(--card)" ${S()}/><ellipse cy="3" rx="20" ry="6" ${F(a,.4)}/>`,
    enzyme:a=>`<path d="M-4 0L18 -17A27 27 0 1 0 18 17Z" ${F(a,.35)} ${S(a,2)}/><circle cx="-8" cy="-10" r="3" fill="${INK}"/>`,
    cellpile:a=>`<circle cx="-10" cy="7" r="12" ${F(a,.3)} ${S(a,1.6)}/><circle cx="10" cy="7" r="12" ${F(a,.3)} ${S(a,1.6)}/><circle cy="-10" r="12" ${F(a,.3)} ${S(a,1.6)}/>`,
    person:a=>`<circle cy="-18" r="9" ${F(a,.3)} ${S()}/><path d="M-16 24V8a16 16 0 0 1 32 0V24Z" ${F(a,.3)} ${S()}/>`,
    syringe:a=>`<g transform="rotate(-35)"><rect x="-22" y="-6" width="34" height="12" rx="2" fill="var(--card)" ${S()}/><rect x="-22" y="-6" width="18" height="12" ${F(a,.4)}/><path d="M12 0H28M-22 0H-30M-30 -7V7" ${S()}/></g>`,
    vial:a=>`<rect x="-11" y="-24" width="22" height="8" rx="2" ${F(INK,.5)}/><path d="M-9 -16H9V18a6 6 0 0 1-6 6H-3a6 6 0 0 1-6-6Z" fill="var(--card)" ${S()}/><path d="M-9 2H9V18a6 6 0 0 1-6 6H-3a6 6 0 0 1-6-6Z" ${F(a,.45)}/>`,
    scanner:a=>`<rect x="-26" y="-28" width="52" height="46" rx="12" ${F(a,.25)} ${S()}/><circle cy="-6" r="13" fill="var(--card)" ${S()}/><rect x="-32" y="14" width="64" height="8" rx="3" fill="var(--card)" ${S()}/><path d="M-26 8H20" ${S(a,4)}/>`,
    led:a=>`<circle cy="-6" r="13" ${F(a,.4)} ${S(a,2)}/><rect x="-7" y="7" width="14" height="9" rx="2" fill="var(--card)" ${S()}/><path d="M-22 -16l-6-4M22 -16l6-4M0 -26V-32M-24 -4H-31M24 -4H31" ${S(a,2)}/>`,
    plant:a=>`<path d="M0 26V-6" ${S(INK,2)}/><path d="M0 4C-18 4-24-8-22-16 -8-16 0-8 0 4Z" ${F(a,.45)} ${S(a)}/><path d="M0 -4C18 -4 24-16 22-24 8-24 0-16 0-4Z" ${F(a,.45)} ${S(a)}/>`,
    sensor:a=>`<circle cy="14" r="4" fill="${a}"/><path d="M-10 4a14 14 0 0 1 20 0M-18 -4a25 25 0 0 1 36 0M-26 -12a36 36 0 0 1 52 0" fill="none" ${S(a,2)}/>`,
    server:a=>`<rect x="-24" y="-24" width="48" height="18" rx="4" ${F(a,.2)} ${S()}/><rect x="-24" y="-2" width="48" height="18" rx="4" ${F(a,.2)} ${S()}/><circle cx="-14" cy="-15" r="2.5" fill="${a}"/><circle cx="-14" cy="7" r="2.5" fill="${a}"/><path d="M-6 -15H16M-6 7H16M0 16V26M-12 26H12" ${S()} opacity=".6"/>`,
    nano:a=>`<circle r="26" ${F(a,.2)} ${S(a,2)}/><circle r="16" fill="var(--card)" ${S(a,1.2)}/><circle cx="-5" cy="-3" r="3" fill="${a}"/><circle cx="5" cy="2" r="3" fill="${a}"/><circle cx="-1" cy="8" r="3" fill="${a}"/>`,
    animal:a=>`<ellipse cx="-3" cy="2" rx="22" ry="15" ${F(a,.2)} ${S()}/><ellipse cx="22" cy="-3" rx="9" ry="8" fill="var(--card)" ${S()}/><circle cx="25" cy="-5" r="1.6" fill="${INK}"/><path d="M-14 15V27M4 15V27" ${S(INK,3)}/><circle cx="-14" cy="-6" r="6" ${F(a,.3)}/><circle cx="-2" cy="-10" r="6" ${F(a,.3)}/>`,
    egg:a=>`<ellipse rx="22" ry="26" ${F(a,.2)} ${S(a,2)}/><circle cx="-2" cy="2" r="9" ${F(a,.5)}/>`,
    embryo:a=>`<g ${F(a,.28)} ${S(a,1.6)}><circle cx="-12" cy="-12" r="12"/><circle cx="12" cy="-12" r="12"/><circle cx="-12" cy="12" r="12"/><circle cx="12" cy="12" r="12"/></g>`,
    meat:a=>`<rect x="-26" y="-16" width="52" height="32" rx="12" ${F(a,.4)} ${S(a,2)}/><path d="M-14 -6Q0 -12 14 -6M-14 4Q0 -2 14 4" fill="none" ${S()} opacity=".5"/>`,
    insect:a=>`<ellipse cy="6" rx="12" ry="18" ${F(a,.35)} ${S()}/><circle cy="-16" r="7" ${F(a,.35)} ${S()}/><path d="M-12 -2L-26 -8M-12 8L-26 8M-11 16L-24 24M12 -2L26 -8M12 8L26 8M11 16L24 24M-3 -22L-10 -30M3 -22L10 -30" fill="none" ${S()}/>`,
    nozzle:a=>`<path d="M-14 -26H14L8 -6H-8Z" fill="var(--card)" ${S()}/><circle cy="4" r="3" fill="${a}"/><circle cx="-4" cy="14" r="3" fill="${a}" opacity=".6"/><circle cx="4" cy="22" r="3" fill="${a}" opacity=".4"/>`,
    ear:a=>`<path d="M-6 -24C14 -26 24 -10 18 6C14 16 6 14 6 24C6 30 -6 30 -8 22C-4 18 -14 14 -16 2C-18 -12 -14 -24 -6 -24Z" ${F(a,.3)} ${S()}/><path d="M-4 -14C6 -14 10 -4 6 4" fill="none" ${S()} opacity=".6"/>`,
    chrom:a=>`<path d="M-16 -24L16 24M16 -24L-16 24" fill="none" stroke="${a}" stroke-width="9" stroke-linecap="round"/><g fill="var(--accent)"><circle cx="-16" cy="-24" r="5"/><circle cx="16" cy="-24" r="5"/><circle cx="-16" cy="24" r="5"/><circle cx="16" cy="24" r="5"/></g>`,
    drug:a=>`<g transform="rotate(-40)"><rect x="-22" y="-9" width="44" height="18" rx="9" fill="var(--card)" ${S()}/><rect x="-22" y="-9" width="22" height="18" rx="9" ${F(a,.5)}/><path d="M0 -9V9" ${S()}/></g>`,
    virus:a=>`<circle r="12" ${F(a,.35)} ${S(a,2)}/><g ${S(a,2)}><path d="M0 -12V-22M0 12V22M-12 0H-22M12 0H22M-8.5 -8.5L-16 -16M8.5 -8.5L16 -16M-8.5 8.5L-16 16M8.5 8.5L16 16"/></g><g fill="${a}"><circle cy="-23" r="3"/><circle cy="23" r="3"/><circle cx="-23" r="3"/><circle cx="23" r="3"/></g>`,
    antibody:a=>`<path d="M0 24V4M0 4L-16 -20M0 4L16 -20" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round"/><circle cx="-17" cy="-22" r="4" fill="${a}"/><circle cx="17" cy="-22" r="4" fill="${a}"/>`,
    tumor:a=>`<g ${F(a,.3)} ${S(a,1.6)}><circle cx="-10" cy="-6" r="12"/><circle cx="8" cy="-10" r="10"/><circle cx="12" cy="8" r="13"/><circle cx="-8" cy="10" r="11"/></g>`,
    drop:a=>`<path d="M0 -26C14 -6 20 2 20 10a20 20 0 0 1-40 0C-20 2 -14 -6 0 -26Z" ${F(a,.35)} ${S(a,2)}/>`,
    muscle:a=>`<rect x="-28" y="-12" width="56" height="24" rx="12" ${F(a,.3)} ${S(a,2)}/><path d="M-16 -8V8M-8 -8V8M0 -8V8M8 -8V8M16 -8V8" ${S()} opacity=".35"/>`,
    neuron:a=>`<circle r="9" ${F(a,.5)} ${S(a,2)}/><path d="M-8 -6L-24 -20M8 -6L24 -20M-8 6L-24 20M8 6L24 20M9 0H28" fill="none" ${S(a,2)}/>`,
    stack:a=>[0,1,2,3].map(i=>{const y=-22+i*13;return `<path d="M-22 ${y+9}L-10 ${y}H24L12 ${y+9}Z" ${F(a,.2+i*.1)} ${S(a,1.4)}/>`;}).join(''),
    cube:a=>`<path d="M0 -24L24 -12L0 0L-24 -12Z" ${F(a,.5)} ${S()}/><path d="M-24 -12L0 0V26L-24 14Z" ${F(a,.25)} ${S()}/><path d="M24 -12L0 0V26L24 14Z" ${F(a,.35)} ${S()}/>`,
    box:a=>`<rect x="-24" y="-8" width="48" height="30" rx="3" ${F(a,.3)} ${S()}/><path d="M-27 -8H27V-16H-27Z" fill="var(--card)" ${S()}/>`,
    bar:a=>`<rect x="-26" y="-12" width="52" height="24" rx="5" ${F(a,.4)} ${S(a,2)}/><path d="M-14 -12V12M0 -12V12M14 -12V12" ${S()} opacity=".3"/>`,
    building:a=>`<rect x="-24" y="-20" width="48" height="44" fill="var(--card)" ${S()}/><path d="M-30 -20L0 -34L30 -20Z" ${F(a,.5)} ${S()}/><path d="M-14 -10H-6V-2H-14ZM6 -10H14V-2H6ZM-14 8H-6V16H-14ZM6 8H14V16H6Z" ${F(a,.4)}/>`,
    phone:a=>`<rect x="-14" y="-26" width="28" height="52" rx="6" fill="var(--card)" ${S()}/><rect x="-10" y="-20" width="20" height="32" ${F(a,.3)}/><circle cy="19" r="2.5" fill="${INK}"/>`,
    tube:a=>`<path d="M-30 -10H30M-30 10H30" ${S(INK,2)}/><circle cx="-16" r="5" fill="${a}"/><circle cx="2" cy="-3" r="5" fill="${a}" opacity=".7"/><circle cx="20" cy="3" r="5" fill="${a}" opacity=".5"/>`,
    genebar:a=>`<rect x="-28" y="-9" width="56" height="18" rx="3" fill="var(--card)" ${S()}/><rect x="-6" y="-9" width="22" height="18" ${F(a,.6)} ${S(a,1.5)}/>`
  };

  function glyph(type,x,y,color,scale){
    const g=G[type]||G.box;
    const s=scale||1;
    return `<g transform="translate(${x} ${y}) scale(${s})">${g(color)}</g>`;
  }

  let uid=0;
  /* spec: {w,h,nodes:[{id,t,x,y,l,c}],links:[[a,b],..]}, step: {on:[ids], flow:[[a,b]..]} 또는 null(전체), color: 기본 색 */
  function render(spec,step,color,title){
    const w=spec.w||640,h=spec.h||220,id='d'+(++uid);
    const nodes=spec.nodes,byId={};
    nodes.forEach(n=>{byId[n.id]=n;});
    const on=step?new Set(step.on):null;
    const flows=step?(step.flow||[]):spec.links;
    const isFlow=(a,b)=>flows.some(f=>f[0]===a&&f[1]===b);
    let out=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}t"><title id="${id}t">${esc(title||'원리 그림')}</title>`;
    out+=`<defs><pattern id="${id}g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="var(--line)" stroke-width=".6"/></pattern><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>`;
    out+=`<rect width="${w}" height="${h}" fill="var(--soft)"/><rect width="${w}" height="${h}" fill="url(#${id}g)"/>`;
    spec.links.forEach(l=>{
      const a=byId[l[0]],b=byId[l[1]];
      if(!a||!b)return;
      const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
      const ux=dx/d,uy=dy/d;
      const x1=a.x+ux*36,y1=a.y+uy*36,x2=b.x-ux*40,y2=b.y-uy*40;
      const active=isFlow(l[0],l[1]);
      out+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${active?(color||'var(--accent)'):'var(--muted)'}" stroke-width="${active?2.6:1.4}" ${active?'class="flow"':'opacity=".35"'} marker-end="url(#${id}a)"/>`;
    });
    nodes.forEach(n=>{
      const lit=!on||on.has(n.id);
      const col=n.c||color||'var(--dna)';
      out+=`<g opacity="${lit?1:.28}">${glyph(n.t,n.x,n.y,col,n.s)}`;
      const lines=String(n.l||'').split('\n');
      lines.forEach((ln,i)=>{
        out+=`<text x="${n.x}" y="${n.y+46+i*14}" text-anchor="middle" font-size="12" font-weight="${lit?600:400}" fill="var(--ink)" font-family="var(--font-body)">${esc(ln)}</text>`;
      });
      out+='</g>';
    });
    return out+'</svg>';
  }

  return {render,glyph,G};
})();
