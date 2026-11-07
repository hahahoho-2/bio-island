/* 기초 개념: 세포→게놈 확대 그림, 용어, 염기 짝 맞추기 */
const Basic=(()=>{
  const SPEC={h:210,nodes:[
    {id:'cell',t:'cell',x:60,y:90,l:'세포',c:'var(--cell)'},
    {id:'nuc',t:'nucleus',x:180,y:90,l:'핵',c:'var(--cell)'},
    {id:'chr',t:'chrom',x:300,y:90,l:'염색체',c:'var(--cell)'},
    {id:'dna',t:'dna',x:420,y:90,l:'DNA',c:'var(--dna)'},
    {id:'gene',t:'genebar',x:540,y:90,l:'유전자',c:'var(--accent)'}],
    links:[['cell','nuc'],['nuc','chr'],['chr','dna'],['dna','gene']]};
  const STEPS=[
    {t:'세포',d:'생물의 기본 단위예요. 안에 핵, 세포질, 미토콘드리아 등이 있어요.',on:['cell']},
    {t:'핵',d:'세포 속 구조물(세포소기관)이에요. 막으로 둘러싸여 있고 DNA의 대부분을 보관해요. (세균 같은 원핵세포에는 핵이 없어요.)',on:['cell','nuc'],flow:[['cell','nuc']]},
    {t:'염색체',d:'DNA가 단백질(히스톤)에 감겨 응축된 구조예요. 사람 체세포에는 46개(23쌍)가 있어요. 세포가 분열하기 전에 DNA를 복제하면 X자로 보이는 염색체가 돼요.',on:['nuc','chr'],flow:[['nuc','chr']]},
    {t:'DNA',d:'유전 정보를 저장한 분자예요. 염기 A, T, G, C가 길게 이어진 이중나선이고, 정보는 염기의 배열 순서에 있어요.',on:['chr','dna'],flow:[['chr','dna']]},
    {t:'유전자',d:'DNA 중에서 단백질이나 기능성 RNA를 만드는 정보가 든 한 구간이에요. DNA의 모든 구간이 유전자는 아니에요. 사람은 약 2만 개이고 전체 DNA의 약 1~2%예요.',on:['dna','gene'],flow:[['dna','gene']]},
    {t:'게놈(유전체)',d:'한 생물이 가진 DNA 전체예요. 유전자와 유전자가 아닌 구간을 모두 포함해요. 한 세트(23개 염색체)의 핵 DNA가 약 30억 염기쌍이에요.',on:['chr','dna','gene'],flow:[['chr','dna'],['dna','gene']]}
  ];
  let step=0,game=null;

  function paint(){
    $('#bdia').innerHTML=Diagram.render(SPEC,step>0?STEPS[step-1]:null,'var(--cell)','세포에서 유전자까지 확대 그림');
    $$('#bsteps button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===step)));
    $('#binfo').innerHTML=step===0?'<b>큰 것에서 작은 것 순서</b>세포 ⊃ 핵 ⊃ 염색체 ⊃ DNA ⊃ 유전자. 게놈은 이 줄의 한 단계가 아니라 “DNA 전체”를 가리키는 말이에요.':`<b>${step}단계 · ${esc(STEPS[step-1].t)}</b>${STEPS[step-1].d}`;
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
    <p class="lead">16가지 기술을 이해하는 바탕이에요. 단계 버튼을 눌러 세포에서 유전자까지 점점 확대해 보세요.</p>
    <div class="card" style="--cc:var(--cell)">
      <h3>세포에서 게놈까지 확대하기</h3>
      <div class="dia" id="bdia"></div>
      <div class="stepbtns" id="bsteps"><button data-s="0">전체</button>${STEPS.map((s,i)=>`<button data-s="${i+1}">${i+1}. ${esc(s.t)}</button>`).join('')}</div>
      <div class="stepinfo" id="binfo"></div>
    </div>
    <div class="grid2">
      <div class="card"><h3>DNA 구조: 이중나선</h3>
        <p style="margin:4px 0">DNA는 꼬인 사다리 모양이에요. 양쪽 기둥은 <b>인산과 당</b>으로 된 튼튼한 뼈대이고, 가운데 가로대는 염기 두 개가 손을 잡은 모양이에요.</p>
        <ul class="uses"><li><b>A–T</b>: 수소 결합 2개, <b>G–C</b>: 수소 결합 3개 (상보적 결합)</li><li>인산 + 당 + 염기 = <b>뉴클레오타이드</b>(DNA의 기본 단위)</li><li>두 가닥은 방향(5′→3′)이 서로 반대예요(역평행).</li><li>1953년 왓슨과 크릭이 이중나선 구조를 제안했고, 프랭클린와 윌킨스의 X선 회절 자료가 중요한 단서였어요.</li></ul></div>
      <div class="card"><h3>염기 짝 맞추기</h3>
        <p style="margin:4px 0">위쪽 가닥의 염기와 짝이 되는 염기를 차례대로 골라 보세요.</p>
        <div class="bases" id="gtop" aria-label="위쪽 가닥"></div>
        <div class="bases" id="gbot" aria-label="아래쪽 가닥"></div>
        <div class="pick">${['A','T','G','C'].map(b=>`<button data-b="${b}">${b}</button>`).join('')}<button id="gnew" style="width:auto;padding:0 12px;font-family:var(--font-body);font-size:14px">새 문제</button></div>
        <div class="fb" id="gmsg" role="status"></div></div>
    </div>
    <div class="card"><h3>용어 정리</h3>
      <dl class="terms">
        <div><dt>핵</dt><dd>세포 속 구조물. DNA의 대부분을 보관</dd></div>
        <div><dt>염색체</dt><dd>DNA를 단백질에 감아 포장한 구조</dd></div>
        <div><dt>DNA</dt><dd>유전 정보를 저장한 분자(물질)</dd></div>
        <div><dt>유전자</dt><dd>DNA 중 기능을 가진 한 구간</dd></div>
        <div><dt>게놈(유전체)</dt><dd>한 생물이 가진 DNA 전체</dd></div>
      </dl>
    </div>
    <h3 style="margin:16px 0 6px">더 궁금해요</h3>
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
