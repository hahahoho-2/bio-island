/* 홈: 바이오 시티 풍경, 분류 버튼, 상세 서랍(단계별 원리 그림) */
const Hub=(()=>{
  const PINS={1:[4,40],7:[4,52],12:[4,64],13:[30,45],6:[30,57],5:[30,69],9:[49,38],3:[49,52],4:[49,66],10:[67,58],8:[85,52],11:[85,66],2:[5,84],16:[26,84],14:[47,84],15:[68,84]};
  let cur=null,step=0,timer=null,lastFocus=null;

  function get(id){return TECHS.find(t=>t.id===id);}

  function sceneSVG(){
    const g=Diagram.glyph;
    let s='<svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" role="img" aria-label="바이오 시티: 연구동, 병원, 식물 공장, 온실, 동물 우리와 땅속 세포 세계가 있는 단면 풍경">';
    s+='<rect width="960" height="400" fill="var(--sky)"/>';
    s+='<circle cx="880" cy="70" r="30" fill="#F6B73C"/>';
    s+='<g class="cloud" fill="#fff" fill-opacity=".8"><ellipse cx="200" cy="60" rx="46" ry="14"/><ellipse cx="230" cy="48" rx="30" ry="12"/><ellipse cx="560" cy="90" rx="52" ry="15"/><ellipse cx="592" cy="76" rx="32" ry="12"/><ellipse cx="760" cy="40" rx="38" ry="11"/></g>';
    s+='<rect y="400" width="960" height="18" fill="var(--grass)"/><rect y="418" width="960" height="122" fill="var(--soil)"/>';
    s+='<path d="M0 440Q120 430 240 442T480 438T720 444T960 436V460H0Z" fill="var(--soil2)" opacity=".5"/>';
    // 연구동
    s+='<rect x="30" y="150" width="240" height="250" fill="var(--bld)" stroke="var(--bld2)" stroke-width="3"/><rect x="30" y="150" width="240" height="14" fill="var(--dna)"/>';
    s+='<text x="40" y="142" font-size="13" font-weight="600" fill="var(--ink)" font-family="var(--font-body)">DNA 연구동</text>';
    s+=g('dna',215,205,'var(--dna)',.9)+g('plasmid',215,280,'var(--dna)',.9)+g('virus',215,352,'var(--cell)',.8);
    // 병원
    s+='<rect x="285" y="190" width="165" height="210" fill="var(--bld)" stroke="var(--bld2)" stroke-width="3"/><rect x="285" y="190" width="165" height="14" fill="var(--body)"/>';
    s+='<text x="295" y="182" font-size="13" font-weight="600" fill="var(--ink)" font-family="var(--font-body)">병원·영상</text>';
    s+='<path d="M425 160h12v-10h10v10h12v10h-12v10h-10v-10h-12z" fill="#D5303E"/>';
    s+=g('scanner',425,235,'var(--body)',.8)+g('cellpile',425,298,'var(--cell)',.7)+g('person',425,360,'var(--body)',.7);
    // 식물 공장·식품동
    s+='<rect x="470" y="150" width="150" height="250" fill="var(--bld)" stroke="var(--bld2)" stroke-width="3"/><path d="M470 232H620M470 316H620" stroke="var(--bld2)" stroke-width="3"/><rect x="470" y="150" width="150" height="14" fill="var(--food)"/>';
    s+='<text x="478" y="142" font-size="13" font-weight="600" fill="var(--ink)" font-family="var(--font-body)">식물 공장·식품동</text>';
    s+=g('led',585,200,'var(--accent)',.7)+g('plant',610,205,'var(--food)',.55)+g('tank',585,278,'var(--body)',.7)+g('insect',585,360,'var(--food)',.7);
    // 온실
    s+='<path d="M640 400Q640 300 720 288Q800 300 800 400Z" fill="#fff" fill-opacity=".35" stroke="var(--bld2)" stroke-width="3"/><path d="M720 288V400M680 300V400M760 300V400" stroke="var(--bld2)" stroke-width="2" opacity=".7"/>';
    s+=g('plant',690,372,'var(--food)',.8)+g('plant',750,372,'var(--food)',.8)+g('sensor',720,262,'var(--dna)',.7);
    s+='<text x="660" y="280" font-size="13" font-weight="600" fill="var(--ink)" font-family="var(--font-body)" text-anchor="start">스마트 온실</text>';
    // 동물 우리
    s+='<path d="M815 400V345H950V400M815 365H950" fill="none" stroke="var(--bld2)" stroke-width="4"/>';
    s+=g('animal',852,392,'var(--cell)',.7)+g('animal',912,392,'var(--cell)',.7);
    s+='<text x="818" y="334" font-size="13" font-weight="600" fill="var(--ink)" font-family="var(--font-body)">동물 우리</text>';
    // 땅속 세포 세계
    [140,350,560,770].forEach(cx=>{s+=`<ellipse cx="${cx}" cy="475" rx="108" ry="46" fill="var(--soil2)" fill-opacity=".8" stroke="var(--bld2)" stroke-width="2"/>`;});
    s+=g('chrom',215,475,'var(--cell)',.9)+g('dish',420,478,'var(--food)',.9)+g('nozzle',625,472,'var(--body)',.9)+g('nano',835,475,'var(--body)',.8);
    s+='<text x="12" y="532" font-size="12" font-weight="600" fill="#fff" font-family="var(--font-body)" opacity=".9">땅속: 세포와 아주 작은 세계</text>';
    return s+'</svg>';
  }

  function init(){
    const scene=$('#scene');
    let h=sceneSVG();
    TECHS.forEach(t=>{
      const p=PINS[t.id];
      h+=`<button class="pin" data-cat="${t.cat}" data-id="${t.id}" style="left:${p[0]}%;top:${p[1]}%" aria-label="${t.id}번 ${esc(t.name)}"><b>${t.id}</b><span>${esc(t.short)}</span></button>`;
    });
    scene.innerHTML=h;
    $$('.pin',scene).forEach(b=>b.addEventListener('click',()=>go(+b.dataset.id)));

    $('#cats').innerHTML=Object.keys(CATS).map(k=>`<div class="cat" data-cat="${k}"><h3>${CATS[k].name}</h3>${TECHS.filter(t=>t.cat===k).map(t=>`<button data-id="${t.id}"><b>${t.id}</b>${esc(t.name)}</button>`).join('')}</div>`).join('');
    $$('#cats button').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.id)));

    const LINKS=[['basic','기초 개념','세포 → 핵 → 염색체 → DNA → 유전자 → 게놈'],['compare','개념 비교','재조합·형질전환·세포융합·핵이식, CT와 MRI'],['quiz','확인 퀴즈','26문항, 바로 채점'],['inquiry','생각 더하기','토론하고 조사해 볼 질문']];
    $('#links').innerHTML=LINKS.map(l=>`<button data-tab="${l[0]}"><b>${l[1]}</b><span>${l[2]}</span></button>`).join('');
    $$('#links button').forEach(b=>b.addEventListener('click',()=>Core.showTab(b.dataset.tab)));

    $('#d-close').addEventListener('click',()=>close());
    $('#veil').addEventListener('click',()=>close());
    document.addEventListener('keydown',e=>{
      if($('#drawer').hidden)return;
      if(e.key==='Escape'){close();return;}
      if(e.key==='Tab'){
        const f=$$('button,summary,a[href]',$('#drawer')).filter(x=>x.offsetParent!==null);
        if(!f.length)return;
        const a=f[0],z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault();}
        else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault();}
      }
    });
  }

  function go(id){location.hash='t'+id;}

  function diagramHTML(t,s){
    const stepObj=s>0?t.steps[s-1]:null;
    return Diagram.render(t.spec,stepObj,CATS[t.cat].color,t.name+' 원리 그림'+(stepObj?': '+stepObj.t:' 전체'));
  }

  function paintStep(){
    const t=cur;
    $('#dia').innerHTML=diagramHTML(t,step);
    $$('#stepbtns button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===step)));
    const info=$('#stepinfo');
    if(step===0)info.innerHTML=`<b>전체 흐름</b>${t.chain.map(c=>esc(c)).join(' → ')}`;
    else{const s=t.steps[step-1];info.innerHTML=`<b>${step}단계 · ${esc(s.t)}</b>${s.d}`;}
  }

  function setStep(n){step=(n+t_len())%(t_len());paintStep();}
  function t_len(){return cur.steps.length+1;}

  function stopAuto(){if(timer){clearInterval(timer);timer=null;}const b=$('#auto');if(b)b.textContent='▶ 자동 재생';}
  function toggleAuto(){
    if(timer){stopAuto();return;}
    $('#auto').textContent='⏸ 멈춤';
    timer=setInterval(()=>setStep(step+1),6000);
  }

  function open(id,opts){
    const t=get(id);if(!t)return;
    cur=t;step=0;stopAuto();
    const dr=$('#drawer');
    const wasHidden=dr.hidden;
    if(wasHidden)lastFocus=document.activeElement;
    dr.style.setProperty('--cc',CATS[t.cat].color);
    $('#dhead').style.setProperty('--cc',CATS[t.cat].color);
    $('#d-cat').textContent=t.id+' · '+CATS[t.cat].name;
    $('#d-title').textContent=t.name;
    $('#d-sum').textContent=t.sum;
    const note=t.note?`<div class="note ${t.note.k==='warn'?'warn':''}">${t.note.t}</div>`:'';
    $('#dbody').innerHTML=
      `<div class="chain">${t.chain.map((c,i)=>(i?'<i>→</i>':'')+`<span>${esc(c)}</span>`).join('')}</div>`+
      `<div class="easy"><b>쉽게 말하면</b>${esc(t.easy)}</div>`+
      `<h4>원리 그림</h4><div class="dia" id="dia"></div>`+
      `<div class="stepbtns" id="stepbtns"><button data-s="0">전체</button>${t.steps.map((s,i)=>`<button data-s="${i+1}" title="${esc(s.t)}">${i+1}</button>`).join('')}</div>`+
      `<div class="stepinfo" id="stepinfo"></div>`+
      `<div class="ctrl"><button id="prev">◀ 이전</button><button id="auto">▶ 자동 재생</button><button id="next">다음 ▶</button></div>`+
      `<h4>핵심 용어</h4><dl class="terms">${t.terms.map(x=>`<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('')}</dl>`+
      `<h4>어디에 쓰일까요?</h4><ul class="uses">${t.uses.map(u=>`<li>${esc(u)}</li>`).join('')}</ul>`+
      note+
      (t.qa.length?`<h4>더 궁금해요</h4>${t.qa.map(q=>`<details><summary>${esc(q.q)}</summary><div class="a">${q.a}</div></details>`).join('')}`:'')+
      `<h4>생각해 보기</h4><details><summary>${esc(t.think.q)}</summary><div class="a">${esc(t.think.a)}</div></details>`+
      `<div class="rel">${t.rel.map(r=>{const x=get(r);return x?`<button data-id="${r}">${r}. ${esc(x.short)} ▸</button>`:'';}).join('')}</div>`;
    $$('#stepbtns button').forEach(b=>b.addEventListener('click',()=>{stopAuto();step=+b.dataset.s;paintStep();}));
    $('#prev').addEventListener('click',()=>{stopAuto();setStep(step-1);});
    $('#next').addEventListener('click',()=>{stopAuto();setStep(step+1);});
    $('#auto').addEventListener('click',toggleAuto);
    $$('.rel button').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.id)));
    paintStep();
    dr.hidden=false;$('#veil').hidden=false;
    dr.scrollTop=0;
    requestAnimationFrame(()=>dr.classList.add('open'));
    if(wasHidden)$('#d-close').focus();
    document.title=t.name+' · 생명공학기술 탐험';
  }

  function close(opts){
    opts=opts||{};
    stopAuto();
    const dr=$('#drawer');
    dr.classList.remove('open');
    dr.hidden=true;$('#veil').hidden=true;
    document.title='생명공학기술 탐험';
    cur=null;
    if(!opts.fromRoute&&/^#t\d+$/.test(location.hash)){
      try{history.replaceState(null,'','#home');}catch(e){location.hash='home';}
    }
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }

  return {init,get,open,close};
})();
