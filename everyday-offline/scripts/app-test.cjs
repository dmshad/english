// State/UI contracts. Real browser verification is scripts/browser-test.cjs.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const KEY='everyday-offline-v1';let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.equal(a,b,m);checks++;};
function setup(initial,blocked=false){
  const elements=new Map(),store=new Map(initial?[[KEY,initial]]:[]),plays=[],vars={};
  function el(id){if(!elements.has(id))elements.set(id,{id,value:'',innerHTML:'',textContent:'',hidden:false,dataset:{},disabled:false,handlers:{},addEventListener(n,f){this.handlers[n]=f;},focus(){},blur(){},select(){},showModal(){this.open=true;},close(){this.open=false;},setAttribute(){}});return elements.get(id);}
  const synth={getVoices:()=>[{name:'Local US',lang:'en-US',localService:true}],cancel(){},speak(u){plays.push(u);},addEventListener(){}};
  const window={innerHeight:844,scrollTo(){},addEventListener(){},speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}};
  const document={getElementById:el,querySelector:()=>el('meta'),activeElement:null,documentElement:{dataset:{},style:{setProperty(k,v){vars[k]=v;}}},body:{classList:{toggle(){}}}};
  const context=vm.createContext({window,document,localStorage:{getItem(k){if(blocked)throw Error();return store.get(k)||null;},setItem(k,v){if(blocked)throw Error();store.set(k,v);}},navigator:{},console,setTimeout:()=>1,clearTimeout(){}});
  for(const f of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js','content-friend.js','content-library.js','content-intros.js','content-batch-a.js','content-batch-b.js','progress.js','speech.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context);
  const click=data=>el('app').handlers.click({target:{closest:()=>({dataset:data,disabled:false})}});
  const change=(id,value)=>el('app').handlers.change({target:{id,value}});
  const type=text=>{el('answer').value=text;el('app').handlers.input({target:{id:'answer',value:text}});};
  const answer=text=>{type(text);el('app').handlers.submit({target:{id:'answer-form'},preventDefault(){}});};
  const all=window.DIALOGUES.filter(d=>d.checking==='construction');
  const start=(d,mode='text')=>{click({action:'home'});click({mode});change('topic',d.topic);click({action:'start'});};
  const finish=d=>{for(const t of d.turns){if(state().session.mode==='speech')click({action:'show-task'});answer(t.best);click({action:'next'});}};
  const state=()=>JSON.parse(store.get(KEY));
  return {el,store,state,click,change,type,answer,all,start,finish,plays,window,document,html:()=>el('app').innerHTML};
}
const ui=setup();eq(ui.all.length,8);ok(!ui.html().includes('Больше уверенности'));ok(!ui.html().includes('Что распознано'));ok(ui.html().includes('data-level="B2" aria-pressed="false" disabled'));ui.click({level:'B2'});eq(ui.state().settings.level,'A1');
ui.click({theme:'dark'});eq(ui.document.documentElement.dataset.theme,'dark');eq(setup(ui.store.get(KEY)).state().settings.theme,'dark');
const d=ui.all.find(d=>d.id==='batch-shoes');ui.start(d);ok(ui.html().includes(d.context));ok(!ui.html().includes(d.turns[0].en));eq(ui.state().session.phase,'intro');eq(ui.state().completionCounts.text[d.id]||0,0);
ui.click({action:'intro-next'});ok(ui.html().includes(d.turns[0].en));ok(ui.html().includes(d.turns[0].task));ok(!ui.html().includes(d.turns[0].ru));ui.click({action:'translation'});ok(ui.html().includes(d.turns[0].ru));
ui.answer('');eq(ui.state().session.answers.length,0);
ui.answer(d.turns[0].best);eq(ui.state().session.answers[0].status,'correct');eq(ui.state().session.phase,'review');ok(!ui.html().includes('Смысл, конструкция'));ok(!ui.html().includes('Зеленое — распознано'));
ui.click({action:'variants'});ok(ui.html().includes('class="variants"'));ok((ui.html().match(/<li>/g)||[]).length<=10);
ui.click({action:'next'});ui.type('A draft');ui.click({action:'back'});eq(ui.state().session.viewIndex,0);eq(ui.state().session.phase,'review');ui.click({action:'review-back'});ok(ui.html().includes('readonly'));ui.click({action:'back'});eq(ui.state().session.phase,'intro');ui.click({action:'intro-next'});ui.click({action:'show-review'});ui.click({action:'next'});ok(ui.html().includes('A draft'));eq(ui.state().session.index,1);eq(ui.state().session.answers.length,1);
const restored=setup(ui.store.get(KEY));restored.click({action:'resume'});ok(restored.html().includes('A draft'));
for(const t of d.turns.slice(1)){restored.answer(t.best);restored.click({action:'next'});}eq(restored.state().completionCounts.text[d.id],1);eq(restored.state().session.phase,'done');restored.click({action:'next'});eq(restored.state().completionCounts.text[d.id],1);
restored.click({action:'copy-all'});ok(restored.el('copy-text').value.includes(d.ending.en));ok(restored.el('copy-dialog').open);
restored.click({action:'replay'});eq(restored.state().session.phase,'intro');restored.click({action:'intro-next'});restored.finish(d);eq(restored.state().completionCounts.text[d.id],2);eq(new Set(restored.state().history.map(h=>h.runId)).size,2);
// Speech starts with both texts absent and remains a separately counted mode.
const audio=setup(restored.store.get(KEY));audio.start(d,'speech');audio.click({action:'intro-next'});ok(!audio.html().includes(d.turns[0].en));ok(!audio.html().includes(d.turns[0].task));ok(audio.html().includes('data-action="show-task"'));audio.answer(d.turns[0].best);eq(audio.state().session.answers.length,0);
audio.click({action:'listen'});audio.click({action:'listen'});eq(audio.plays.length,2);eq(audio.plays[0].text,d.turns[0].en);eq(audio.plays[0].rate,1);
audio.click({speed:'1'});audio.click({action:'listen'});eq(audio.plays.at(-1).rate,.6);eq((audio.html().match(/data-speed=/g)||[]).length,5);
audio.click({action:'toggle-text'});ok(audio.html().includes(d.turns[0].en));ok(!audio.html().includes(d.turns[0].task));audio.click({action:'translation'});ok(audio.html().includes(d.turns[0].ru));audio.click({action:'toggle-text'});ok(!audio.html().includes(d.turns[0].en));ok(!audio.html().includes(d.turns[0].ru));audio.click({action:'show-task'});ok(audio.html().includes(d.turns[0].task));audio.finish(d);eq(audio.state().completionCounts.speech[d.id],1);eq(audio.state().completionCounts.text[d.id],2);eq(audio.state().session.mode,'speech');
// Minimal-round selection, not merely a lifetime completed flag.
const P=audio.window.OfflineProgress,counts={text:{a:2,b:1,c:1},speech:{}};
eq(P.eligible([{id:'a'},{id:'b'},{id:'c'}],counts,'text').map(d=>d.id).join(','),'b,c');eq(P.eligible([{id:'a'},{id:'b'}],counts,'speech').length,2);
const candidate=ui.all[2],seed={version:4,progressRevision:6,completionCounts:{text:Object.fromEntries(ui.all.map(x=>[x.id,x.id===candidate.id?1:2])),speech:{}},settings:{mode:'text'}};
const round=setup(JSON.stringify(seed));round.click({action:'start'});eq(round.state().session.id,candidate.id);
// Migration preserves old snapshots and marks old completions only in text.
const migrated=setup(JSON.stringify({progressRevision:6,completedIds:[d.id],history:audio.state().history,journal:[{answer:'old unknown',task:'old task'}]}));eq(migrated.state().completionCounts.text[d.id],1);eq(migrated.state().completionCounts.speech[d.id]||0,0);eq(migrated.state().history.length,3);eq(migrated.state().journal.length,1);
const reset=setup(JSON.stringify({progressRevision:5,completedIds:['pilot-library','pilot-friend-evening'],session:{id:'pilot-library',contentRevision:5,index:0,answers:[]},journal:[{answer:'keep',task:'keep'}]}));eq(reset.state().session,null);eq(reset.state().completionCounts.text['pilot-library']||0,0);eq(reset.state().completionCounts.text['pilot-friend-evening'],1);eq(reset.state().journal.length,1);
// All eight active dialogues pass through intro/work/review/result, and history evicts only snapshots.
const runs=setup();for(const x of runs.all){runs.start(x);runs.click({action:'intro-next'});runs.finish(x);eq(runs.state().completionCounts.text[x.id],1);eq(runs.state().session.phase,'done');}
eq(runs.state().history.length,6);eq(Object.keys(runs.state().completionCounts.text).length,8);
const snapshot=runs.state().history[0];runs.all.find(x=>x.id===snapshot.dialogue.id).turns[0].best='UNSAVED_REFERENCE';runs.click({historyView:snapshot.runId});ok(!runs.html().includes('UNSAVED_REFERENCE'));runs.click({historyCopy:snapshot.runId});ok(runs.el('copy-text').value.includes(snapshot.answers[0].answer));
// Unknowns survive six-record history eviction and can be copied with their context.
const unknown=setup();for(let i=0;i<7;i++){unknown.start(d);unknown.click({action:'intro-next'});unknown.answer('An unusual unrecognized sentence '+i);}
eq(unknown.state().history.length,6);eq(unknown.state().journal.length,7);unknown.click({action:'journal'});unknown.click({action:'copy-journal'});ok(unknown.el('copy-text').value.includes('An unusual unrecognized sentence 0'));ok(unknown.el('copy-text').value.includes(d.context));
unknown.click({action:'home'});eq(unknown.state().settings.topic,'random');
const error=setup();error.start(d);error.click({action:'intro-next'});error.answer('I need a comfortable shoes');eq(error.state().session.answers[0].status,'error');ok(error.html().includes('word-error'));ok(error.html().includes('Shoes'));
const injection=setup();injection.start(d);injection.click({action:'intro-next'});injection.answer('<img src=x onerror=alert(1)>');ok(!injection.html().includes('<img src=x'));ok(injection.html().includes('&lt;'));
const broken=setup('{bad');ok(broken.html().includes('Начать диалог'));const unavailable=setup(null,true);ok(unavailable.html().includes('Сохранение недоступно'));
// Only local English voices are selected; rate choices never request a remote voice.
const speech=setup();speech.window.speechSynthesis.getVoices=()=>[{lang:'en-US',localService:false}];let message='';eq(speech.window.OfflineSpeech.play('Hello',5,t=>message=t),false);ok(message);speech.window.speechSynthesis.getVoices=()=>[{lang:'en-GB',localService:true},{lang:'en-US',localService:true}];speech.window.OfflineSpeech.play('Hello',3);eq(speech.plays.at(-1).voice.lang,'en-US');eq(speech.plays.at(-1).rate,.8);
console.log(`${checks} application-state checks passed (mock DOM; real-browser suite is separate).`);
