/* 공통: 선택자, 저장(try/catch), 탭 전환(해시 주소), 시작 */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const Core=(()=>{
  const TABS=['home','basic','compare','quiz','inquiry'];
  const store={
    get(k,d){try{const v=localStorage.getItem('bio:'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},
    set(k,v){try{localStorage.setItem('bio:'+k,JSON.stringify(v));}catch(e){}}
  };

  function showTab(id,opts){
    opts=opts||{};
    if(TABS.indexOf(id)<0)id='home';
    $$('.tab').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.tab===id)));
    $$('section.view').forEach(v=>{v.hidden=(v.id!=='view-'+id);});
    store.set('tab',id);
    if(!opts.keepHash&&location.hash!=='#'+id){
      try{history.replaceState(null,'','#'+id);}catch(e){location.hash=id;}
    }
    if(!opts.keepScroll)window.scrollTo(0,0);
  }

  function route(){
    const h=location.hash.replace('#','');
    const m=/^t(\d{1,2})$/.exec(h);
    if(m&&Hub.get(+m[1])){
      if($('#view-home').hidden)showTab('home',{keepHash:true,keepScroll:true});
      Hub.open(+m[1],{fromRoute:true});
      return;
    }
    if(!$('#drawer').hidden)Hub.close({fromRoute:true});
    showTab(TABS.indexOf(h)>=0?h:'home',{keepHash:true,keepScroll:true});
  }

  function start(){
    Hub.init();Basic.init();Compare.init();Quiz.init();
    $$('.tab').forEach((t,i,all)=>{
      t.addEventListener('click',()=>{showTab(t.dataset.tab);});
      t.addEventListener('keydown',e=>{
        if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
          const n=(i+(e.key==='ArrowRight'?1:all.length-1))%all.length;
          all[n].focus();showTab(all[n].dataset.tab);e.preventDefault();
        }
      });
    });
    window.addEventListener('hashchange',route);
    if(!location.hash)showTab(store.get('tab','home'),{keepScroll:true});
    else route();
  }

  return {store,showTab,start,TABS};
})();
