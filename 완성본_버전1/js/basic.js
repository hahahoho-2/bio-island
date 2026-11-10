/* 기초 개념: 포함 관계 그림(세포~유전자), 게놈 그림, DNA 구조, 염기 짝 맞추기
   주의: 포함 관계는 화살표로 그리지 않는다. 게놈은 포함 관계의 한 단계가 아니라 "DNA 전체"다. */
const Basic=(()=>{
  const STEPS=[
    {t:'세포',d:'생물의 기본 단위예요. 안에 핵, 세포질, 미토콘드리아 등이 있어요.'},
    {t:'핵',d:'세포 안에 있는 구조물(세포소기관)이에요. 막으로 둘러싸여 있고 DNA의 대부분을 보관해요. (세균 같은 원핵세포에는 핵이 없어요.)'},
    {t:'염색체',d:'핵 안에 있어요. DNA가 단백질(히스톤)에 감겨 응축된 구조예요. 사람 체세포에는 46개(23쌍)가 있어요. 세포가 분열하기 전에 DNA를 복제하면 X자로 보이는 염색체가 돼요.'},
    {t:'DNA',d:'염색체를 이루는 분자예요. 유전 정보를 저장하고 있고, 염기 A, T, G, C가 길게 이어진 이중나선이에요. 정보는 염기의 배열 순서에 있어요.'},
    {t:'유전자',d:'DNA의 일부 구간이에요. 단백질이나 기능성 RNA를 만드는 정보가 들어 있어요. DNA의 모든 구간이 유전자는 아니에요. 사람은 약 2만 개이고 전체 DNA의 약 1~2%예요.'}
  ];
  const GENOME={t:'게놈은 어디?',d:'게놈(유전체)은 위의 한 단계가 아니에요. <strong>한 생물이 가진 DNA 전체</strong>를 가리키는 말이라서, 모든 염색체의 DNA와 그 안의 유전자, 유전자가 아닌 구간을 모두 합친 거예요. 그래서 “유전자보다 작다”거나 “염색체와 같다”고 할 수 없어요. 사람은 한 세트(23개 염색체)의 핵 DNA가 약 30억 염기쌍이에요. 염색체는 DNA를 담은 “구조”이고, 게놈은 DNA “정보의 전체”예요.'};
  let step=0,game=null;

  /* 포함 관계 그림: 큰 상자 안에 작은 상자(화살표 없음) */
  function nested(level){
    const hi=k=>level===k;
    const box=(k,x,y,w,h,col,label,sub)=>{
      const on=hi(k);
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${col}" fill-opacity="${on?.28:.08}" stroke="${on?'var(--accent)':col}" stroke-width="${on?4:1.6}"/>`+
        `<text x="${x+14}" y="${y+24}" font-size="15" font-weight="700" fill="var(--ink)" font-family="var(--font-body)">${label}</text>`+
        (sub?`<text x="${x+14+label.length*15+8}" y="${y+24}" font-size="12" fill="var(--muted)" font-family="var(--font-body)">${sub}</text>`:'');
    };
    const geneOn=hi(5);
    const seg=(x,w,gene)=>gene
      ?`<rect x="${x}" y="176" width="${w}" height="36" rx="4" fill="var(--accent)" fill-opacity="${geneOn?.75:.4}" stroke="var(--accent)" stroke-width="${geneOn?3:1.5}"/>`
      :`<rect x="${x}" y="176" width="${w}" height="36" rx="4" fill="var(--soft)" stroke="var(--muted)" stroke-width="1.2"/>`;
    let s=`<svg viewBox="0 0 640 330" role="img" aria-labelledby="nt"><title id="nt">세포 안에 핵, 핵 안에 염색체, 염색체 안에 DNA, DNA의 일부 구간이 유전자인 포함 관계 그림</title>`;
    s+=`<rect width="640" height="330" fill="var(--soft)"/>`;
    s+=box(1,10,10,620,310,'var(--cell)','세포','생물의 기본 단위');
    s+=box(2,40,50,560,250,'var(--cell)','핵','DNA를 보관하는 구조물');
    s+=box(3,70,90,500,190,'var(--cell)','염색체','DNA가 단백질에 감긴 구조');
    s+=box(4,100,130,440,140,'var(--dna)','DNA','염기 A, T, G, C의 긴 사슬');
    s+=seg(120,70,false)+seg(190,100,true)+seg(290,80,false)+seg(370,70,true)+seg(440,80,false);
    s+=`<text x="240" y="232" text-anchor="middle" font-size="13" font-weight="${geneOn?700:400}" fill="var(--ink)" font-family="var(--font-body)">유전자</text><text x="405" y="232" text-anchor="middle" font-size="13" font-weight="${geneOn?700:400}" fill="var(--ink)" font-family="var(--font-body)">유전자</text>`;
    s+=`<text x="155" y="232" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-body)">유전자 아님</text>`;
    s+=`<text x="480" y="232" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-body)">유전자 아님</text>`;
    s+=`<text x="320" y="258" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-body)">유전자는 DNA의 일부 구간이에요</text>`;
    return s+'</svg>';
  }

  /* 게놈 그림: 여러 염색체의 DNA를 모두 묶은 괄호 */
  function genomeSVG(){
    const bar=(y,w,genes)=>{
      let s=`<rect x="130" y="${y}" width="${w}" height="22" rx="3" fill="var(--soft)" stroke="var(--muted)" stroke-width="1.2"/>`;
      genes.forEach(g=>{s+=`<rect x="${130+g[0]}" y="${y}" width="${g[1]}" height="22" fill="var(--accent)" fill-opacity=".5" stroke="var(--accent)" stroke-width="1.2"/>`;});
      return s;
    };
    let s=`<svg viewBox="0 0 640 300" role="img" aria-labelledby="gt"><title id="gt">여러 염색체의 DNA 전체를 묶은 것이 게놈이라는 그림</title><rect width="640" height="300" fill="var(--soft)"/>`;
    s+=`<text x="330" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)" font-family="var(--font-body)">게놈 = 모든 염색체의 DNA 전체</text>`;
    s+=`<path d="M30 44V36H640" fill="none" stroke="none"/><path d="M24 48V40H616V48" fill="none" stroke="var(--accent)" stroke-width="2.5"/>`;
    const rows=[['염색체 1',70,440,[[40,50],[150,70],[290,40],[400,30]]],['염색체 2',110,380,[[30,60],[170,40],[300,50]]],['염색체 3',150,330,[[60,50],[180,70]]],['염색체 23',230,220,[[40,40],[130,40]]]];
    rows.forEach(r=>{s+=`<text x="36" y="${r[1]+16}" font-size="13" fill="var(--ink)" font-family="var(--font-body)">${r[0]}</text>`+bar(r[1],r[2],r[3]);});
    s+=`<text x="330" y="212" text-anchor="middle" font-size="16" fill="var(--muted)">⋮</text>`;
    s+=`<rect x="36" y="262" width="14" height="14" rx="2" fill="var(--accent)" fill-opacity=".5" stroke="var(--accent)"/><text x="56" y="274" font-size="12" fill="var(--ink)" font-family="var(--font-body)">유전자 구간</text>`;
    s+=`<rect x="150" y="262" width="14" height="14" rx="2" fill="var(--soft)" stroke="var(--muted)"/><text x="170" y="274" font-size="12" fill="var(--ink)" font-family="var(--font-body)">유전자가 아닌 DNA 구간</text>`;
    s+=`<text x="330" y="292" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--font-body)">각 막대는 염색체 하나를 이루는 DNA예요. 사람은 한 세트에 염색체 23개</text>`;
    return s+'</svg>';
  }

  function paint(){
    const g=step===6;
    $('#bdia').innerHTML=g?genomeSVG():nested(step);
    $$('#bsteps button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===step)));
    const info=$('#binfo');
    if(step===0)info.innerHTML='<b>안에 들어 있는 관계예요</b>세포 안에 핵이 있고, 핵 안에 염색체가 있고, 염색체는 DNA로 이루어져 있어요. 그 DNA의 일부 구간이 유전자예요. 게놈은 이 중 한 단계가 아니라 <strong>DNA 전체</strong>를 가리키는 말이에요. 단계 버튼을 눌러 하나씩 살펴보세요.';
    else if(g)info.innerHTML=`<b>${esc(GENOME.t)}</b>${GENOME.d}`;
    else info.innerHTML=`<b>${step}. ${esc(STEPS[step-1].t)}</b>${STEPS[step-1].d}`;
  }

  const PAIR={A:'T',T:'A',G:'C',C:'G'};
  function newGame(){
    const arr=[];for(let i=0;i<8;i++)arr.push('ATGC'[Math.floor(Math.random()*4)]);
    game={top:arr,bot:[],done:false};
    paintGame();
  }
  function paintGame(){
    const g=game;
    $('#gtop').innerHTML=g.top.map(b=>`<span class="top">${b}</span>`).join('');
    $('#gbot').innerHTML=g.top.map((b,i)=>g.bot[i]?`<span class="bot ok">${g.bot[i]}</span>`:`<span class="bot empty">?</span>`).join('');
    $('#gmsg').textContent=g.done?'모두 맞혔어요! A–T, G–C가 짝이에요. (A–T는 수소 결합 2개, G–C는 3개)':`${g.bot.length+1}번째 염기의 짝을 골라 보세요.`;
  }
  function pick(b){
    if(game.done)return;
    const i=game.bot.length;
    if(PAIR[game.top[i]]===b){game.bot.push(b);if(game.bot.length===game.top.length)game.done=true;}
    else{$('#gmsg').textContent=`${b}는 ${game.top[i]}의 짝이 아니에요. A는 T, G는 C와 짝이에요. 다시 골라 보세요.`;return;}
    paintGame();
  }

  function init(){
    const v=$('#view-basic');
    v.innerHTML=`
    <h2>기초 개념</h2>
    <p class="lead">16가지 기술을 이해하는 바탕이에요. 세포 안을 점점 확대해 보세요. 게놈은 마지막 단계가 아니라 “DNA 전체”를 가리키는 말이에요.</p>
    <div class="card" style="--cc:var(--cell)">
      <h3>세포 안을 확대해 보기</h3>
      <div class="dia" id="bdia"></div>
      <div class="stepbtns" id="bsteps"><button data-s="0">전체</button>${STEPS.map((s,i)=>`<button data-s="${i+1}">${i+1}. ${esc(s.t)}</button>`).join('')}<button class="alt" data-s="6">${esc(GENOME.t)}</button></div>
      <div class="stepinfo" id="binfo"></div>
    </div>
    <div class="grid2">
      <div class="card"><h3>DNA 구조: 이중나선</h3>
        <p style="margin:4px 0">DNA는 꼬인 사다리 모양이에요. 양쪽 기둥은 <b>인산과 당</b>으로 된 튼튼한 뼈대이고, 가운데 가로대는 염기 두 개가 손을 잡은 모양이에요.</p>
        <ul class="uses"><li><b>A–T</b>: 수소 결합 2개, <b>G–C</b>: 수소 결합 3개 (상보적 결합)</li><li>인산 + 당 + 염기 = <b>뉴클레오타이드</b>(DNA의 기본 단위)</li><li>두 가닥은 방향(5′→3′)이 서로 반대예요(역평행).</li><li>1953년 왓슨과 크릭이 이중나선 구조를 제안했고, 프랭클린과 윌킨스의 X선 회절 자료가 중요한 단서였어요.</li></ul></div>
      <div class="card"><h3>염기 짝 맞추기</h3>
        <p style="margin:4px 0">위쪽 가닥의 염기와 짝이 되는 염기를 차례대로 골라 보세요.</p>
        <div class="bases" id="gtop" aria-label="위쪽 가닥"></div>
        <div class="bases" id="gbot" aria-label="아래쪽 가닥"></div>
        <div class="pick">${['A','T','G','C'].map(b=>`<button data-b="${b}">${b}</button>`).join('')}<button id="gnew" style="width:auto;padding:0 12px;font-family:var(--font-body);font-size:14px">새 문제</button></div>
        <div class="fb" id="gmsg" role="status"></div></div>
    </div>
    <div class="card"><h3>용어 정리</h3>
      <dl class="terms">
        <div><dt>핵</dt><dd>세포 안의 구조물. DNA의 대부분을 보관</dd></div>
        <div><dt>염색체</dt><dd>DNA를 단백질에 감아 포장한 구조</dd></div>
        <div><dt>DNA</dt><dd>유전 정보를 저장한 분자(물질)</dd></div>
        <div><dt>유전자</dt><dd>DNA의 일부 구간으로, 기능을 가진 정보 단위</dd></div>
        <div><dt>게놈(유전체)</dt><dd>한 생물이 가진 DNA 전체(유전자와 유전자가 아닌 구간 모두 포함). 포함 관계의 한 단계가 아님</dd></div>
      </dl>
    </div>
    <h3 style="margin:16px 0 6px">더 궁금해요</h3>
    <details><summary>게놈은 유전자보다 작은가요, 큰가요?</summary><div class="a">게놈이 <b>더 커요.</b> 게놈은 한 생물이 가진 DNA 전체이고, 유전자는 그 DNA의 일부 구간이에요. 사람은 게놈 중 단백질을 만드는 유전자 부분이 약 1~2%예요. 나머지는 유전자 사이 구간과 조절 부위 등이에요.</div></details>
    <details><summary>게놈은 염색체와 같은 말인가요?</summary><div class="a"><b>아니에요.</b> 염색체는 DNA를 포장한 <b>물리적 구조</b>이고, 게놈은 DNA 정보의 <b>전체 범위</b>예요. 염색체 하나는 게놈의 일부를 담고 있고, 한 세트(사람은 23개)의 DNA를 모두 합친 것이 게놈이에요. 책으로 비유하면 염색체는 책 한 권, 게놈은 전집의 내용 전체예요.</div></details>
    <details><summary>사람의 게놈은 얼마나 큰가요? 미토콘드리아 DNA는요?</summary><div class="a">한 세트(23개 염색체)의 핵 DNA가 약 30억 염기쌍이에요. 체세포에는 어머니와 아버지에게서 받은 두 세트(46개)가 있어요. 미토콘드리아에도 자체 DNA(약 1만 6천 염기쌍)가 있어서, 넓게는 게놈에 포함해서 말하기도 해요.</div></details>
    <details><summary>세균에도 핵과 염색체가 있나요?</summary><div class="a">세균 같은 원핵세포에는 <b>핵이 없고</b> DNA가 세포질의 핵양체 영역에 있어요. 보통 고리 모양이에요. 작은 고리 DNA인 <b>플라스미드</b>를 가지기도 해요.</div></details>
    <details><summary>DNA를 눈으로 볼 수 있나요?</summary><div class="a">DNA 이중나선은 지름이 약 2 nm라 광학현미경으로 모양을 볼 수 없어요. X선 회절 같은 <b>간접 측정</b>으로 구조를 알아냈어요. 염색체는 분열 중기에 응축되면 현미경으로 보여요. 유전자는 DNA의 염기서열 구간이라 따로 찍은 사진이 없어요.</div></details>`;
    $$('#bsteps button').forEach(b=>b.addEventListener('click',()=>{step=+b.dataset.s;paint();}));
    $$('.pick button[data-b]').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.b)));
    $('#gnew').addEventListener('click',newGame);
    paint();newGame();
  }
  return {init};
})();
