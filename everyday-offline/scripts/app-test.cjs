// Application-state unit tests. Minimal fake DOM, not a browser or visual QA.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const KEY = 'everyday-offline-v1';
let checks = 0;
function ok(value) { assert.ok(value); checks++; }
function equal(value, expected) { assert.equal(value, expected); checks++; }
function setup(initial, blocked = false) {
  const elements = new Map();
  const store = new Map(initial ? [[KEY,initial]] : []);
  function el(id) {
    if (!elements.has(id)) elements.set(id, {
      id, value:'', innerHTML:'', textContent:'', hidden:false, handlers:{},
      addEventListener(name,fn) { this.handlers[name] = fn; }, focus(){}, scrollIntoView(){}, select(){},
      showModal(){this.open = true;}, close(){this.open = false;}
    });
    return elements.get(id);
  }
  const context = vm.createContext({
    window:{scrollTo(){},location:{protocol:'https:',href:'https://dmshad.github.io/english/',assign(url){this.href=url;}}}, document:{getElementById:el, querySelectorAll:()=>[], querySelector:()=>el('query'), body:{append(){}}},
    localStorage:{getItem(key){if (blocked) throw Error('blocked'); return store.get(key) || null;},setItem(key,value){if(blocked)throw Error('blocked');store.set(key,value);}},
    navigator:{onLine:true}, URL, setTimeout:()=>1, clearTimeout(){}, console
  });
  for (const file of ['engine.js','content.js','content-stage1.js','content-ten.js','content-answers.js','app.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  const click = (data) => el('app').handlers.click({target:{closest:()=>({dataset:data,hasAttribute:name=>name==='data-copy-turn' && 'copyTurn' in data})}});
  const change = (id,value) => el('app').handlers.change({target:{id,value}});
  const answer = text => {el('answer').value = text; el('app').handlers.input({target:{id:'answer',value:text}}); el('app').handlers.submit({target:{id:'answer-form'},preventDefault(){}});};
  return {el,click,change,answer,store,state:()=>JSON.parse(store.get(KEY)),html:()=>el('app').innerHTML,all:context.window.DIALOGUES,window:context.window,navigator:context.navigator};
}
let ui = setup();
ok(ui.html().includes('Твой следующий разговор'));
ui.click({level:'B2'}); ok(ui.html().includes('Для B2 в этом выборе диалогов пока нет')); ok(ui.html().includes('data-action="start" disabled'));
ui.click({level:'A1'});
ui.change('topic','cafe');
ui.change('dialogue-choice','coffee-to-go'); ui.click({action:'start'});
equal(ui.state().session.id,'coffee-to-go');
ok(ui.html().includes('<details><summary>Показать перевод</summary>'));
ok(!ui.html().includes('Как можно сказать'));
ui.answer(''); equal(ui.state().session.answers.length,0);
ui.answer('Can I get a small coffee to go, please?'); equal(ui.state().session.answers[0].status,'correct');
ui.click({action:'next'}); equal(ui.state().session.index,1);
ui.el('answer').value = 'No milk'; ui.el('app').handlers.input({target:{id:'answer',value:'No milk'}});
const restored = setup(ui.store.get(KEY));
ok(restored.html().includes('Продолжить'));
restored.click({action:'resume'}); ok(restored.html().includes('>No milk</textarea>'));
restored.answer('Milk, please.'); equal(restored.state().session.answers[1].status,'unknown'); equal(restored.state().journal.length,1);
restored.click({action:'retry'}); equal(restored.state().session.answers.length,1);
restored.answer('No milk, thanks.'); equal(restored.state().session.answers[1].status,'correct'); equal(restored.state().journal.length,1);
restored.click({action:'next'}); equal(restored.state().session.index,2);
restored.answer('Card, please.'); restored.click({action:'next'});
for(const t of restored.all[0].turns.slice(3)){restored.answer(t.best);restored.click({action:'next'});}
equal(restored.state().session.index,10); ok(restored.html().includes('Диалог пройден'));
restored.click({action:'another'}); ok(restored.state().session.id!=='coffee-to-go');
restored.click({action:'reveal'}); equal(restored.state().session.answers[0].status,'revealed'); equal(restored.state().journal.length,1);
restored.click({action:'home'}); restored.el('journal-button').handlers.click(); ok(restored.el('journal-dialog').open); ok(restored.el('journal-content').innerHTML.includes('Milk, please.'));
restored.el('clear-journal').handlers.click(); equal(restored.el('clear-confirm').hidden,false);
restored.el('confirm-clear').handlers.click(); equal(restored.state().journal.length,0);
// Every authored conversation can run to completion through the UI event handlers.
for (const d of ui.all) {
  const run = setup(); run.click({length:d.length}); run.change('topic',d.topic); run.change('dialogue-choice',d.id); run.click({action:'start'});
  for (const t of d.turns) {run.answer(t.best); run.click({action:'next'});}
  equal(run.state().session.index,d.turns.length); ok(run.html().includes('Диалог пройден'));
  equal(run.state().session.answers.filter(a=>a.status==='correct').length,d.turns.length);
  run.click({action:'copy-all'}); ok(run.el('copy-dialog').open); ok(run.el('copy-text').value.includes(d.ending.en));
}
const injection = setup(); injection.click({action:'start'}); injection.answer('<img src=x onerror=alert(1)>');
ok(!injection.html().includes('<img src=x')); ok(injection.html().includes('&lt;img src=x'));
const noStorage = setup(null,true); ok(noStorage.html().includes('Хранилище браузера недоступно'));
noStorage.click({action:'start'}); noStorage.click({action:'reveal'}); noStorage.click({action:'next'}); ok(noStorage.html().includes('Твоя реплика 2 из 10'));
const corrupt = setup('{bad-json'); ok(corrupt.html().includes('Твой следующий разговор'));
const invalidSession = setup(JSON.stringify({session:{id:'coffee-to-go',index:99,answers:[]}})); ok(!invalidSession.html().includes('Продолжить'));
const oldVersion = setup(JSON.stringify({session:{id:'breakfast',index:5,answers:[]},journal:[{answer:'my old answer',task:'old task'}]}));
equal(oldVersion.state().session,null); equal(oldVersion.state().journal.length,1);
ok(oldVersion.html().includes('История и журнал нераспознанных ответов сохранены'));
ok(ui.html().includes('из 10'));
ok(!ui.html().includes('Длина диалога'));
ok(!ui.html().includes('data-length='));
// History keeps six runs, while lifetime completion flags survive eviction.
const archive = setup();
for (const d of archive.all.slice(0,7)) {
  archive.click({action:'home'}); archive.click({length:d.length}); archive.change('topic',d.topic);
  archive.change('dialogue-choice',d.id); archive.click({action:'start'});
  equal(archive.state().completedIds.includes(d.id),false); // Opening is not completing.
  for (const t of d.turns) { archive.answer(t.best); archive.click({action:'next'}); }
  equal(archive.state().completedIds.includes(d.id),true);
}
equal(archive.state().history.length,6); equal(archive.state().completedIds.length,7);
ok(!archive.state().history.some(h=>h.dialogue.id==='coffee-to-go'));
const activeBeforeHistory = JSON.stringify(archive.state().session);
const latest = archive.state().history.at(-1);
archive.click({action:'history'}); ok(archive.html().includes('История')); ok(archive.html().includes('Посмотреть ответы'));
archive.click({historyView:latest.runId}); ok(archive.html().includes(latest.answers[0].answer));
archive.click({historyCopy:latest.runId}); ok(archive.el('copy-text').value.includes(latest.dialogue.turns[0].en));
ok(archive.el('copy-text').value.includes(latest.answers[0].answer));
equal(JSON.stringify(archive.state().session),activeBeforeHistory);
archive.all.find(d=>d.id===latest.dialogue.id).turns[0].best = 'NEW REFERENCE SHOULD NOT APPEAR';
archive.click({historyView:latest.runId}); ok(!archive.html().includes('NEW REFERENCE SHOULD NOT APPEAR'));
const loadedArchive = setup(archive.store.get(KEY)); equal(loadedArchive.state().history.length,6); equal(loadedArchive.state().completedIds.length,7);
// Lifetime flags apply across topic/random changes, and stale explicit selection cannot bypass them.
const shortIds = ui.all.filter(d=>d.length==='long').map(d=>d.id);
const unseenId = 'bread-sliced';
const onlyOne = setup(JSON.stringify({progressRevision:3,completedIds:shortIds.filter(id=>id!==unseenId)}));
onlyOne.change('dialogue-choice','coffee-to-go'); onlyOne.click({action:'start'}); equal(onlyOne.state().session.id,unseenId);
onlyOne.answer(onlyOne.all.find(d=>d.id===unseenId).turns[0].best);
equal(onlyOne.state().completedIds.includes(unseenId),false);
equal(onlyOne.state().history.length,1);
onlyOne.click({action:'home'}); onlyOne.change('topic','bakery'); onlyOne.click({action:'start'}); equal(onlyOne.state().session.id,unseenId);
// When all matching dialogues are completed, repetition is available.
const repeat = setup(JSON.stringify({progressRevision:3,completedIds:shortIds})); repeat.change('topic','cafe'); repeat.change('dialogue-choice','coffee-to-go'); repeat.click({action:'start'}); equal(repeat.state().session.id,'coffee-to-go');
// Old per-filter "seen" meant opened, so it must not mark untouched dialogues as completed.
const oldSeen = setup(JSON.stringify({seen:{'A1:random:short':shortIds}})); equal(oldSeen.state().completedIds.length,0);
// Content migration keeps history/journal, reopens changed scenarios and retains unchanged completions.
const legacyState = archive.state();
legacyState.progressRevision=2;
legacyState.completedIds=['coffee-to-go','breakfast'];
legacyState.session={id:'coffee-to-go',contentRevision:2,index:4,answers:[],startedAt:new Date().toISOString()};
const legacy=setup(JSON.stringify(legacyState));
equal(legacy.state().session,null); equal(legacy.state().history.length,6);
ok(!legacy.state().completedIds.includes('coffee-to-go'));ok(legacy.state().completedIds.includes('breakfast'));
const stable=setup(legacy.store.get(KEY));ok(stable.state().completedIds.includes('breakfast'));
// Repeated runs of the same dialogue are separate history records, not one overwritten record.
const repeats = setup(JSON.stringify({progressRevision:3,completedIds:shortIds}));
for (let i=0;i<7;i++) {
  repeats.click({action:'home'}); repeats.change('topic','cafe'); repeats.change('dialogue-choice','coffee-to-go'); repeats.click({action:'start'});
  for(const t of repeats.all[0].turns){repeats.answer(t.best);repeats.click({action:'next'});}
}
equal(repeats.state().history.length,6); equal(new Set(repeats.state().history.map(h=>h.runId)).size,6);
const updater=setup();updater.change('dialogue-choice','coffee-to-go');updater.click({action:'start'});
updater.el('answer').value='My draft';updater.el('app').handlers.input({target:{id:'answer',value:'My draft'}});
updater.click({action:'home'});const beforeUpdate=JSON.stringify(updater.state().session);updater.click({action:'update'});
ok(updater.window.location.href.includes('update='));equal(JSON.stringify(updater.state().session),beforeUpdate);
const offline=setup();offline.window.location.protocol='file:';offline.window.location.href='file:///test/index.html';offline.click({action:'update'});equal(offline.window.location.href,'file:///test/index.html');
const disconnected=setup();disconnected.navigator.onLine=false;disconnected.click({action:'update'});equal(disconnected.window.location.href,'https://dmshad.github.io/english/');
// Each opened answer list, including those in history, has at most ten entries.
const cap=setup();cap.change('dialogue-choice','window-table');cap.click({action:'start'});cap.answer(cap.all[1].turns[0].best);
for(const match of cap.html().matchAll(/<details class="variants">([\s\S]*?)<\/details>/g))ok((match[1].match(/<li>/g)||[]).length<=10);
console.log(`${checks} application-state checks passed (mock DOM; visual browser check still required).`);
