(function(){
  document.documentElement.classList.add('js');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header state */
  var hdr=document.getElementById('header');
  function onScroll(){hdr.classList.toggle('scrolled',scrollY>24)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* menu */
  var btn=document.getElementById('menuBtn'),menu=document.getElementById('menu'),lbl=document.getElementById('menuLbl');
  function setMenu(o){menu.classList.toggle('is-open',o);btn.setAttribute('aria-expanded',o);menu.setAttribute('aria-hidden',!o);lbl.textContent=o?'Close':'Menu';document.body.classList.toggle('nav-open',o)}
  btn.addEventListener('click',function(){setMenu(!menu.classList.contains('is-open'))});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});

  /* Dublin clock */
  var clock=document.getElementById('clock');
  function tick(){if(!clock)return;try{clock.textContent='IE → '+new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Dublin'}).format(new Date())}catch(e){}}
  tick();setInterval(tick,30000);

  /* reveal */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el)});

  /* videos: only play when on screen; honour reduced motion / data saver */
  var vids=document.querySelectorAll('.bgv video');
  var saveData=navigator.connection&&navigator.connection.saveData;
  if(reduce||saveData){vids.forEach(function(v){v.removeAttribute('autoplay');v.pause()})}
  else{
    var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{rootMargin:'120px 0px'});
    vids.forEach(function(v){vio.observe(v)});
  }

  /* ---------------- expanding product panel ---------------- */
  var PRODUCTS={
    asai:{idx:'001',badge:'Early access',cls:'badge--access',title:'ASAI',desc:'Personalized, self-hosted multi-agent AI avatars. Build an avatar once, run it on your own infrastructure, and let it work across the tools your team already uses.',link:'https://asai.astrosynapse.ai/',linkLbl:'Try ASAI now',ext:true,
      tiles:[{lbl:'Status',big:'Early access',sub:'Invite-based onboarding',bars:[6,9]},{lbl:'Architecture',big:'Multi-agent',sub:'Multi-LLM · no-code',cyan:true},{lbl:'Runs on',big:'Self-hosted',sub:'Your hardware, your data'},{lbl:'Integrations',big:'4 plugins',sub:'Slack · Trello · Discord · Jira'}],
      tags:['No-code','Multi-agent','Multi-LLM','Self-hosted','Slack/Trello/Discord/Jira plugins']},
    interpress:{idx:'002',badge:'Live',cls:'badge--live',title:'Interpress',desc:'Instant AI-powered document translation and interpretation across 200+ languages, with layout and formatting preserved end-to-end.',link:'https://interpress.app/',linkLbl:'Open Interpress',ext:true,
      tiles:[{lbl:'Status',big:'Live',sub:'In production today',bars:[9,9]},{lbl:'Languages',big:'200+',sub:'Industry-tuned accuracy',cyan:true},{lbl:'Formatting',big:'Preserved',sub:'Tables, headings, layout'},{lbl:'Search',big:'Semantic',sub:'Find meaning, not strings'}],
      tags:['200+ languages','Formatting retention','Semantic search','Industry-tuned accuracy']},
    gedor:{idx:'003',badge:'Waitlist',cls:'badge--wait',title:'Gedor',desc:'LLM-as-a-Service hosted entirely in the EU: an OpenAI-compatible API over an open-weight catalog, with managed vector databases and compliance built in.',link:'https://gedor.ai/',linkLbl:'Join the waitlist',ext:true,
      tiles:[{lbl:'Status',big:'Waitlist',sub:'Opening in cohorts',bars:[4,9]},{lbl:'Hosted in',big:'EU',sub:'Fully sovereign inference',cyan:true},{lbl:'API',big:'OpenAI-compatible',sub:'Drop-in client support'},{lbl:'Compliance',big:'GDPR · AI Act',sub:'Managed vector DBs'}],
      tags:['OpenAI-compatible API','Open-weight catalog','Managed vector databases','GDPR & EU AI Act compliant']},
    webagen:{idx:'004',badge:'In development',cls:'badge--dev',title:'webAgen',desc:'Agentic website generation platform: describe the site in conversation and let agents build it, content model and all.',link:'contact.html',linkLbl:'Contact us',ext:false,
      tiles:[{lbl:'Status',big:'In development',sub:'Private previews soon',bars:[2,9]},{lbl:'Interface',big:'Conversational',sub:'Describe it, iterate live',cyan:true},{lbl:'Output',big:'Agent-built CMS',sub:'Structured, editable content'},{lbl:'Powered by',big:'ASAI agents',sub:'Same multi-agent core'}],
      tags:['Conversational site-building','Agent-generated CMS']}
  };
  var xp=document.getElementById('xp'),xpPanel=xp&&xp.querySelector('.xp__panel'),xpTiles=document.getElementById('xpTiles'),srcCard=null,xpOpen=false;
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function fill(p){
    document.getElementById('xpIdx').textContent=p.idx;
    var b=document.getElementById('xpBadge');b.textContent=p.badge;b.className='badge '+p.cls;
    document.getElementById('xpTitle').textContent=p.title;
    document.getElementById('xpDesc').textContent=p.desc;
    var l=document.getElementById('xpLink');l.textContent=p.linkLbl;l.href=p.link;if(p.ext){l.target='_blank';l.rel='noopener'}else{l.removeAttribute('target');l.removeAttribute('rel')}
    var h='';
    p.tiles.forEach(function(t,i){
      var d=(0.28+i*0.11).toFixed(2)+'s';
      h+='<div class="xp__tile wipe" style="--d:'+d+'"><span class="lbl">'+esc(t.lbl)+'</span><div><div class="big'+(t.cyan?' is-cyan':'')+'">'+esc(t.big)+'</div><div class="sub">'+esc(t.sub)+'</div></div>';
      if(t.bars){h+='<div class="xp__bars" style="--d:'+d+'">';for(var k=0;k<t.bars[1];k++)h+='<i class="'+(k<t.bars[0]?'on':'')+'" style="--k:'+k+'"></i>';h+='</div>'}
      h+='</div>';
    });
    h+='<div class="xp__tile xp__tile--wide wipe" style="--d:.72s"><span class="lbl">Capabilities</span><ul class="pills">'+p.tags.map(function(t){return '<li class="pill">'+esc(t)+'</li>'}).join('')+'</ul></div>';
    xpTiles.innerHTML=h;
  }
  function targetRect(){
    var vw=innerWidth,vh=innerHeight,m=vw<700?12:Math.max(24,vw*0.04);
    var w=Math.min(vw-m*2,1180),h=Math.min(vh-m*2,vw<900?vh-m*2:720);
    return{left:(vw-w)/2,top:(vh-h)/2,width:w,height:h};
  }
  function openPanel(card){
    var p=PRODUCTS[card.getAttribute('data-product')||card.getAttribute('data-open-product')];if(!p)return;
    srcCard=card;fill(p);xp.hidden=false;xp.classList.add('is-on');document.body.classList.add('nav-open');
    var from=card.getBoundingClientRect(),to=targetRect();
    // size the panel at its final dimensions, then scale it from the card's rect (FLIP)
    xpPanel.style.width=to.width+'px';xpPanel.style.height=to.height+'px';
    var sx=from.width/to.width,sy=from.height/to.height;
    xpPanel.style.transition='none';xpPanel.style.transform='translate('+from.left+'px,'+from.top+'px) scale('+sx+','+sy+')';
    card.style.opacity='0';
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      xpPanel.style.transition='transform 720ms cubic-bezier(.22,1,.36,1)';
      xpPanel.style.transform='translate('+to.left+'px,'+to.top+'px) scale(1,1)';
      xp.classList.add('is-in');xpOpen=true;
      setTimeout(function(){xp.querySelector('.xp__close').focus()},720);
    })});
  }
  function closePanel(){
    if(!xpOpen)return;xpOpen=false;
    var card=srcCard,to=card?card.getBoundingClientRect():null,w=xpPanel.offsetWidth,h=xpPanel.offsetHeight;
    xp.classList.remove('is-in');
    if(to){xpPanel.style.transition='transform 520ms cubic-bezier(.22,1,.36,1)';xpPanel.style.transform='translate('+to.left+'px,'+to.top+'px) scale('+(to.width/w)+','+(to.height/h)+')'}
    setTimeout(function(){xp.classList.remove('is-on');xp.hidden=true;document.body.classList.remove('nav-open');if(card){card.style.opacity='';card.focus()}},520);
  }
  document.querySelectorAll('.glow-card[data-product]').forEach(function(card){
    card.addEventListener('click',function(e){
      if(e.target.closest('.ulink'))return; // the inline link goes straight to the product
      e.preventDefault();openPanel(card);
    });
  });
  document.querySelectorAll('[data-open-product]').forEach(function(b){b.addEventListener('click',function(){openPanel(b)})});
  if(xp){xp.querySelectorAll('[data-xp-close]').forEach(function(el){el.addEventListener('click',closePanel)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&xpOpen)closePanel()});
  addEventListener('resize',function(){if(xpOpen){var to=targetRect();xpPanel.style.transition='none';xpPanel.style.width=to.width+'px';xpPanel.style.height=to.height+'px';xpPanel.style.transform='translate('+to.left+'px,'+to.top+'px)'}});}

  /* ---------------- contact form (Formspree) ---------------- */
  document.querySelectorAll('[data-form]').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var status=form.querySelector('[data-form-status]'),submit=form.querySelector("[type='submit']"),data=new FormData(form);
      if(status){status.hidden=false;status.textContent='Sending…';status.className='form-status'}
      if(submit)submit.disabled=true;
      fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}})
        .then(function(r){if(!r.ok)throw new Error('Request failed');form.reset();if(status){status.textContent='Message sent. We will be in touch.';status.className='form-status is-success'}})
        .catch(function(){if(status){status.textContent='Something went wrong. Email us at info@astrosynapse.ai.';status.className='form-status is-error'}})
        .finally(function(){if(submit)submit.disabled=false});
    });
  });

  /* hero parallax */
  var par=document.querySelector('[data-parallax] video');
  if(par&&!reduce&&matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',function(e){
      var x=(e.clientX/innerWidth-.5)*-14,y=(e.clientY/innerHeight-.5)*-10;
      par.style.transform='scale(1.08) translate('+x+'px,'+y+'px)';
    },{passive:true});
  }
})();
