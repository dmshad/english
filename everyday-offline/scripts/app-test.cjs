// State/UI contracts. Real browser verification is scripts/browser-test.cjs.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const KEY='everyday-offline-v1';let checks=0;const ok=(v,m)=>{assert.ok(v,m);checks++;},eq=(a,b,m)=>{assert.equal(a,b,m);checks++;};
function setup(initial,blocked=false){
  const elements=new Map(),store=new Map(initial?[[KEY,initial]]:[]),plays=[],vars={};
  function el(id){if(!elements.has(id))elements.set(id,{id,value:'',innerHTML:'',textContent:'',hidden:false,dataset:{},disabled:false,handlers:{},addEventListener(n,f){this.handlers[n]=f;},focus(){},blur(){},select(){},showModal(){this.open=true;},close(){this.open=false;},setAttribute(){},removeAttribute(){}});return elements.get(id);}
  const synth={getVoices:()=>[{name:'Ava (Premium)',voiceURI:'com.apple.voice.premium.en-US.Ava',lang:'en-US',localService:true}],cancel(){},speak(u){plays.push(u);},addEventListener(){}};
  const window={innerHeight:844,scrollTo(){},addEventListener(){},speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}};
  const document={getElementById:el,querySelector:()=>el('meta'),activeElement:null,documentElement:{dataset:{},style:{setProperty(k,v){vars[k]=v;}}},body:{classList:{toggle(){}}}};
  const context=vm.createContext({window,document,localStorage:{getItem(k){if(blocked)throw Error();return store.get(k)||null;},setItem(k,v){if(blocked)throw Error();store.set(k,v);}},navigator:{},console,setTimeout:()=>1,clearTimeout(){}});
  for(const f of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','structured.js','content-pilot.js','content-friend.js','content-library.js','content-intros.js','content-batch-a.js','content-batch-b.js','content-a1-batch.js','content-a1-block1-a.js','content-a1-block1-b.js','content-a1-block1-c.js', 'content-a1-block1-expansion.js', 'content-a1-block1-refinement.js','progress.js','speech.js','update.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),context);
  const click=data=>el('app').handlers.click({target:{closest:()=>({dataset:data,disabled:false})}});
  const change=(id,value)=>el('app').handlers.change({target:{id,value}});
  const type=text=>{el('answer').value=text;el('app').handlers.input({target:{id:'answer',value:text}});};
  const answer=text=>{type(text);el('app').handlers.submit({target:{id:'answer-form'},preventDefault(){}});};
  const all=window.DIALOGUES.filter(d=>d.checking==='construction');
  const start=(d)=>{click({action:'home'});click({action:'catalog'});click({dialogue:d.id});click({action:'start-selected'});};
  const finish=d=>{for(const t of d.turns){if(state().session.phase==='stage')click({action:'stage-next'});if(state().session.mode==='speech')click({action:'show-task'});answer(t.best);click({action:'next'});}click({action:'ending-next'});};
  const state=()=>JSON.parse(store.get(KEY));
  return {el,store,state,click,change,type,answer,all,start,finish,plays,window,document,html:()=>el('app').innerHTML};
}
const ui=setup();eq(ui.all.length,14);ok(!ui.html().includes('Больше уверенности'));ok(!ui.html().includes('Что распознано'));ok(ui.html().includes('data-level="B2" aria-pressed="false" disabled'));ui.click({level:'B2'});eq(ui.state().settings.level,'A1');
ui.click({theme:'dark'});eq(ui.document.documentElement.dataset.theme,'dark');eq(setup(ui.store.get(KEY)).state().settings.theme,'dark');
const d=ui.all.find(d=>d.id==='batch-shoes');ui.start(d);ok(ui.html().includes(d.context));ok(!ui.html().includes(d.turns[0].en));eq(ui.state().session.phase,'intro');eq(ui.state().completionCounts[d.id]||0,0);
ui.click({action:'intro-next'});ok(ui.html().includes(d.turns[0].en));ok(ui.html().includes(d.turns[0].task));ok(!ui.html().includes(d.turns[0].ru));ui.click({action:'translation'});ok(ui.html().includes(d.turns[0].ru));
ui.answer('');eq(ui.state().session.answers.length,0);
ui.answer(d.turns[0].best);eq(ui.state().session.answers[0].status,'correct');eq(ui.state().session.phase,'review');ok(!ui.html().includes('Смысл, конструкция'));ok(!ui.html().includes('Зеленое — распознано'));
ui.click({action:'variants'});ok(ui.html().includes('class="variants"'));ok((ui.html().match(/<li>/g)||[]).length<=10);
ui.click({action:'next'});ui.type('A draft');ui.click({action:'back'});eq(ui.state().session.viewIndex,0);eq(ui.state().session.phase,'review');ui.click({action:'review-back'});ok(ui.html().includes('readonly'));ui.click({action:'back'});eq(ui.state().session.phase,'intro');ui.click({action:'intro-next'});ui.click({action:'show-review'});ui.click({action:'next'});ok(ui.html().includes('A draft'));eq(ui.state().session.index,1);eq(ui.state().session.answers.length,1);
const restored=setup(ui.store.get(KEY));restored.click({action:'resume'});ok(restored.html().includes('A draft'));
for(const t of d.turns.slice(1)){if(restored.state().session.phase==='stage')restored.click({action:'stage-next'});restored.answer(t.best);restored.click({action:'next'});}restored.click({action:'ending-next'});eq(restored.state().completionCounts[d.id],1);eq(restored.state().session.phase,'done');restored.click({action:'next'});eq(restored.state().completionCounts[d.id],1);
restored.click({action:'copy-all'});ok(restored.el('copy-text').value.includes(d.ending.en));ok(restored.el('copy-dialog').open);
restored.click({action:'replay'});eq(restored.state().session.phase,'intro');restored.click({action:'intro-next'});restored.finish(d);eq(restored.state().completionCounts[d.id],1);eq(new Set(restored.state().history.map(h=>h.runId)).size,2);
// Hidden text keeps the same session and a single completion counter.
const audio=setup(restored.store.get(KEY));audio.start(d);audio.click({action:'intro-next'});audio.click({action:'toggle-text'});ok(!audio.html().includes(d.turns[0].en));ok(!audio.html().includes(d.turns[0].task));ok(audio.html().includes('data-action="show-task"'));audio.answer(d.turns[0].best);eq(audio.state().session.answers.length,0);
audio.click({action:'listen'});audio.click({action:'listen'});eq(audio.plays.length,2);eq(audio.plays[0].text,d.turns[0].en);eq(audio.plays[0].rate,1);
audio.click({action:'listen'});eq(audio.plays.at(-1).rate,1);eq((audio.html().match(/data-speed=/g)||[]).length,0);
audio.click({action:'toggle-text'});ok(audio.html().includes(d.turns[0].en));ok(audio.html().includes(d.turns[0].task));audio.click({action:'translation'});ok(audio.html().includes(d.turns[0].ru));audio.click({action:'toggle-text'});ok(!audio.html().includes(d.turns[0].en));ok(!audio.html().includes(d.turns[0].ru));audio.click({action:'show-task'});ok(audio.html().includes(d.turns[0].task));audio.finish(d);eq(audio.state().completionCounts[d.id],2);eq(audio.state().session.mode,'speech');
// Replays remain one counted completion even across several repeats and reloads.
const repeat=setup(restored.store.get(KEY));repeat.click({action:'resume'});repeat.click({action:'replay'});eq(repeat.state().session.practiceReplay,true);repeat.click({action:'intro-next'});
for(const t of d.turns.slice(0,3)){repeat.answer(t.best);repeat.click({action:'next'});}
const resumedRepeat=setup(repeat.store.get(KEY));resumedRepeat.click({action:'resume'});for(const t of d.turns.slice(3)){if(resumedRepeat.state().session.phase==='stage')resumedRepeat.click({action:'stage-next'});resumedRepeat.answer(t.best);resumedRepeat.click({action:'next'});}resumedRepeat.click({action:'ending-next'});
eq(resumedRepeat.state().completionCounts[d.id],1);eq(resumedRepeat.state().session.completedRecorded,true);ok(resumedRepeat.state().history.at(-1).practiceReplay);
resumedRepeat.click({action:'replay'});resumedRepeat.click({action:'intro-next'});resumedRepeat.finish(d);eq(resumedRepeat.state().completionCounts[d.id],1);
resumedRepeat.start(d);resumedRepeat.click({action:'intro-next'});resumedRepeat.finish(d);eq(resumedRepeat.state().completionCounts[d.id],2);eq(resumedRepeat.state().session.practiceReplay,false);
const speechRepeat=setup(audio.store.get(KEY));speechRepeat.click({action:'replay'});speechRepeat.click({action:'intro-next'});speechRepeat.finish(d);eq(speechRepeat.state().completionCounts[d.id],2);
// Minimal-round selection, not merely a lifetime completed flag.
const P=audio.window.OfflineProgress,counts={a:2,b:1,c:1};
eq(P.eligible([{id:'a'},{id:'b'},{id:'c'}],counts,'text').map(d=>d.id).join(','),'b,c');eq(P.eligible([{id:'a'},{id:'b'}],{}).length,2);
const candidate=ui.all[2],seed={version:4,progressRevision:6,completionCounts:{text:Object.fromEntries(ui.all.map(x=>[x.id,x.id===candidate.id?1:2])),speech:{}},settings:{mode:'text'}};
const round=setup(JSON.stringify(seed));round.click({action:'start'});eq(round.state().session.id,candidate.id);
// Adding the first A1 batch keeps existing sessions and prioritizes the new material.
const oldProgress=setup();
oldProgress.start(d);oldProgress.click({action:'intro-next'});oldProgress.type('Saved before v0.15');
const oldState=oldProgress.state();
for(const x of oldProgress.all.filter(item=>!item.id.startsWith('a1-')))oldState.completionCounts[x.id]=1;
const afterBatch=setup(JSON.stringify(oldState));
eq(afterBatch.state().session.runId,oldState.session.runId);
eq(afterBatch.state().session.draft,'Saved before v0.15');
eq(afterBatch.state().completionCounts[d.id],1);
afterBatch.click({action:'start'});
ok(afterBatch.state().session.id.startsWith('a1-'));
// Migration preserves old snapshots and merges completion modes.
const migrated=setup(JSON.stringify({progressRevision:6,completedIds:[d.id],history:audio.state().history,journal:[{answer:'old unknown',task:'old task'}]}));eq(migrated.state().completionCounts[d.id],1);eq(migrated.state().history.length,3);eq(migrated.state().journal.length,1);
const reset=setup(JSON.stringify({progressRevision:5,completedIds:['pilot-library','pilot-friend-evening'],session:{id:'pilot-library',contentRevision:5,index:0,answers:[]},journal:[{answer:'keep',task:'keep'}]}));eq(reset.state().session,null);eq(reset.state().completionCounts['pilot-library']||0,0);eq(reset.state().completionCounts['pilot-friend-evening'],1);eq(reset.state().journal.length,1);
// All active dialogues pass through intro/work/review/result, and history evicts only snapshots.
const runs=setup();for(const x of runs.all){runs.start(x);runs.click({action:'intro-next'});runs.finish(x);eq(runs.state().completionCounts[x.id],1);eq(runs.state().session.phase,'done');}
eq(runs.state().history.length,6);eq(Object.keys(runs.state().completionCounts).length,14);
const reloadedStats=setup(runs.store.get(KEY));
reloadedStats.click({action:'statistics'});
ok(reloadedStats.html().includes('Всего пройдено</span><strong>14</strong>'));
ok(reloadedStats.html().includes('aria-label="14 за эту неделю"'));
eq((reloadedStats.html().match(/<abbr /g)||[]).length,7);
eq(P.summarizeActivity(resumedRepeat.state().activity).total,2);
const rollup=P.summarizeActivity({undated:3,days:{'2025-12-28':2,'2025-12-29':1,'2026-01-04':3,'2026-01-05':4,'2026-01-06':5}},new Date(2026,0,6,12));
eq(rollup.total,18);eq(rollup.weekTotal,9);eq(rollup.week[1].today,true);
eq(rollup.week[2].future,true);eq(rollup.previous.map(w=>w.count).join(','),'4,2');
const legacy=setup(JSON.stringify({progressFormat:2,progressRevision:6,completionCounts:{[d.id]:5},session:audio.state().session,history:audio.state().history}));
eq(legacy.state().activity.undated,4);eq(P.summarizeActivity(legacy.state().activity).total,5);
eq(P.summarizeActivity(setup(legacy.store.get(KEY)).state().activity).total,5);
const snapshot=runs.state().history[0];runs.all.find(x=>x.id===snapshot.dialogue.id).turns[0].best='UNSAVED_REFERENCE';runs.click({historyView:snapshot.runId});ok(!runs.html().includes('UNSAVED_REFERENCE'));runs.click({historyCopy:snapshot.runId});ok(runs.el('copy-text').value.includes(snapshot.answers[0].answer));
// Unknowns survive six-record history eviction and can be copied with their context.
const unknown=setup();for(let i=0;i<7;i++){unknown.start(d);unknown.click({action:'intro-next'});unknown.answer('An unusual unrecognized sentence '+i);}
eq(unknown.state().history.length,6);eq(unknown.state().journal.length,7);unknown.click({action:'journal'});unknown.click({action:'copy-journal'});ok(unknown.el('copy-text').value.includes('An unusual unrecognized sentence 0'));ok(unknown.el('copy-text').value.includes(d.context));
unknown.click({action:'home'});ok(!unknown.html().includes('id="topic"'));
const error=setup();error.start(d);error.click({action:'intro-next'});error.answer('I need a comfortable shoes');eq(error.state().session.answers[0].status,'error');ok(error.html().includes('word-error'));ok(error.html().includes('Shoes'));
// An unknown fragment owns the aggregate score even when another fragment is red.
const fragmented=setup(),hotel=fragmented.all.find(d=>d.id==='batch-hotel');
fragmented.start(hotel);fragmented.click({action:'intro-next'});
const original='  I has a reservation under Anna. Blorven.  ';
fragmented.answer(original);
const fragmentedState=fragmented.state(),fragmentedAnswer=fragmentedState.session.answers[0];
eq(fragmentedAnswer.answer,original);eq(fragmentedAnswer.status,'unknown');eq(fragmentedState.journal[0].answer,original);
eq(fragmentedAnswer.annotations.find(t=>t.text==='has').color,'error');
eq(fragmentedAnswer.annotations.find(t=>t.text==='reservation').color,'correct');
eq(fragmentedAnswer.annotations.find(t=>t.text==='Blorven').color,'neutral');
ok(fragmented.html().includes('С I нужно have.'));ok(fragmented.html().includes('class="status unknown">Не распознано'));
eq(fragmentedState.latestResults[hotel.id].counts.unknown,1);eq(fragmentedState.latestResults[hotel.id].counts.error,0);
const fragmentedReload=setup(fragmented.store.get(KEY));
fragmentedReload.click({historyView:fragmentedState.history[0].runId});
for(const color of ['correct','error','neutral'])ok(fragmentedReload.html().includes('word-'+color));
const injection=setup();injection.start(d);injection.click({action:'intro-next'});injection.answer('<img src=x onerror=alert(1)>');ok(!injection.html().includes('<img src=x'));ok(injection.html().includes('&lt;'));
const broken=setup('{bad');ok(broken.html().includes('Начать следующий диалог'));const unavailable=setup(null,true);ok(unavailable.html().includes('Сохранение недоступно'));
// Only local English voices are selected; rate choices never request a remote voice.
const speech=setup();speech.window.speechSynthesis.getVoices=()=>[{lang:'en-US',localService:false}];let message='';eq(speech.window.OfflineSpeech.play('Hello',5,t=>message=t),false);ok(message);speech.window.speechSynthesis.getVoices=()=>[{lang:'en-GB',localService:true},{lang:'en-US',localService:true}];speech.window.OfflineSpeech.play('Hello',3);eq(speech.plays.at(-1).lang,'en');eq(speech.plays.at(-1).voice,undefined);eq(speech.plays.at(-1).rate,1);
// Scene pages and the unanswered final line are independent steps, with resumable navigation.
const scene=setup();scene.start(d);scene.click({action:'intro-next'});
for(const t of d.turns.slice(0,3)){scene.answer(t.best);scene.click({action:'next'});}
eq(scene.state().session.phase,'stage');ok(scene.html().includes(d.turns[3].stage));ok(!scene.html().includes('id="answer"'));ok(!scene.html().includes(d.turns[3].en));
scene.click({action:'stage-back'});eq(scene.state().session.viewIndex,2);scene.click({action:'next'});eq(scene.state().session.phase,'stage');scene.click({action:'stage-next'});eq(scene.state().session.phase,'work');ok(!scene.html().includes(d.turns[3].stage));scene.click({action:'back'});eq(scene.state().session.phase,'stage');
const last=setup();last.start(d);last.click({action:'intro-next'});for(const t of d.turns){if(last.state().session.phase==='stage')last.click({action:'stage-next'});last.answer(t.best);last.click({action:'next'});}
eq(last.state().session.phase,'ending');eq(last.state().completionCounts[d.id]||0,0);eq(last.state().session.completedRecorded,false);ok(last.html().includes(d.ending.en));ok(!last.html().includes('class="stats"'));ok(!last.html().includes('id="answer"'));
const lastReload=setup(last.store.get(KEY));ok(lastReload.html().includes('data-action="resume"'));lastReload.click({action:'resume'});eq(lastReload.state().session.phase,'ending');eq(lastReload.state().session.completedRecorded,false);lastReload.click({action:'ending-back'});eq(lastReload.state().session.phase,'review');lastReload.click({action:'next'});eq(lastReload.state().session.phase,'ending');lastReload.click({action:'ending-next'});eq(lastReload.state().completionCounts[d.id],1);ok(!lastReload.html().includes(d.ending.en));lastReload.click({action:'ending-next'});eq(lastReload.state().completionCounts[d.id],1);
// Old speed preferences cannot change the fixed 1.0 rate.
const fixed=setup(JSON.stringify({settings:{speed:1,speedScale:2}}));fixed.window.OfflineSpeech.play('Hello',1);eq(fixed.plays.at(-1).rate,1);ok(!Object.hasOwn(fixed.state().settings,'speed'));
const av=setup();eq(av.state().settings.voiceURI,'com.apple.voice.premium.en-US.Ava');av.window.OfflineSpeech.play('Hello',3,()=>{},av.state().settings.voiceURI);eq(av.plays.at(-1).voice.name,'Ava (Premium)');eq(av.plays.at(-1).rate,1);
av.window.speechSynthesis.getVoices=()=>[{name:'Ava',voiceURI:'com.apple.voice.compact.en-US.Ava',lang:'en-US',localService:true}];let noPremium='';eq(av.window.OfflineSpeech.play('Hello',3,t=>noPremium=t,'@ava-premium'),false);ok(noPremium.includes('Premium'));
av.window.speechSynthesis.getVoices=()=>[{name:'Other',voiceURI:'other',lang:'en-US',localService:true},{name:'Ava',voiceURI:'com.apple.voice.premium.en-US.Ava',lang:'en-US',localService:true}];eq(av.window.OfflineSpeech.voice('@ava-premium').voiceURI,'com.apple.voice.premium.en-US.Ava');av.window.OfflineSpeech.play('Hello',5,()=>{},'@ava-premium');eq(av.plays.at(-1).rate,1);
const homeOrder=setup().html();ok(homeOrder.indexOf('data-action="history"')>homeOrder.indexOf('data-action="start"'));
// Switching midway preserves run identity, drafts, answers, and survives reload.
const mixed=setup();mixed.start(d);mixed.click({action:'intro-next'});mixed.type('My draft');const mixedId=mixed.state().session.runId;
mixed.click({action:'toggle-text'});eq(mixed.state().session.runId,mixedId);ok(mixed.html().includes('My draft'));ok(mixed.html().includes(d.turns[0].task));mixed.answer(d.turns[0].best);eq(mixed.state().session.answers.length,1);
mixed.click({action:'toggle-text'});eq(mixed.state().session.phase,'review');mixed.click({action:'next'});const mixedReload=setup(mixed.store.get(KEY));mixedReload.click({action:'resume'});eq(mixedReload.state().session.runId,mixedId);eq(mixedReload.state().session.answers.length,1);
// Manual circles change progress only after confirmation, preserving statistics/history.
const marks=setup(runs.store.get(KEY));marks.click({action:'catalog'});ok(marks.html().includes('data-mark="'+d.id+'"'));ok(!marks.html().includes('id="topic"'));marks.click({mark:d.id});eq(marks.state().completionCounts[d.id],1);ok(marks.el('mark-dialog').open);marks.el('cancel-mark').handlers.click();eq(marks.state().completionCounts[d.id],1);
marks.click({mark:d.id});marks.el('mark-dialog').handlers.close();marks.el('confirm-mark').handlers.click();eq(marks.state().completionCounts[d.id],0);eq(marks.state().latestResults[d.id].counts.correct,10);eq(marks.state().history.length,6);
marks.click({mark:d.id});marks.el('confirm-mark').handlers.click();eq(marks.state().completionCounts[d.id],1);marks.click({dialogue:d.id});ok(marks.html().includes('class="last-stats"'));ok(marks.html().includes('data-action="start-selected"'));
eq(P.summarizeActivity(marks.state().activity).total,14);
// Summary remains after its full snapshot leaves the six-entry history.
ok(!runs.state().history.some(h=>h.dialogue.id===runs.all[0].id));eq(runs.state().latestResults[runs.all[0].id].counts.correct,10);
// Summing modes happens once; pending old sessions still resume without losing drafts.
const summed=setup(JSON.stringify({progressRevision:6,completionCounts:{text:{[d.id]:2},speech:{[d.id]:3}}}));eq(summed.state().completionCounts[d.id],5);eq(setup(summed.store.get(KEY)).state().completionCounts[d.id],5);
// Future catalogue: three themes with uneven sizes rotate, with minimal counts first.
const future=[{id:'a1',topic:'a'},{id:'a2',topic:'a'},{id:'a3',topic:'a'},{id:'b1',topic:'b'},{id:'b2',topic:'b'},{id:'c1',topic:'c'},{id:'c2',topic:'c'}];let order=[];
const rotation=[];for(let i=0;i<9;i++){const pool=P.balanced(future,{},order,()=>0),topic=pool[0].topic;rotation.push(topic);order=[...order.filter(t=>t!==topic),topic];}
eq(rotation.join(','),'a,b,c,a,b,c,a,b,c');eq(P.balanced(future,{a1:1,a2:1,a3:1,b1:1,b2:1},['c','a','b'],()=>0)[0].topic,'c');
const queued=setup();queued.click({action:'start'});const topic1=queued.all.find(x=>x.id===queued.state().session.id).topic;const queuedReload=setup(queued.store.get(KEY));queuedReload.click({action:'start'});ok(queuedReload.all.find(x=>x.id===queuedReload.state().session.id).topic!==topic1);
// Failed clipboard writes retain every record. Full manual fallback copy removes just that batch.
eq(unknown.state().journal.length,7);unknown.click({action:'journal'});unknown.click({action:'copy-journal'});ok(unknown.el('copy-text').value.startsWith('Нераспознанные ответы из приложения Everyday'));
unknown.el('copy-dialog').handlers.close();const field=unknown.el('copy-text');field.selectionStart=0;field.selectionEnd=field.value.length;let copied='';field.handlers.copy({clipboardData:{setData(type,text){copied=text;}},preventDefault(){}});ok(copied.includes(d.context));eq(unknown.state().journal.length,0);eq(setup(unknown.store.get(KEY)).state().journal.length,0);
// Older valid archives without timestamps cannot prevent newer statistics from updating.
const oldArchive=JSON.parse(JSON.stringify(restored.state().history[0]));delete oldArchive.updatedAt;delete oldArchive.startedAt;const oldSummary=setup(JSON.stringify({progressRevision:6,history:[oldArchive]}));oldSummary.start(d);oldSummary.click({action:'intro-next'});oldSummary.answer('Another unknown answer');eq(oldSummary.state().latestResults[d.id].counts.unknown,1);
console.log(`${checks} application-state checks passed (mock DOM; real-browser suite is separate).`);
